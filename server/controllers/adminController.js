import { supabase } from '../config/supabase.js';
import logger from '../utils/logger.js';

export const getAdminStats = async (req, res) => {
  try {
    // 1. Fetch all orders with items
    const { data: orders, error: ordersError } = await supabase.from('orders').select('*, order_items(*)');
    if (ordersError) throw ordersError;

    // 2. Fetch all users
    const { data: users, error: usersError } = await supabase.from('users').select('*');
    if (usersError) throw usersError;

    // 3. Prepare summary stats
    const totalRevenue = orders.reduce((acc, order) => acc + parseFloat(order.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

    // 4. Combine users and orders to get customer data
    const customersMap = {};
    users.forEach(u => {
      customersMap[u.id] = { ...u, orders: [], totalSpent: 0 };
    });

    orders.forEach(o => {
      if (o.user_id && customersMap[o.user_id]) {
        customersMap[o.user_id].orders.push(o);
        customersMap[o.user_id].totalSpent += parseFloat(o.total || 0);
      }
    });

    const customers = Object.values(customersMap);

    res.status(200).json({
      orders,
      customers,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders,
        deliveredOrders,
      }
    });
  } catch (error) {
    logger.error('Failed to get admin stats', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, location, isBlocked } = req.body;

    const nameParts = (name || '').split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ');

    const updateData = {};
    if (name) {
      updateData.first_name = first_name;
      updateData.last_name = last_name;
    }
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.address = location;
    if (isBlocked !== undefined) updateData.role = isBlocked ? 'blocked' : 'user'; // simple block mapping using role or custom field

    logger.info(`Updating user ${userId} with updates:`, updateData);
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
 
    if (error) {
      logger.error(`Database error updating user ${userId}:`, error);
      throw error;
    }
    logger.info(`Successfully updated user ${userId}`, data);
    res.status(200).json({ success: true, user: data });
  } catch (error) {
    logger.error('Failed to update user', error);
    res.status(500).json({ error: error.message });
  }
};
 
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    logger.info(`Deleting user ${userId}...`);
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (error) {
      logger.error(`Database error deleting user ${userId}:`, error);
      throw error;
    }
    logger.info(`Successfully deleted user ${userId}`);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    logger.error('Failed to delete user', error);
    res.status(500).json({ error: error.message });
  }
};
 
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, location } = req.body;
    const nameParts = (name || '').split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ');
 
    logger.info(`Admin creating user with email ${email}...`);
    const { data, error } = await supabase.from('users').insert([{
      first_name,
      last_name,
      email,
      phone,
      address: location,
      password_hash: 'placeholder_hash', // custom admin-created user
      role: 'user'
    }]).select().single();
 
    if (error) {
      logger.error(`Database error admin-creating user ${email}:`, error);
      throw error;
    }
    logger.info(`Successfully admin-created user ${email}`, data);
    res.status(201).json({ success: true, user: data });
  } catch (error) {
    logger.error('Failed to create user', error);
    res.status(500).json({ error: error.message });
  }
};
