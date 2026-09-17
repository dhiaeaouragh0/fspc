import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import CartDrawer from '@/components/fs-pc/store/CartDrawer';

const CART_KEY = 'fspc_cart_v1';
const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Cart item key = productId + variantSku (so different variants are separate lines).
function itemKey({ productId, variantSku }) {
  return `${productId}::${variantSku || 'default'}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const key = itemKey(item);
      const existing = prev.find((i) => itemKey(i) === key);
      if (existing) {
        return prev.map((i) => (itemKey(i) === key ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i));
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    setIsOpen(true);
  }, []);

  const updateQty = useCallback((productId, variantSku, quantity) => {
    setItems((prev) =>
      prev
        .map((i) =>
          itemKey(i) === itemKey({ productId, variantSku })
            ? { ...i, quantity: Math.max(1, quantity) }
            : i
        )
    );
  }, []);

  const removeItem = useCallback((productId, variantSku) => {
    setItems((prev) => prev.filter((i) => itemKey(i) !== itemKey({ productId, variantSku })));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i.unitPrice) || 0) * i.quantity, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, updateQty, removeItem, clearCart, subtotal, count, isOpen, openCart, closeCart }),
    [items, addItem, updateQty, removeItem, clearCart, subtotal, count, isOpen, openCart, closeCart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}