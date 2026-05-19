import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import type { Product } from '../types/product';
export type { Product };

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(API_ENDPOINTS.PRODUCTS)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products', err));
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const res = await fetch(API_ENDPOINTS.PRODUCTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const newProduct = await res.json();
      setProducts(prev => [newProduct, ...prev]);
    } catch (err) {
      console.error('Failed to add product', err);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updated = await res.json();
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      
      // Keep low stock alert trigger
      if (updates.stock !== undefined && updated.stock <= 10) {
        const adminProfile = JSON.parse(localStorage.getItem('admin_profile') || '{"email": "admin@vasavimart.com"}');
        fetch(`${API_ENDPOINTS.NOTIFY}/low-stock-alert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productData: updated, adminEmail: adminProfile.email })
        }).catch(err => console.error('Inventory alert failed', err));
      }
    } catch (err) {
      console.error('Failed to update product', err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
