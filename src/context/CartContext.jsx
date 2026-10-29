import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const getCartKey = (userId) => `laptop_store_cart_${userId || 'guest'}`;

function loadCart(userId) {
  try {
    const saved = localStorage.getItem(getCartKey(userId));
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Lỗi khi đọc giỏ hàng từ localStorage:', error);
    return [];
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.userId;

  const [cartItems, setCartItems] = useState(() => loadCart(userId));

  // Khi user thay đổi (đăng nhập/đăng xuất), nạp lại đúng giỏ hàng của họ
  useEffect(() => {
    setCartItems(loadCart(userId));
  }, [userId]);

  // Lưu giỏ hàng vào đúng key mỗi khi có thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(getCartKey(userId), JSON.stringify(cartItems));
    } catch (error) {
      console.error('Lỗi khi lưu giỏ hàng vào localStorage:', error);
    }
  }, [cartItems, userId]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}