import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from './CartContext';
import { useAuth } from './AuthContext';
import { API_ENDPOINTS } from '../config/api';

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface OrderUpdate {
  status: Order['status'];
  date: string;
  message: string;
}

export interface Order {
  id: string;
  date: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  history: OrderUpdate[];
  paymentDetails?: any;
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'status' | 'history'>) => Promise<string>;
  updateOrderStatus: (id: string, status: Order['status'], message?: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setOrders([]);
        return;
      }
      try {
        const token = localStorage.getItem('vasavi_token');
        const res = await fetch(API_ENDPOINTS.ORDER, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Map backend orders back to frontend interface
          const mappedOrders = data.map((o: any) => ({
             id: o.id,
             date: o.created_at,
             customer: o.shipping_address,
             items: (o.order_items || []).map((item: any) => ({
                id: item.product_id,
                name: item.name,
                price: Number(item.price),
                quantity: item.quantity,
                image: item.image_url
             })),
             subtotal: Number(o.subtotal),
             tax: Number(o.tax),
             shipping: Number(o.shipping),
             total: Number(o.total),
             paymentMethod: o.payment_method,
             status: o.status,
             history: (o.order_history || []).map((h: any) => ({
                status: h.status,
                date: h.created_at,
                message: h.message
             }))
          }));
          setOrders(mappedOrders);
        }
      } catch (e) {
        console.error('Failed to fetch orders', e);
      }
    };
    fetchOrders();
  }, [user]);

  const placeOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status' | 'history'>) => {
    try {
      const token = localStorage.getItem('vasavi_token');
      const res = await fetch(API_ENDPOINTS.ORDER, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderDetails: orderData })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Optimistic add (in real app, we might re-fetch from server)
        const now = new Date().toISOString();
        const newOrder: Order = {
          ...orderData,
          id: data.orderId,
          date: now,
          status: 'Pending',
          history: [{ status: 'Pending', date: now, message: 'Order placed successfully!' }]
        };
        setOrders(prev => [newOrder, ...prev]);
        return data.orderId;
      }
    } catch (e) {
      console.error('Failed to place order', e);
    }
    return '';
  };

  const updateOrderStatus = async (id: string, status: Order['status'], customMessage?: string) => {
    try {
      const token = localStorage.getItem('vasavi_token');
      await fetch(`${API_ENDPOINTS.ORDER}/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      const now = new Date().toISOString();
      setOrders(prev => 
        prev.map(order => 
          order.id === id 
            ? { 
                ...order, 
                status, 
                history: [
                  ...(order.history || []),
                  { status, date: now, message: customMessage || `Order status updated to ${status}` }
                ]
              } 
            : order
        )
      );
    } catch (e) {
      console.error('Failed to update order status', e);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const token = localStorage.getItem('vasavi_token');
      const res = await fetch(`${API_ENDPOINTS.ORDER}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(prev => prev.filter(order => order.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete order', e);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
