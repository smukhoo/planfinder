
// src/components/personalized/user-profile-section.tsx
"use client";

import type { MockUserProfile } from '@/types/personalized';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Smartphone, Signal } from 'lucide-react';

interface UserProfileSectionProps {
  profile: MockUserProfile;
}

export function UserProfileSection({ profile }: UserProfileSectionProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={profile.avatarSrc} alt={profile.name} data-ai-hint={profile.avatarHint} />
            <AvatarFallback className="text-2xl">{profile.avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold text-foreground flex items-center">
              <User className="mr-2 h-5 w-5 text-muted-foreground" />
              {profile.name}
            </h3>
            <p className="text-md text-muted-foreground flex items-center">
              <Smartphone className="mr-2 h-5 w-5 text-muted-foreground" />
              {profile.mobileNumber}
            </p>
            <p className="text-md text-muted-foreground flex items-center">
              <Signal className="mr-2 h-5 w-5 text-muted-foreground" />
              Current Operator: {profile.operator}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
