import { supabase } from '../config/supabase.js';
import logger from '../utils/logger.js';

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('wishlist')
      .select('*, products(*)')
      .eq('user_id', userId);

    if (error) throw error;

    const wishlistItems = data.map(item => ({
      id: item.product_id,
      name: item.products.name,
      price: item.products.price,
      image: item.products.image_url,
      category: item.products.category,
      unit: item.products.unit,
      inStock: item.products.in_stock
    }));

    res.status(200).json(wishlistItems);
  } catch (error) {
    logger.error('Failed to get wishlist', error);
    res.status(500).json({ error: error.message });
  }
};

export const syncWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productIds } = req.body; // Array of product ids

    logger.info(`Syncing wishlist for user ${userId} with ${productIds?.length || 0} products...`);
    const { error: deleteError } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      logger.error(`Database error deleting wishlist for user ${userId}:`, deleteError);
      throw deleteError;
    }

    if (productIds && productIds.length > 0) {
      const inserts = productIds.map(productId => ({
        user_id: userId,
        product_id: productId
      }));

      const { error: insertError } = await supabase
        .from('wishlist')
        .insert(inserts);

      if (insertError) {
        logger.error(`Database error inserting wishlist for user ${userId}:`, insertError);
        throw insertError;
      }
    }

    logger.info(`Successfully synced wishlist for user ${userId}`);
    res.status(200).json({ success: true, message: 'Wishlist synced' });
  } catch (error) {
    logger.error('Failed to sync wishlist', error);
    res.status(500).json({ error: error.message });
  }
};
