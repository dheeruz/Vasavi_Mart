import { supabase } from '../config/supabase.js';
import logger from '../utils/logger.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('cart')
      .select('*, products(*)')
      .eq('user_id', userId);

    if (error) throw error;
    
    // Map items to CartItem format expected by frontend
    const cartItems = data.map(item => ({
      id: item.product_id,
      name: item.products.name,
      price: item.products.price,
      quantity: item.quantity,
      image: item.products.image_url,
      category: item.products.category,
      unit: item.products.unit,
      inStock: item.products.in_stock
    }));

    res.status(200).json(cartItems);
  } catch (error) {
    logger.error('Failed to get cart', error);
    res.status(500).json({ error: error.message });
  }
};

export const syncCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItems } = req.body; // Array of frontend CartItem: { id, quantity }

    logger.info(`Syncing cart for user ${userId} with ${cartItems?.length || 0} items...`);
    // Clear old cart and insert updated cart
    const { error: deleteError } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      logger.error(`Database error deleting cart for user ${userId}:`, deleteError);
      throw deleteError;
    }

    if (cartItems && cartItems.length > 0) {
      const inserts = cartItems.map(item => ({
        user_id: userId,
        product_id: item.id,
        quantity: item.quantity
      }));

      const { error: insertError } = await supabase
        .from('cart')
        .insert(inserts);

      if (insertError) {
        logger.error(`Database error inserting cart for user ${userId}:`, insertError);
        throw insertError;
      }
    }

    logger.info(`Successfully synced cart for user ${userId}`);
    res.status(200).json({ success: true, message: 'Cart synced' });
  } catch (error) {
    logger.error('Failed to sync cart', error);
    res.status(500).json({ error: error.message });
  }
};
