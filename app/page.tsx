import Form from "@/components/form";
import Image from "next/image";
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { getAllBlogs } from "@/lib/supabase";
import { formatDate } from '@/lib/utils';

export const maxDuration = 60;

export default async function Home() {
  const blogs = await getAllBlogs();

  return (
    <section className='py-28 flex justify-center bg-gray-50'>
      <div className='container max-w-5xl'>
        <Form />

        <div className='mt-32'>
          <h2 className='text-3xl font-bold leading-none tracking-tight text-center text-gray-800'>
            Recent Blogs
          </h2>

          <div className='mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3'>
            {blogs?.map(blog => (
              <Card key={blog.id} className='overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                <CardContent className='p-0'>
                  <Link href={`/blog/${blog.id}`} key={blog.id}>
                    <Image
                      alt={blog.title}
                      src={blog.imageUrl}
                      width={400}
                      height={300}
                      className='w-full h-48 object-cover transition-transform duration-300 hover:scale-105'
                    />

                    <div className='px-4 pb-3 pt-2'>
                      <h3 className='font-medium text-lg text-gray-800 hover:text-blue-600 transition-colors duration-200'>{blog.title}</h3>
                      <p className='text-xs text-gray-500'>{formatDate(blog.created_at)}</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
