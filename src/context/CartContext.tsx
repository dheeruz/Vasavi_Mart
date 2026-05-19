import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from './ProductContext';
import { useAuth } from './AuthContext';
import { API_ENDPOINTS } from '../config/api';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Cart
  useEffect(() => {
    setIsLoaded(false);
    if (user) {
      const token = localStorage.getItem('vasavi_token');
      fetch(API_ENDPOINTS.CART, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setItems(data);
          }
          setIsLoaded(true);
        })
        .catch(err => {
          console.error('Failed to fetch cart', err);
          setIsLoaded(true);
        });
    } else {
      const savedCart = localStorage.getItem('vasavi_mart_cart');
      setItems(savedCart ? JSON.parse(savedCart) : []);
      setIsLoaded(true);
    }
  }, [user]);

  // Sync Cart
  useEffect(() => {
    if (!isLoaded) return;
    if (user) {
      const token = localStorage.getItem('vasavi_token');
      fetch(`${API_ENDPOINTS.CART}/sync`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cartItems: items })
      }).catch(err => console.error('Failed to sync cart', err));
    } else {
      localStorage.setItem('vasavi_mart_cart', JSON.stringify(items));
    }
  }, [items, user, isLoaded]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
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

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
