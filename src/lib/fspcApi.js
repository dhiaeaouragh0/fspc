// Centralized API client for the FS PC storefront backend.
// Base URL: https://saas.dhiae.space/api · store slug: fs-pc
// Every public request is scoped with ?store=fs-pc.

const API_URL = 'https://saas.dhiae.space/api';
export const STORE_SLUG = 'fs-pc';

async function request(path, { params = {}, scopeStore = true, ...init } = {}) {
  const url = new URL(`${API_URL}${path}`);
  if (scopeStore) url.searchParams.set('store', STORE_SLUG);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  });
  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const err = new Error(`FS PC API ${res.status}`);
    err.status = res.status;
    try { err.body = await res.json(); } catch { /* ignore */ }
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export const fspcApi = {
  getStore: () => request(`/stores/by-slug/${STORE_SLUG}`, { scopeStore: false }),

  getCategories: () => request('/categories', { params: { flat: 'false' } }),

  getProducts: (opts = {}) => {
    const { page = 1, limit = 12, search, category, brand, minPrice, maxPrice, isFeatured, inStock } = opts;
    return request('/products', {
      params: { page, limit, search, category, brand, minPrice, maxPrice, isFeatured, inStock },
    });
  },

  getProduct: (idOrSlug) => request(`/products/${idOrSlug}`),

  getWilayas: () => request('/shipping-wilayas'),

  createOrder: (payload) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify({ ...payload, store: STORE_SLUG }),
    }),
};