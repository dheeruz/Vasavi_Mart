import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts as initialProducts } from '../data/mockProducts';
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
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vasavi_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('vasavi_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `p${Date.now()}`
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => {
      const updatedProducts = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      
      // Check for Low Stock Trigger
      if (updates.stock !== undefined) {
        const product = updatedProducts.find(p => p.id === id);
        if (product && typeof product.stock === 'number' && product.stock <= 10) {
          const savedNotifications = localStorage.getItem('admin_notifications');
          const notificationPrefs = savedNotifications ? JSON.parse(savedNotifications) : { inventory: true };
          const savedProfile = localStorage.getItem('admin_profile');
          const adminProfile = savedProfile ? JSON.parse(savedProfile) : { email: 'admin@vasavimart.com' };

          if (notificationPrefs.inventory) {
            fetch('/api/admin/notify-inventory', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                productData: product, 
                adminEmail: adminProfile.email 
              })
            }).catch(err => console.error('Inventory alert failed', err));
          }
        }
      }
      
      return updatedProducts;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
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
