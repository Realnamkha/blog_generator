"use client";
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import React from 'react'
import { toast } from 'sonner'
import { createCompletion } from '@/app/action'
import { cn } from '@/lib/utils';

export default function Form(){

    async function action (formData: FormData){
        const prompt = formData.get('prompt')
        const result = await createCompletion(prompt as string);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Blog post generated successfully!");
          console.log(result);
        }
    }

    return (
    <section className='mx-auto max-w-lg py-8'>
      <Card className='border border-gray-200 shadow-lg rounded-xl'>
        <CardHeader className='text-center pb-0'>
          <CardTitle className='text-2xl font-semibold text-gray-800'>Acero AI Blogger</CardTitle>
          <CardDescription className='text-gray-500 mt-2'>Generate a blog post about anything</CardDescription>
        </CardHeader>
        <CardContent className='px-6 py-4'>
        <form action={action} className='mt-3'>
            <Input
              name='prompt'
              placeholder='What should I write about?'
              className='rounded-lg border-2 border-gray-300 focus:ring focus:ring-indigo-400 focus:border-indigo-400'
            />
            <SubmitButton/>
          </form>
        </CardContent>
      </Card>
    </section>
    )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
    size='lg'
    type='submit'
    className={cn(
        'mt-6 w-full rounded-lg py-3 text-white font-medium',
        'bg-[rgb(2,3,129)] transition-all duration-300 ease-in-out transform hover:scale-105',
        pending ? 'animate-pulse' : 'hover:shadow-[0_0_10px_rgb(2,3,129),0_0_40px_rgb(2,3,129)]'
    )}
>
    {pending ? 'Working on it...' : 'Generate Blog Post'}
</Button>
  )
}
