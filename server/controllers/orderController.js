import { supabase } from '../config/supabase.js';
import mailService from '../services/mailService.js';
import logger from '../utils/logger.js';

export const getOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    let query = supabase.from('orders').select('*, order_items(*), order_history(*), payments(*)');
    if (userRole !== 'admin') {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    logger.error('Failed to get orders', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userRole = req.user?.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // Cascade delete order_items first
    const { error: itemsError } = await supabase.from('order_items').delete().eq('order_id', orderId);
    if (itemsError) throw itemsError;

    const { error: orderError } = await supabase.from('orders').delete().eq('id', orderId);
    if (orderError) throw orderError;

    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    logger.error('Failed to delete order', error);
    res.status(500).json({ error: error.message });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { orderDetails } = req.body;
    const userId = req.user?.id || orderDetails.userId;

    logger.info(`Placing order for user: ${userId || 'guest'}`, { orderDetails });

    let dbUserId = null;
    if (userId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(userId)) {
        dbUserId = userId;
      } else {
        logger.info(`User ID ${userId} is not a valid UUID. Searching for user by email ${orderDetails.customer?.email}`);
        const { data: userByEmail, error: findError } = await supabase
          .from('users')
          .select('id')
          .eq('email', orderDetails.customer?.email)
          .maybeSingle();
        if (userByEmail) {
          dbUserId = userByEmail.id;
          logger.info(`Resolved user ID to database UUID: ${dbUserId}`);
        }
      }
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    logger.info(`Inserting order ${orderId} into database...`);
    const { data: order, error: orderError } = await supabase.from('orders').insert([{
      id: orderId,
      user_id: dbUserId,
      status: 'Pending',
      subtotal: orderDetails.subtotal,
      tax: orderDetails.tax,
      shipping: orderDetails.shipping,
      total: orderDetails.total,
      payment_method: orderDetails.paymentMethod,
      shipping_address: orderDetails.customer
    }]).select().single();

    if (orderError) {
      logger.error(`Database error inserting order ${orderId}:`, orderError);
      throw orderError;
    }
    logger.info(`Successfully inserted order ${orderId} into database`, order);

    if (orderDetails.items && orderDetails.items.length > 0) {
      const items = orderDetails.items.map(item => ({
        order_id: orderId,
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image
      }));
      logger.info(`Inserting ${items.length} items for order ${orderId}...`);
      const { data: insertedItems, error: itemsError } = await supabase.from('order_items').insert(items).select();
      if (itemsError) {
        logger.error(`Database error inserting items for order ${orderId}:`, itemsError);
        throw itemsError;
      }
      logger.info(`Successfully inserted ${insertedItems.length} items`, insertedItems);
    }

    // Insert payment record
    const paymentData = {
      order_id: orderId,
      amount: orderDetails.total,
      status: orderDetails.paymentMethod === 'Razorpay' ? 'Successful' : 'Pending',
      razorpay_order_id: orderDetails.paymentDetails?.razorpay_order_id || null,
      razorpay_payment_id: orderDetails.paymentDetails?.razorpay_payment_id || null,
      razorpay_signature: orderDetails.paymentDetails?.razorpay_signature || null
    };

    logger.info(`Inserting payment for order ${orderId}...`, paymentData);
    const { data: insertedPayment, error: paymentError } = await supabase.from('payments').insert([paymentData]).select().single();
    if (paymentError) {
      logger.error(`Database error inserting payment for order ${orderId}:`, paymentError);
      throw paymentError;
    }
    logger.info(`Successfully inserted payment for order ${orderId}`, insertedPayment);

    // Insert order history tracking
    const historyData = {
      order_id: orderId,
      status: 'Pending',
      message: 'Order placed successfully!'
    };
    logger.info(`Inserting order history for order ${orderId}...`, historyData);
    const { data: insertedHistory, error: historyError } = await supabase.from('order_history').insert([historyData]).select().single();
    if (historyError) {
      logger.error(`Database error inserting order history for order ${orderId}:`, historyError);
    } else {
      logger.info(`Successfully inserted order history for order ${orderId}`, insertedHistory);
    }

    // Save/Insert address to the addresses table if authenticated user
    if (dbUserId && orderDetails.customer) {
      const street = orderDetails.customer.address;
      const city = orderDetails.customer.city;
      const zip_code = orderDetails.customer.zipCode;

      if (street && city && zip_code) {
        logger.info(`Checking if address exists in database for user ${dbUserId}...`);
        const { data: existingAddr } = await supabase
          .from('addresses')
          .select('id')
          .eq('user_id', dbUserId)
          .eq('street', street)
          .eq('city', city)
          .eq('zip_code', zip_code)
          .maybeSingle();

        if (!existingAddr) {
          logger.info(`Inserting new checkout address into addresses table for user ${dbUserId}...`);
          const { data: insertedAddr, error: addrError } = await supabase.from('addresses').insert([{
            user_id: dbUserId,
            type: 'Home',
            street,
            city,
            state: 'Andhra Pradesh',
            zip_code,
            is_default: false
          }]).select().single();
          if (addrError) {
            logger.error(`Database error inserting address for user ${dbUserId}:`, addrError);
          } else {
            logger.info(`Successfully inserted checkout address for user ${dbUserId}`, insertedAddr);
          }
        }
      }
    }

    // Send Confirmations
    if (orderDetails.customer && orderDetails.customer.email) {
      mailService.sendOrderConfirmation(orderDetails.customer.email, { ...orderDetails, id: orderId }).catch(e => logger.error(e));
      mailService.sendAdminNewOrderAlert({ ...orderDetails, id: orderId }).catch(e => logger.error(e));
    }

    res.status(201).json({ success: true, orderId });
  } catch (error) {
    logger.error('Failed to place order', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, email, customerName } = req.body;

    const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId).select().single();
    if (error) throw error;

    // Log status update in order history
    const historyUpdateData = {
      order_id: orderId,
      status,
      message: `Order status updated to ${status}`
    };
    logger.info(`Inserting order status history update for order ${orderId}...`, historyUpdateData);
    const { error: historyError } = await supabase.from('order_history').insert([historyUpdateData]);
    if (historyError) {
      logger.error(`Database error updating status history for order ${orderId}:`, historyError);
    }

    if (email && status) {
      mailService.sendStatusUpdate(email, orderId, customerName, status).catch(e => logger.error(e));
    }

    res.status(200).json({ success: true, order: data });
  } catch (error) {
    logger.error('Failed to update order status', error);
    res.status(500).json({ error: error.message });
  }
};

// Legacy alias for compatibility
export const orderNotification = placeOrder;
export const updateStatusNotification = updateOrderStatus;
