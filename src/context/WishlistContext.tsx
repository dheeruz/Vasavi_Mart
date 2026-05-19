import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from './ProductContext';
import { useAuth } from './AuthContext';
import { API_ENDPOINTS } from '../config/api';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Wishlist
  useEffect(() => {
    setIsLoaded(false);
    if (user) {
      const token = localStorage.getItem('vasavi_token');
      fetch(API_ENDPOINTS.WISHLIST, {
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
          console.error('Failed to fetch wishlist', err);
          setIsLoaded(true);
        });
    } else {
      const savedWishlist = localStorage.getItem('vasavi_mart_wishlist');
      setItems(savedWishlist ? JSON.parse(savedWishlist) : []);
      setIsLoaded(true);
    }
  }, [user]);

  // Sync Wishlist
  useEffect(() => {
    if (!isLoaded) return;
    if (user) {
      const token = localStorage.getItem('vasavi_token');
      const productIds = items.map(item => item.id);
      fetch(`${API_ENDPOINTS.WISHLIST}/sync`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productIds })
      }).catch(err => console.error('Failed to sync wishlist', err));
    } else {
      localStorage.setItem('vasavi_mart_wishlist', JSON.stringify(items));
    }
  }, [items, user, isLoaded]);

  const addToWishlist = (product: Product) => {
    setItems(prev => {
      if (prev.some(item => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
