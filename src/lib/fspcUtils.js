// Helpers for the FS PC storefront: price formatting, phone validation, variant matching.

export function formatPrice(n) {
  const num = Math.round(Number(n) || 0);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' DA';
}

const PHONE_REGEX = /^(0[567]\d{8}|\+213[567]\d{8})$/;
export function validatePhone(phone) {
  const clean = (phone || '').replace(/[\s.-]/g, '');
  return PHONE_REGEX.test(clean);
}

// Match a selected attribute map against a variant's attributes.
function variantMatches(variant, selected) {
  if (!selected || Object.keys(selected).length === 0) return true;
  return Object.entries(selected).every(([k, v]) => variant.attributes?.[k] === v);
}

// Find the variant matching the current selection. Falls back to default/first.
export function findVariant(product, selected) {
  const variants = product?.variants || [];
  if (variants.length === 0) return null;
  const matched = variants.find((v) => variantMatches(v, selected));
  if (matched) return matched;
  return variants.find((v) => v.isDefault) || variants[0];
}

export function resolvePrice(product, variant) {
  if (variant && typeof variant.price === 'number') return variant.price;
  return product?.basePrice ?? 0;
}

export function resolveStock(product, variant) {
  if (variant && typeof variant.stock === 'number') return variant.stock;
  return product?.variants?.[0]?.stock ?? 0;
}

export function resolveImages(product, variant) {
  const productImages = Array.isArray(product?.images)
    ? product.images.filter(Boolean)
    : [];

  // 1. Product-level images always have priority
  if (productImages.length > 0) {
    return productImages;
  }

  const variants = Array.isArray(product?.variants)
    ? product.variants
    : [];

  // 2. Selected variant has its own image
  if (variant?.images?.length) {
    return variant.images.filter(Boolean);
  }

  // 3. Try to find another variant matching the first option.
  // Example:
  // RED + 16 has no image
  // RED + 8 has image -> use RED + 8 image
  if (variant?.attributes) {
    const optionNames = Object.keys(variant.attributes);

    if (optionNames.length > 0) {
      const firstOptionName = optionNames[0];
      const firstOptionValue = variant.attributes[firstOptionName];

      const sameFirstOption = variants.find(
        // @ts-ignore
        (v) =>
          v !== variant &&
          v.attributes?.[firstOptionName] === firstOptionValue &&
          Array.isArray(v.images) &&
          v.images.length > 0
      );

      if (sameFirstOption) {
        return sameFirstOption.images.filter(Boolean);
      }
    }
  }

  // 4. Fallback to the first variant that has an image
  const firstVariantWithImage = variants.find(
    (v) => Array.isArray(v.images) && v.images.length > 0
  );

  if (firstVariantWithImage) {
    return firstVariantWithImage.images.filter(Boolean);
  }

  // 5. Nothing has an image
  return ['/product-placeholder.svg'];
}




// Default selection = the default variant's attributes, else first value of each option.
export function defaultSelection(product) {
  const types = product?.optionTypes || [];
  if (types.length === 0) return {};
  const def = product.variants?.find((v) => v.isDefault);
  if (def?.attributes) return { ...def.attributes };
  const sel = {};
  types.forEach((t) => {
    if (t.values?.length) sel[t.name] = t.values[0];
  });
  return sel;
}

// Whether selecting `value` for `optionName` (keeping other current picks) yields a real variant.
export function isOptionAvailable(product, optionName, value, selected) {
  const test = { ...selected, [optionName]: value };
  return (product?.variants || []).some((v) => variantMatches(v, test));
}