
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
              <FormLabel className="text-primary">Thread Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter a clear subject for your discussion..." 
                  {...field} 
                  className="bg-input border-input text-foreground focus-visible:ring-ring focus-visible:border-primary placeholder:text-muted-foreground"
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Your Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Compose your detailed message or query..."
                  className="min-h-[150px] resize-y bg-input border-input text-foreground focus-visible:ring-ring focus-visible:border-primary placeholder:text-muted-foreground"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/30">
            Create Thread
          </Button>
        </div>
      </form>
    </Form>
  );
}
