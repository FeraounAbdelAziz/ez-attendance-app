import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qvvqjzsgkfqfglzednuf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dnFqenNna2ZxZmdsemVkbnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4OTg5NTIsImV4cCI6MjAxNzQ3NDk1Mn0.-QDswiEW5AsHj_lYhDK4LV3K7CmrwB8E2TK0UqhcvAg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)