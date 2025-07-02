import { createClient } from '@supabase/supabase-js';

// PUBLIC_INTERFACE
/** 
 * Initializes and exports the Supabase client using environment variables.
 * Do not hardcode the keys – always use the REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY env vars.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
