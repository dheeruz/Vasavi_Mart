import { supabase } from '../server/config/supabase.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./.env') });

async function run() {
  const email = 'admin@vasavimart.com';
  
  console.log(`Checking if user ${email} exists in database...`);
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();
    
  console.log('User data:', user);
  console.log('User error:', userErr);
}

run();
