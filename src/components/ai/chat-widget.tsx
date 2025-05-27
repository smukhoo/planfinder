
"use client";

import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Send, User, X, Loader2, ExternalLink, Mic, MicOff, Volume2, VolumeX, Languages } from 'lucide-react';
import { recommendPlan, RecommendPlanInput, RecommendPlanOutput } from '@/ai/flows/plan-recommendation';
import { useRouter } from 'next/navigation';
import type { TelecomPlan } from '@/services/telecom-plans';
import { Badge } from '@/components/ui/badge'; // Added for plan card styling

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

const suggestions = [
    "Jio plans under ₹300",
    "Airtel 1.5GB/day",
    "Vi 84 days validity",
    "Plans with Hotstar"
];

// For Web Speech API
let speechRecognition: SpeechRecognition | null = null;

export function ChatWidget({ isOpen, setIsOpen }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isListening, setIsListening] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  // const [currentLanguage, setCurrentLanguage] = useState('en-US'); // Placeholder for language selection

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: 'greeting', type: 'bot', text: "Hi! I'm your ConnectPlan AI assistant, powered by Gemini. How can I help you find a plan today? (e.g., 'I need a Jio plan under ₹500 with good data for 3 months')" }
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // TTS for new bot messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'bot' && lastMessage.text && isTTSEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(lastMessage.text);
        // utterance.lang = currentLanguage; // Set language for TTS
        utterance.lang = 'en-US'; // Default to English for now
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [messages, isTTSEnabled]);


  const handleSendMessage = async (forcedQuery?: string) => {
    const currentQuery = (forcedQuery || inputValue).trim();
    if (currentQuery === '') return;

    const userMessage: Message = { id: Date.now().toString(), type: 'user', text: currentQuery };
    setMessages(prev => [...prev, userMessage]);
    if (!forcedQuery) {
      setInputValue('');
    }
    setIsLoading(true);

    try {
      const aiInput: RecommendPlanInput = { query: currentQuery };
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
    if (plan.rechargeUrl) {
      window.open(plan.rechargeUrl, '_blank', 'noopener,noreferrer');
    } else {
      router.push(`/plans?operator=${encodeURIComponent(plan.operator)}`);
    }
  };

  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support Speech Recognition.");
      return;
    }

    if (isListening && speechRecognition) {
      speechRecognition.stop();
      setIsListening(false);
    } else {
      speechRecognition = new SpeechRecognition();
      speechRecognition.lang = 'en-US'; // For now, hardcode to English
      speechRecognition.interimResults = false;
      speechRecognition.continuous = false;

      speechRecognition.onstart = () => {
        setIsListening(true);
      };

      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev + transcript + ' ');
      };

      speechRecognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        alert(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
         // Automatically send if there's content after STT stops.
        if (inputValue.trim() !== '') {
          // handleSendMessage(); // This might be too aggressive, let user click send.
        }
      };
      speechRecognition.start();
    }
  };

  const toggleTTS = () => {
    setIsTTSEnabled(prev => !prev);
    if (isTTSEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
    }
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
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleTTS} className="text-primary hover:bg-primary/20" aria-label={isTTSEnabled ? "Disable voice output" : "Enable voice output"}>
            {isTTSEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          {/* Placeholder for language selection - requires more involved backend/AI changes for true multilingual responses
          <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/20" aria-label="Select language">
            <Languages className="h-5 w-5" />
          </Button>
          */}
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary hover:bg-primary/20" aria-label="Close chat">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl shadow-sm ${
                    msg.type === 'user' ? 'bg-primary text-primary-foreground' : 
                    msg.type === 'bot' ? 'bg-card text-card-foreground border' : // Changed bot bubble to bg-card for plan contrast
                    'bg-destructive text-destructive-foreground'
                  }`}>
                  {msg.type !== 'error' && (
                    <div className="flex items-center mb-1.5">
                        {msg.type === 'user' ? 
                            <User className="h-4 w-4 mr-2 text-primary-foreground/80" /> : 
                            <Bot className="h-4 w-4 mr-2 text-primary" />
                        }
                        <span className="text-xs font-medium">
                            {msg.type === 'user' ? 'You' : 'ConnectPlan AI'}
                        </span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  {msg.plans && msg.plans.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.plans.slice(0, 3).map((plan, index) => (
                        <Card key={index} className="bg-background/70 p-2.5 rounded-md shadow-sm border-border/50">
                          <CardHeader className="p-0 mb-1.5">
                            <CardTitle className="text-sm font-semibold text-primary">
                              {plan.operator} ₹{plan.price}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0 text-xs text-muted-foreground space-y-0.5">
                            <p><strong>Data:</strong> {plan.data}</p>
                            <p><strong>Validity:</strong> {plan.validity} days</p>
                            {plan.talktime && plan.talktime !== "N/A" && <p><strong>Talktime:</strong> {plan.talktime}</p>}
                            {plan.sms && plan.sms !== "N/A" && <p><strong>SMS:</strong> {plan.sms}</p>}
                            {plan.additionalBenefits && (
                              <p className="truncate text-muted-foreground/80">
                                <strong>Benefits:</strong> {plan.additionalBenefits.length > 50 ? plan.additionalBenefits.substring(0, 50) + "..." : plan.additionalBenefits}
                              </p>
                            )}
                          </CardContent>
                          <CardFooter className="p-0 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full h-auto py-1.5 px-2 text-xs items-center border-primary/50 text-primary hover:bg-primary/10"
                              onClick={() => handlePlanClick(plan)}
                              title={`View ${plan.operator} ₹${plan.price} plan`}
                            >
                              View Plan on {plan.operator} site
                              <ExternalLink className="ml-auto h-3 w-3" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                       {msg.plans.length > 3 && (
                         <Button variant="link" size="sm" className="text-xs p-0 h-auto mt-1 text-primary" onClick={() => router.push(`/plans?q=${encodeURIComponent(messages.find(m => m.type === 'user')?.text || '')}`)}>
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
                  <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
                  <p className="text-sm">Finding plans...</p>
                </div>
              </div>
            )}
            { !isLoading && messages.length > 0 && messages[messages.length-1].type === 'bot' && (
                <div className="mt-4 pt-4 border-t border-border/30">
                    <p className="text-xs text-muted-foreground mb-2 text-center">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {suggestions.map((suggestion, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-auto py-1 px-2 bg-background hover:bg-muted/80"
                                onClick={() => handleSendMessage(suggestion)}
                            >
                                {suggestion}
                            </Button>
                        ))}
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
          <Button 
            type="button" 
            variant={isListening ? "destructive" : "outline"} 
            size="icon" 
            onClick={toggleListening}
            disabled={isLoading}
            className="shrink-0"
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Input
            type="text"
            placeholder={isListening ? "Listening..." : "Ask about plans..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
            disabled={isLoading || isListening}
            aria-label="Chat input"
          />
          <Button type="submit" size="icon" disabled={isLoading || inputValue.trim() === ''} className="bg-accent hover:bg-accent/90 shrink-0">
            <Send className="h-5 w-5 text-accent-foreground" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

    