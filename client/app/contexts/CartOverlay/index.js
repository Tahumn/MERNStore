/**
 * Cart overlay visibility context
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

const CartOverlayContext = createContext(null);

export const CartOverlayProvider = ({ children }) => {
  const [showCart, setShowCart] = useState(false);

  const openCart = useCallback(() => setShowCart(true), []);
  const closeCart = useCallback(() => setShowCart(false), []);

  const value = useMemo(
    () => ({
      showCart,
      setShowCart,
      openCart,
      closeCart
    }),
    [showCart, openCart, closeCart]
  );

  return (
    <CartOverlayContext.Provider value={value}>
      {children}
    </CartOverlayContext.Provider>
  );
};

export const useCartOverlay = () => {
  const context = useContext(CartOverlayContext);

  if (!context) {
    throw new Error('useCartOverlay must be used within CartOverlayProvider');
  }

  return context;
};

export default CartOverlayContext;
