import { supabase } from '../server/config/supabase.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./.env') });

async function run() {
  const orderId = 'ORD-557162';
  
  console.log('Querying order_history directly...');
  const { data: history, error: historyErr } = await supabase
    .from('order_history')
    .select('*')
    .eq('order_id', orderId);
    
  console.log('History data:', history);
  console.log('History error:', historyErr);

  console.log('Querying orders with relation join...');
  const { data: joinData, error: joinErr } = await supabase
    .from('orders')
    .select('*, order_history(*)')
    .eq('id', orderId);

  console.log('Join data:', joinData);
  console.log('Join error:', joinErr);
}

run();
