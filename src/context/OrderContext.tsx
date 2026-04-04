import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from './CartContext';

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
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'status' | 'history'>) => string;
  updateOrderStatus: (id: string, status: Order['status'], message?: string) => void;
  deleteOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('vasavi_orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse orders', e);
      }
    }
    
    // Initial Dummy Data if empty
    return [
      {
        id: 'ORD-772910',
        date: new Date(Date.now() - 86400000).toISOString(),
        customer: { firstName: 'Dheeraj', lastName: 'Kumar', email: 'dheeraj@example.com', address: '123 Nellore St', city: 'Nellore', zipCode: '524001' },
        items: [{ id: 'p1', name: 'Fresh Organic Apples', price: 180, quantity: 2, image: '/organic_apples.png', category: 'Fruits & Veggies', unit: '1 kg', inStock: true }],
        subtotal: 360.00,
        tax: 28.80,
        shipping: 0,
        total: 388.80,
        paymentMethod: 'UPI',
        status: 'Delivered',
        history: [{ status: 'Pending', date: new Date(Date.now() - 172800000).toISOString(), message: 'Order Placed' }, { status: 'Delivered', date: new Date(Date.now() - 86400000).toISOString(), message: 'Delivered' }]
      },
      {
        id: 'ORD-881234',
        date: new Date().toISOString(),
        customer: { firstName: 'Anita', lastName: 'Sharma', email: 'anita@example.com', address: '456 Jubilee Hills', city: 'Hyderabad', zipCode: '500033' },
        items: [{ id: 'p2', name: 'Alphonso Mangoes', price: 450, quantity: 1, image: '/mango_pickle_jar_400g.png', category: 'Fruits & Veggies', unit: '1 kg', inStock: true }],
        subtotal: 450.00,
        tax: 36.00,
        shipping: 50,
        total: 536.00,
        paymentMethod: 'Card',
        status: 'Pending',
        history: [{ status: 'Pending', date: new Date().toISOString(), message: 'Order Placed' }]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('vasavi_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (orderData: Omit<Order, 'id' | 'date' | 'status' | 'history'>) => {
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: now,
      status: 'Pending',
      history: [
        { 
          status: 'Pending', 
          date: now, 
          message: 'Order placed successfully! We are preparing your items.' 
        }
      ]
    };
    
    setOrders(prev => [newOrder, ...prev]);

    // Trigger Notification
    const savedProfile = localStorage.getItem('admin_profile');
    const adminProfile = savedProfile ? JSON.parse(savedProfile) : { email: 'admin@vasavimart.com' };

    fetch('/api/order/place-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        orderDetails: newOrder, 
        adminEmail: adminProfile.email 
      })
    }).catch(err => console.error('Order notification failed', err));

    return newOrder.id;
  };

  const updateOrderStatus = (id: string, status: Order['status'], customMessage?: string) => {
    const now = new Date().toISOString();
    
    // Default messages if none provided
    const defaultMessages: Record<Order['status'], string> = {
      'Pending': 'Order is currently being processed.',
      'Shipped': 'Your order has been shipped and is on its way!',
      'Delivered': 'Order was successfully delivered at your door.',
      'Cancelled': 'Order has been cancelled.'
    };

    setOrders(prev => 
      prev.map(order => 
        order.id === id 
          ? { 
              ...order, 
              status, 
              // Lazy migration for old orders that might not have history
              history: [
                ...(order.history || [{ status: 'Pending', date: order.date, message: 'Order Placed' }]),
                { status, date: now, message: customMessage || defaultMessages[status] }
              ]
            } 
          : order
      )
    );
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
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
