import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.');
}

if (supabaseKey.startsWith('sb_publishable_')) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY esta usando uma chave publishable. Use a chave service_role/secret do Supabase no backend.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
