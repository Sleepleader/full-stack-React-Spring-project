import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCartItems } from '../api/cart';

interface CartContextType {
  cartCount: number;
  refreshCart: () => Promise<void>;
  incrementCart: (qty?: number) => void;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCart: async () => {},
  incrementCart: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    try {
      const res = await getCartItems();
      if (res.data.code === 200 && res.data.data) {
        const total = res.data.data.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(total);
      }
    } catch {
      // ignore — user may not be logged in
    }
  }, []);

  // Optimistic increment without refetching
  const incrementCart = useCallback((qty: number = 1) => {
    setCartCount((prev) => prev + qty);
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart, incrementCart }}>
      {children}
    </CartContext.Provider>
  );
};
