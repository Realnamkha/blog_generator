import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)
async function testConnection() {
  const { data, error } = await supabase.from('blogs').select().limit(1);
  if (error) {
    console.error('Error connecting to Supabase:', error.message);
  } else {
    console.log('Connection successful. Data:', data);
  }
}

testConnection();

export async function getBlogById(id: number) {
  const { data } = await supabase
    .from('blogs')
    .select()
    .eq('id', id)
    .single()

  return data
}

export async function getAllBlogs() {
  const { data} = await supabase
    .from('blogs')
    .select()
    .order('created_at', { ascending: false })

  return data
}
// Delete a blog post by ID
export async function deleteBlogById(id: number) {
  const { data, error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return data;
}

// Update a blog post by ID
export async function updateBlogById(id: number, updatedFields: { title?: string; content?: string }) {
  const { data, error } = await supabase
    .from('blogs')
    .update(updatedFields)
    .eq('id', id);

  if (error) throw new Error(error.message);
  return data;
}
