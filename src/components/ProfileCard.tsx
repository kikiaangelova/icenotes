import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, UserPlus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  name: string;
  handle: string;
  avatarUrl?: string;
  bio?: string;
  level?: string;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  handle,
  avatarUrl,
  bio = 'Trusting the process. One edge at a time. ⛸️',
  level = 'Pre-Juvenile',
  className,
}) => {
  const [following, setFollowing] = useState(false);
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-lavender via-rose/60 to-peach/50 border border-border/40 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1',
        className
      )}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/15 rounded-full blur-2xl" />
      <div className="absolute -bottom-12 -left-8 w-32 h-32 bg-rose-foreground/10 rounded-full blur-2xl" />

      <div className="relative flex items-start gap-4">
        <div className="relative shrink-0">
          <Avatar className="h-16 w-16 ring-4 ring-background shadow-md">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-rose-foreground text-primary-foreground font-extrabold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background flex items-center justify-center shadow">
            <Sparkles className="w-3 h-3 text-primary" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold tracking-tight truncate">{name}</h3>
          <p className="text-xs text-muted-foreground truncate">@{handle} · {level}</p>
          <p className="text-sm mt-1.5 leading-snug text-foreground/80 line-clamp-2">{bio}</p>
        </div>
      </div>

      <Button
        onClick={() => setFollowing((f) => !f)}
        size="sm"
        variant={following ? 'outline' : 'default'}
        className={cn(
          'mt-4 w-full h-10 rounded-xl font-bold gap-2 transition-all',
          !following && 'bg-foreground text-background hover:bg-foreground/90'
        )}
      >
        {following ? (<><Check className="w-4 h-4" /> Following</>) : (<><UserPlus className="w-4 h-4" /> Follow</>)}
      </Button>
    </div>
  );
};
