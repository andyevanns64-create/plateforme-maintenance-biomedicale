import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rywwoisbvulgypfhwpzb.supabase.co'
const supabaseKey = 'sb_publishable_TF_8jF3SFJHP5u5525tNOw_5iGAvIQE'

export const supabase = createClient(supabaseUrl, supabaseKey)
