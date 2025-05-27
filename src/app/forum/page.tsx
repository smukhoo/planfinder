
// src/app/forum/page.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { NewThreadForm } from '@/components/forum/new-thread-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Mock data for forum threads
const mockThreadsData = [
  { id: '1', title: 'Best plan for unlimited data?', author: 'DataSeeker23', replies: 15, lastActivity: '2 hours ago', category: 'General Discussion', avatarSrc: '/avatars/data-seeker.png', avatarFallback: 'DS', avatarHint: 'user avatar seeker' },
  { id: '2', title: 'Jio vs Airtel - Which has better network coverage in rural areas?', author: 'ConnectivityGuru', replies: 8, lastActivity: '5 hours ago', category: 'Operator Comparison', avatarSrc: '/avatars/connectivity-guru.png', avatarFallback: 'CG', avatarHint: 'man smiling beard' },
  { id: '3', title: 'How to activate international roaming on Vi?', author: 'TravelerTom', replies: 3, lastActivity: '1 day ago', category: 'Support Questions', avatarSrc: '/avatars/traveler-tom.png', avatarFallback: 'TT', avatarHint: 'user avatar traveler' },
  { id: '4', title: 'New yearly plan announced by Airtel - thoughts?', author: 'PlanWatcher', replies: 22, lastActivity: '30 minutes ago', category: 'News & Announcements', avatarSrc: '/avatars/plan-watcher.png', avatarFallback: 'PW', avatarHint: 'user avatar watcher' },
];

export type ForumThread = typeof mockThreadsData[0];

// Component for displaying a single thread item in the list
function ThreadListItem({ thread }: { thread: ForumThread }) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 ease-in-out">
      <CardHeader>
        {/* In a real app, this link would go to a dynamic route like /forum/thread/[id] */}
        <Link href={`#`} className="hover:underline" onClick={(e) => {e.preventDefault(); alert(`Navigating to thread: ${thread.title} (not implemented yet)`)}}>
          <CardTitle className="text-lg text-primary">{thread.title}</CardTitle>
        </Link>
        <CardDescription className="text-xs text-muted-foreground pt-1">
          Category: {thread.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {/* Placeholder for thread content preview if needed, e.g., first few lines */}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between items-center text-xs text-muted-foreground pt-4 gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={thread.avatarSrc} alt={thread.author} data-ai-hint={thread.avatarHint} />
            <AvatarFallback>{thread.avatarFallback}</AvatarFallback>
          </Avatar>
          <User className="h-3 w-3" />
          <span>{thread.author}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          <span>{thread.replies} replies</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{thread.lastActivity}</span>
        </div>
      </CardFooter>
    </Card>
  );
}


export default function ForumPage() {
  const [isNewThreadModalOpen, setIsNewThreadModalOpen] = useState(false);
  const [threads, setThreads] = useState<ForumThread[]>(mockThreadsData);

  const handleCreateThread = (data: { title: string; content: string }) => {
    console.log("New thread data:", data);
    // In a real app, you would send this to a backend
    const newThread: ForumThread = {
        id: String(threads.length + 1 + Date.now()), // More unique ID
        title: data.title,
        author: 'CurrentUser', // Replace with actual user in a real app
        replies: 0,
        lastActivity: 'Just now',
        category: 'General Discussion', // Default or from form
        avatarSrc: '/avatars/default-user.png', // Placeholder for new user
        avatarFallback: 'CU',
        avatarHint: 'user avatar default'
    };
    setThreads(prevThreads => [newThread, ...prevThreads]);
    setIsNewThreadModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Community Forum
        </h1>
        <Dialog open={isNewThreadModalOpen} onOpenChange={setIsNewThreadModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" />
              Start New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Create New Discussion Thread</DialogTitle>
            </DialogHeader>
            <NewThreadForm onSubmit={handleCreateThread} onCancel={() => setIsNewThreadModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {threads.map((thread) => (
          <ThreadListItem key={thread.id} thread={thread} />
        ))}
      </div>

      {threads.length === 0 && (
         <div className="text-center py-16">
            <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-xl font-semibold text-foreground">No discussions yet</h3>
            <p className="mt-2 text-md text-muted-foreground">
              Why not be the first to start a conversation?
            </p>
          </div>
      )}
    </div>
  );
}
