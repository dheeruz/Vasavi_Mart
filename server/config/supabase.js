import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

let supabaseUrl = process.env.SUPABASE_URL || '';
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = `https://${supabaseUrl.trim()}.supabase.co`;
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  logger.warn('Supabase URL or Key is missing. Database features will not work.');
}

logger.info(`Initializing Supabase with URL: ${supabaseUrl}`);

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);
