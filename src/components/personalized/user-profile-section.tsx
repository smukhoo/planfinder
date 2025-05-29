
// src/components/personalized/user-profile-section.tsx
"use client";

import type { MockUserProfile } from '@/types/personalized';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Smartphone, Signal } from 'lucide-react';

interface UserProfileSectionProps {
  profile: MockUserProfile;
  cardStyle?: string;
}

export function UserProfileSection({ profile, cardStyle }: UserProfileSectionProps) {
  return (
    <Card className={cardStyle || "shadow-lg"}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center">
          <User className="mr-3 h-7 w-7" />
          Profile Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <Avatar className="h-24 w-24 border-4 border-primary/50 shadow-md">
            <AvatarImage src={profile.avatarSrc} alt={profile.name} data-ai-hint={profile.avatarHint} />
            <AvatarFallback className="text-3xl bg-muted text-muted-foreground">{profile.avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold text-foreground">
              {profile.name}
            </h3>
            <p className="text-md text-muted-foreground flex items-center justify-center sm:justify-start">
              <Smartphone className="mr-2 h-5 w-5" />
              {profile.mobileNumber}
            </p>
            <p className="text-md text-muted-foreground flex items-center justify-center sm:justify-start">
              <Signal className="mr-2 h-5 w-5" />
              Current Operator: <span className="font-medium text-foreground ml-1">{profile.operator}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

    