import { supabase } from '../server/config/supabase.js';

async function checkProducts() {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    console.log(`Total products in database: ${data.length}`);
    if (data.length > 0) {
      console.log('Sample products:');
      console.log(data.slice(0, 5));
    }
  } catch (err) {
    console.error('Error fetching products:', err);
  }
}

checkProducts();
