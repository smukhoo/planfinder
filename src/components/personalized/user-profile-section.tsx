
// src/components/personalized/user-profile-section.tsx
"use client";

import type { MockUserProfile } from '@/types/personalized';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // CardHeader and CardTitle might be unused if handled by AccordionTrigger
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Smartphone, Signal } from 'lucide-react'; // User icon removed as it's in AccordionTrigger

interface UserProfileSectionProps {
  profile: MockUserProfile;
  cardStyle?: string; // This style will be applied to the content wrapper if Card is removed
}

export function UserProfileSection({ profile, cardStyle }: UserProfileSectionProps) {
  // The AccordionTrigger will handle the main title and icon
  // This component now just returns the content that would go inside the card.
  return (
    <div className={cardStyle}> {/* Apply passed cardStyle or default styling for content */}
      <CardContent className="pt-2"> {/* Adjust padding if needed */}
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
    </div>
  );
}
    

    