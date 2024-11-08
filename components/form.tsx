"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from 'react';
import { toast } from 'sonner';
import { createCompletion } from '@/app/action';
import { cn } from '@/lib/utils';
import { useFormStatus } from 'react-dom'

export default function Form() {
  const [titles, setTitles] = useState<string[]>(['']);
  // const [progress, setProgress] = useState(0); 

  // Function to handle adding a new title input field
  const addTitleField = () => {
    setTitles([...titles, '']);
  };

  // Function to handle removing a title input field
  const removeTitleField = (index: number) => {
    setTitles(titles.filter((_, i) => i !== index));
  };

  // Function to handle updating the title input value
  const handleTitleChange = (index: number, value: string) => {
    const updatedTitles = [...titles];
    updatedTitles[index] = value;
    setTitles(updatedTitles);
  };

  async function action() {
    const totalTitles = titles.length; // Total number of titles
    let completed = 0; // Track the number of completed titles
    for (const title of titles) {
      if (title.trim()) {
        const result = await createCompletion(title);
        completed++;

        // setProgress(Math.round((completed / totalTitles) * 100));
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success(`Blog post for "${title}" generated successfully!`);
          console.log(result);
        }
      }
    }
  }

  return (
    <section className="mx-auto max-w-lg py-8">
      <Card className="border border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="text-center pb-0">
          <CardTitle className="text-2xl font-semibold text-gray-800">Acero AI Blogger</CardTitle>
          <CardDescription className="text-gray-500 mt-2">Generate blog posts for multiple titles</CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <form action={action} className="mt-3">
            {titles.map((title, index) => (
              <div key={index} className="flex space-x-2 mb-3">
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  placeholder={`Blog title ${index + 1}`}
                  className="rounded-lg border-2 border-gray-300 flex-1"
                />
                {titles.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeTitleField(index)}
                    className="bg-red-500 text-white"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={addTitleField} className="mb-4">
              Add Another Title
            </Button>
            <SubmitButton/>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
    size='sm'
    type='submit'
    className={cn('mt-3 w-full rounded-lg', pending && 'animate-pulse')}
  >
    {pending ? 'Working on it...' : 'Submit'}
  </Button>
  );
}
