// In `app/actions.ts` or a dedicated actions file
"use server";
import OpenAI from 'openai'
import { decode } from 'base64-arraybuffer'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function createCompletion(prompt: string) {
  if (!prompt) {
    return { error: "Prompt is required" };
  }
  
  interface Message {
    role: 'user' | 'assistant';
    content: string;
  }
  
  const messages: Message[] = [
    {
      role: 'user',
      content: `Write a detailed SEO-optimized blog post on {prompt}. The post should include:
  
        A keyword-rich title (50-60 characters).
        A summary up to 160 characters highlighting the main points.
        Organize content into clear sections with keywords naturally integrated.
        Provide deep, practical insights with examples and case studies.
        Include bullet points or lists for easy readability.
        Use credible sources for data, stats, and quotes.
        Focus on primary and related keywords to improve search ranking.
        End with a clear call to action summarizing the key points.
        Add supporting elements like alt text for images, internal links, and external links to authoritative sources.
      `
    }
  ];
  
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages
    })
  
    const content = completion?.choices?.[0]?.message?.content
    if (!content) {
      return { error: 'Unable to generate the blog content.' }
    }

  // const generatedContent = `Generated content for: ${prompt}`;
  // console.log(content)
  // return { success: true, content: generatedContent };

  const image = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `Generate an image for a blog post about "${prompt}"`,
    n: 1,
    size: '1792x1024',
    response_format: 'b64_json'
  })

  const imageName = `blog-${Date.now()}`
  const imageData = image?.data?.[0]?.b64_json as string
  if (!imageData) {
    return { error: 'Unable to generate the blog image.' }
  }

  const { data, error } = await supabase.storage
  .from('blogs')
  .upload(imageName, decode(imageData), {
    contentType: 'image/png'
  })
  if (error) {
    return { error: 'Unable to upload the blog image to Storage.' }
  }
  const path = data?.path
  const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/blogs/${path}`

  const { data: blog, error: blogError } = await supabase
  .from('blogs')
  .insert([{ title: prompt, content, imageUrl, userId:'123' }])
  .select()

  if (blogError) {
    return { error: 'Unable to insert the blog into the database.' }
  }
  console.log(blog)

  const blogId = blog?.[0]?.id

  revalidatePath('/')
  redirect(`/blog/${blogId}`)
}