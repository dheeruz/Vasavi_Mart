import { supabase } from '../config/supabase.js';
import logger from '../utils/logger.js';

export const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    logger.error('Failed to get products', error);
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { id, name, description, price, category, unit, stock, image_url, in_stock } = req.body;
    const productId = id || `p${Date.now()}`;
    logger.info(`Creating product: ${productId} (${name})...`);
    
    const { data, error } = await supabase.from('products').insert([{
      id: productId,
      name, description, price, category, unit, stock, image_url, in_stock
    }]).select().single();
    
    if (error) {
      logger.error(`Database error creating product ${productId}:`, error);
      throw error;
    }
    logger.info(`Successfully created product ${productId}`, data);
    res.status(201).json(data);
  } catch (error) {
    logger.error('Failed to create product', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    logger.info(`Updating product ${id}...`, updates);
    
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) {
      logger.error(`Database error updating product ${id}:`, error);
      throw error;
    }
    logger.info(`Successfully updated product ${id}`, data);
    res.status(200).json(data);
  } catch (error) {
    logger.error('Failed to update product', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    logger.error('Failed to delete product', error);
    res.status(500).json({ error: error.message });
  }
};
