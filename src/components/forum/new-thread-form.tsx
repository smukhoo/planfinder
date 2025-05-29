// src/components/forum/new-thread-form.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const newThreadSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100, { message: "Title cannot exceed 100 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }).max(5000, { message: "Content cannot exceed 5000 characters." }),
});

type NewThreadFormValues = z.infer<typeof newThreadSchema>;

interface NewThreadFormProps {
  onSubmit: (data: NewThreadFormValues) => void;
  onCancel: () => void;
}

export function NewThreadForm({ onSubmit, onCancel }: NewThreadFormProps) {
  const form = useForm<NewThreadFormValues>({
    resolver: zodResolver(newThreadSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const handleSubmit = (values: NewThreadFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-cyan-400">Transmission Subject (Title)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter a clear subject for your transmission..." 
                  {...field} 
                  className="bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-slate-500"
                />
              </FormControl>
              <FormMessage className="text-magenta-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-cyan-400">Your Message Matrix</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Compose your detailed message or query..."
                  className="min-h-[150px] resize-y bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-slate-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-magenta-400" />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-cyan-300">
            Abort Transmission
          </Button>
          <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 shadow-md shadow-cyan-500/30">
            Broadcast Thread
          </Button>
        </div>
      </form>
    </Form>
  );
}
