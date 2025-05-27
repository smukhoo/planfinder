
"use client";

import { useRef, useEffect, useState } from 'react'; // Added useState
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Send, User, X, Loader2 } from 'lucide-react';
import { recommendPlan, RecommendPlanInput, RecommendPlanOutput } from '@/ai/flows/plan-recommendation';
import { useRouter } from 'next/navigation';
import type { TelecomPlan } from '@/services/telecom-plans';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'error';
  text?: string;
  plans?: TelecomPlan[];
}

interface ChatWidgetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ChatWidget({ isOpen, setIsOpen }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]); // Changed from React.useState
  const [inputValue, setInputValue] = useState(''); // Changed from React.useState
  const [isLoading, setIsLoading] = useState(false); // Changed from React.useState
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: 'greeting', type: 'bot', text: "Hi! I'm your ConnectPlan AI assistant. How can I help you find a plan today? (e.g., 'I need a Jio plan under ₹500 with good data for 3 months')" }
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = { id: Date.now().toString(), type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiInput: RecommendPlanInput = { query: userMessage.text! };
      const aiResponse: RecommendPlanOutput = await recommendPlan(aiInput);
      
      const botMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        type: 'bot', 
        text: aiResponse.planRecommendation,
        plans: aiResponse.plans as TelecomPlan[]
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("AI recommendation error:", error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), type: 'error', text: "Sorry, I couldn't process your request. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanClick = (plan: TelecomPlan) => {
    router.push(`/plans?operator=${encodeURIComponent(plan.operator)}&price=${plan.price}`);
    setIsOpen(false); 
  };

  if (!isOpen) {
    return (
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-xl bg-accent hover:bg-accent/90"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Chat Helper"
      >
        <Bot className="h-7 w-7 text-accent-foreground" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-full max-w-sm h-[calc(100vh-6rem)] max-h-[700px] shadow-xl rounded-lg flex flex-col z-50 border-primary/50">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-primary/10">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <CardTitle className="text-lg font-semibold text-primary">ConnectPlan AI Helper</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary hover:bg-primary/20">
          <X className="h-5 w-5" />
          <span className="sr-only">Close chat</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl shadow-sm ${
                    msg.type === 'user' ? 'bg-primary text-primary-foreground' : 
                    msg.type === 'bot' ? 'bg-muted text-muted-foreground' : 'bg-destructive text-destructive-foreground'
                  }`}>
                  {msg.type === 'user' && <User className="h-4 w-4 mb-1 inline-block mr-1" />}
                  {msg.type === 'bot' && <Bot className="h-4 w-4 mb-1 inline-block mr-1" />}
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  {msg.plans && msg.plans.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium">Here are some plans I found:</p>
                      {msg.plans.slice(0, 3).map((plan, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-left h-auto py-1 px-2 text-xs"
                          onClick={() => handlePlanClick(plan)}
                        >
                          {plan.operator} ₹{plan.price} - {plan.data}, {plan.validity} days
                        </Button>
                      ))}
                       {msg.plans.length > 3 && (
                         <Button variant="link" size="sm" className="text-xs p-0 h-auto mt-1" onClick={() => router.push(`/plans?q=${encodeURIComponent(messages.find(m => m.type === 'user')?.text || '')}`)}>
                           View all {msg.plans.length} plans...
                         </Button>
                       )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-xl shadow-sm bg-muted text-muted-foreground flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <p className="text-sm">Finding plans...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Ask about plans..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <Button type="submit" size="icon" disabled={isLoading || inputValue.trim() === ''} className="bg-accent hover:bg-accent/90">
            <Send className="h-5 w-5 text-accent-foreground" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
