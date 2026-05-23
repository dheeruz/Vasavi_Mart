import { supabase } from '../config/supabase.js';
import logger from '../utils/logger.js';

const mapToClient = (product) => {
  if (!product) return null;
  // Generate deterministic properties based on character codes of the product ID
  const idNum = product.id ? product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  
  const rating = 4.0 + (idNum % 11) / 10; // between 4.0 and 5.0
  const reviews = 15 + (idNum % 285);
  // generate discounts like 10%, 15%, 20% or 0%
  const discount = idNum % 3 === 0 ? 10 + (idNum % 4) * 5 : 0; 
  const isOrganic = product.category.toLowerCase().includes('organic') || product.name.toLowerCase().includes('organic');
  const isBestseller = idNum % 4 === 0;
  const isNewArrival = idNum % 5 === 0;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    category: product.category,
    unit: product.unit,
    stock: product.stock,
    image: product.image_url,
    inStock: product.in_stock,
    rating: parseFloat(rating.toFixed(1)),
    reviews,
    discount,
    isOrganic,
    isBestseller,
    isNewArrival,
    created_at: product.created_at
  };
};

const mapToDb = (product) => {
  if (!product) return null;
  const dbObj = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    unit: product.unit,
    stock: product.stock,
    image_url: product.image !== undefined ? product.image : product.image_url,
    in_stock: product.inStock !== undefined ? product.inStock : product.in_stock
  };
  if (product.id) {
    dbObj.id = product.id;
  }
  return dbObj;
};

export const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    const clientProducts = data.map(mapToClient);
    res.status(200).json(clientProducts);
  } catch (error) {
    logger.error('Failed to get products', error);
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const productId = id || `p${Date.now()}`;
    logger.info(`Creating product: ${productId} (${req.body.name})...`);
    
    const dbProduct = mapToDb({ ...req.body, id: productId });
    
    const { data, error } = await supabase.from('products').insert([dbProduct]).select().single();
    
    if (error) {
      logger.error(`Database error creating product ${productId}:`, error);
      throw error;
    }
    logger.info(`Successfully created product ${productId}`);
    res.status(201).json(mapToClient(data));
  } catch (error) {
    logger.error('Failed to create product', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Updating product ${id}...`);
    
    const dbUpdates = mapToDb(req.body);
    // Remove id from updates to avoid primary key update errors
    delete dbUpdates.id;
    
    const { data, error } = await supabase.from('products').update(dbUpdates).eq('id', id).select().single();
    if (error) {
      logger.error(`Database error updating product ${id}:`, error);
      throw error;
    }
    logger.info(`Successfully updated product ${id}`);
    res.status(200).json(mapToClient(data));
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
