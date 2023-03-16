// supabase.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({
   path: "./auth/.env.local",
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// console.log(supabaseUrl);
// console.log(supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);
