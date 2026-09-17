import React, { createContext, useContext, useEffect, useState } from 'react';
import { fspcApi } from '@/lib/fspcApi';

const StoreContext = createContext(null);

// @ts-ignore
export function StoreProvider({ children }) {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fspcApi
      .getStore()
      .then((data) => {
        if (active) {
          setStore(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load store:', error);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <StoreContext.Provider 
// @ts-ignore
    value={{ store, loading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore must be used inside StoreProvider');
  }

  return context;
}