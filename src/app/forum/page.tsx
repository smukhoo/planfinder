
// src/app/forum/page.tsx
"use client";

import { useState, type ElementType } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, User, Clock, Brain, ShieldCheck, Sparkles, Smile, Frown, Meh } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { NewThreadForm } from '@/components/forum/new-thread-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { LucideIcon } from 'lucide-react';

interface AISentiment {
  icon: LucideIcon;
  text: string;
  colorClass: string;
}

const mockThreadsData = [
  { id: '1', title: 'Best plan for unlimited data?', author: 'DataSeeker23', replies: 15, lastActivity: '2 hours ago', category: 'General Discussion', avatarSrc: '/avatars/data-seeker.png', avatarFallback: 'DS', avatarHint: 'user avatar seeker', reputation: 123, badges: ['ShieldCheck', 'Sparkles'], aiSentiment: { icon: Smile, text: 'Positive Tone', colorClass: 'text-green-600'} },
  { id: '2', title: 'Jio vs Airtel - Which has better network coverage in rural areas?', author: 'ConnectivityGuru', replies: 8, lastActivity: '5 hours ago', category: 'Operator Comparison', avatarSrc: '/avatars/connectivity-guru.png', avatarFallback: 'CG', avatarHint: 'man smiling beard', reputation: 450, badges: ['ShieldCheck'], aiSentiment: { icon: Meh, text: 'Neutral Tone', colorClass: 'text-yellow-600'} },
  { id: '3', title: 'How to activate international roaming on Vi?', author: 'TravelerTom', replies: 3, lastActivity: '1 day ago', category: 'Support Questions', avatarSrc: '/avatars/traveler-tom.png', avatarFallback: 'TT', avatarHint: 'user avatar traveler', reputation: 75, badges: [], aiSentiment: { icon: Frown, text: 'Slightly Negative', colorClass: 'text-red-600'} },
  { id: '4', title: 'New yearly plan announced by Airtel - thoughts?', author: 'PlanWatcher', replies: 22, lastActivity: '30 minutes ago', category: 'News & Announcements', avatarSrc: '/avatars/plan-watcher.png', avatarFallback: 'PW', avatarHint: 'user avatar watcher', reputation: 210, badges: ['Sparkles'], aiSentiment: { icon: Smile, text: 'Mostly Positive', colorClass: 'text-green-600'} },
];

export type ForumThread = typeof mockThreadsData[0];

const badgeIconMap: { [key: string]: LucideIcon } = {
  ShieldCheck,
  Sparkles,
};

// Component for displaying a single thread item in the list
function ThreadListItem({ thread }: { thread: ForumThread }) {
  const SentimentIcon = thread.aiSentiment.icon;
  return (
    <Card className="bg-card/90 backdrop-blur-sm border border-border hover:border-primary/50 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group">
      <CardHeader className="pb-3 pt-4 px-4">
        <Link href={`#`} className="hover:underline" onClick={(e) => {e.preventDefault(); alert(`Navigating to thread: ${thread.title} (not implemented yet)`)}}>
          <CardTitle className="text-lg text-primary group-hover:text-primary/90 transition-colors">{thread.title}</CardTitle>
        </Link>
        <div className="flex justify-between items-center mt-1">
          <CardDescription className="text-xs text-muted-foreground pt-1">
            Category: {thread.category}
          </CardDescription>
          {thread.aiSentiment && (
            <div className={`flex items-center text-xs ${thread.aiSentiment.colorClass}`}>
              <SentimentIcon className="h-3.5 w-3.5 mr-1" />
              {thread.aiSentiment.text}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-sm text-foreground px-4 pb-3">
        {/* Placeholder for thread content preview if needed */}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between items-center text-xs text-muted-foreground pt-3 pb-4 px-4 border-t border-border/50 gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border-2 border-primary/40">
            <AvatarImage src={thread.avatarSrc} alt={thread.author} data-ai-hint={thread.avatarHint} />
            <AvatarFallback className="bg-muted text-muted-foreground">{thread.avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-foreground">{thread.author}</span>
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-xs">[+{thread.reputation}]</span>
              {thread.badges.map(badgeName => {
                const BadgeIcon = badgeIconMap[badgeName];
                return BadgeIcon ? <BadgeIcon key={badgeName} className="h-3.5 w-3.5 text-yellow-500" /> : null;
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-primary">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{thread.replies} replies</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
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
    const newThread: ForumThread = {
        id: String(threads.length + 1 + Date.now()),
        title: data.title,
        author: 'DigitalNomad2026', 
        replies: 0,
        lastActivity: 'Just now',
        category: 'General Discussion', 
        avatarSrc: '/avatars/default-user.png', 
        avatarFallback: 'DN',
        avatarHint: 'user avatar default',
        reputation: 0,
        badges: [],
        aiSentiment: { icon: Meh, text: 'Neutral Tone', colorClass: 'text-yellow-600'}
    };
    setThreads(prevThreads => [newThread, ...prevThreads]);
    setIsNewThreadModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 text-foreground">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Community Forum
        </h1>
        <Dialog open={isNewThreadModalOpen} onOpenChange={setIsNewThreadModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/30 w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" />
              Start New Thread
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-popover/95 backdrop-blur-sm border-border text-foreground">
            <DialogHeader>
              <DialogTitle className="text-xl text-primary">Create New Discussion</DialogTitle>
            </DialogHeader>
            <NewThreadForm
              key={isNewThreadModalOpen ? 'form-is-open' : 'form-is-closed'}
              onSubmit={handleCreateThread}
              onCancel={() => setIsNewThreadModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-10 bg-card/80 backdrop-blur-sm border-border shadow-lg rounded-xl p-6">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-xl text-primary flex items-center">
            <Brain className="mr-2 h-6 w-6" /> AI Insights &amp; Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 text-sm text-muted-foreground space-y-2">
          <p><strong className="text-accent">Trending Topic:</strong> "Best value 5G plans for heavy streaming."</p>
          <p><strong className="text-accent">Sentiment Overview:</strong> Generally positive discussions around new data pack benefits.</p>
          <p><strong className="text-accent">Hot Tip:</strong> Users are finding value in annual plans for long-term savings!</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {threads.map((thread) => (
          <ThreadListItem key={thread.id} thread={thread} />
        ))}
      </div>

      {threads.length === 0 && (
         <div className="text-center py-16 col-span-full">
            <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-semibold text-foreground">No Threads Yet</h3>
            <p className="mt-2 text-md text-muted-foreground">
              Be the first to start a discussion.
            </p>
          </div>
      )}
    </div>
  );
}

