import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AvatarUpload } from '@/components/AvatarUpload';
import { Home, ChevronLeft, LogOut, Bell, Shield, Mail, ExternalLink, Users } from 'lucide-react';
import { useJournal } from '@/context/JournalContext';
import { useAuth } from '@/context/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useNavigate } from 'react-router-dom';

interface ProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoHome: () => void;
  onOpenReminders: () => void;
  onLogout: () => void;
}

/**
 * Profile drawer — always exitable.
 * - Back button (closes the sheet)
 * - Home button (jumps to dashboard home)
 * - Logout button (clearly visible at the bottom)
 * No dead ends: every route out is one tap away.
 */
export const ProfileSheet: React.FC<ProfileSheetProps> = ({
  open,
  onOpenChange,
  onGoHome,
  onOpenReminders,
  onLogout,
}) => {
  const { profile, setProfile } = useJournal();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  if (!profile) return null;

  const handleHome = () => {
    onGoHome();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col bg-gradient-to-b from-peach/20 via-background to-lavender/15"
      >
        {/* Top bar with Back + Home — always visible exits */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="gap-1.5 -ml-2 rounded-xl font-semibold text-sm h-10"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <SheetHeader className="flex-1 text-center">
            <SheetTitle className="text-sm font-bold font-serif">Profile</SheetTitle>
          </SheetHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHome}
            className="gap-1.5 -mr-2 rounded-xl font-semibold text-sm h-10"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {/* Identity */}
          <div className="flex flex-col items-center gap-3 text-center">
            <AvatarUpload
              avatarUrl={profile.avatarUrl}
              name={profile.name}
              onAvatarChange={(url) => setProfile({ ...profile, avatarUrl: url })}
              size="lg"
            />
            <div>
              <h2 className="text-xl font-black text-foreground font-serif">{profile.name}</h2>
              {user?.email && (
                <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </p>
              )}
              {profile.mainFocus && (
                <p className="text-xs text-muted-foreground mt-2 italic max-w-xs">
                  Focus: {profile.mainFocus}
                </p>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground px-1">Settings</p>

            <button
              onClick={() => { onOpenReminders(); onOpenChange(false); }}
              className="w-full h-14 px-4 rounded-2xl bg-card border border-border/50 flex items-center gap-3 hover:bg-muted/60 active:scale-[0.99] transition-all text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-lavender/50 flex items-center justify-center">
                <Bell className="w-4 h-4 text-lavender-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Reminders</p>
                <p className="text-xs text-muted-foreground">Daily journaling & training prompts</p>
              </div>
            </button>

            {isAdmin && (
              <button
                onClick={() => { navigate('/admin'); onOpenChange(false); }}
                className="w-full h-14 px-4 rounded-2xl bg-card border border-border/50 flex items-center gap-3 hover:bg-muted/60 active:scale-[0.99] transition-all text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-grape/40 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-grape-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Admin Dashboard</p>
                  <p className="text-xs text-muted-foreground">Manage users & content</p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Sticky footer — Logout always visible, no dead end */}
        <div className="px-5 py-4 border-t border-border/40 bg-background/80 backdrop-blur-xl pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full h-14 rounded-2xl font-bold text-base border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
