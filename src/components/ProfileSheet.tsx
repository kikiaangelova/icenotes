import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AvatarUpload } from '@/components/AvatarUpload';
import { ChevronLeft, LogOut, Bell, Shield, Mail, Globe } from 'lucide-react';
import { useJournal } from '@/context/JournalContext';
import { useAuth } from '@/context/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useNavigate } from 'react-router-dom';
import { useLanguage, LANGUAGES, type Language } from '@/context/LanguageContext';

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
  onOpenReminders,
  onLogout,
}) => {
  const { profile, setProfile } = useJournal();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  if (!profile) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="authenticated-app app-sheet w-full sm:max-w-md p-0 flex flex-col"
      >
        <div className="sticky top-0 z-10 flex h-16 items-center border-b border-border bg-background px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="-ml-3 h-11 gap-1.5 text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('profile.back')}
          </Button>
          <SheetHeader className="flex-1 pr-8 text-center">
            <SheetTitle className="text-sm font-semibold">{t('profile.title')}</SheetTitle>
          </SheetHeader>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-7 space-y-8">
          {/* Identity */}
          <div className="flex items-center gap-4 border-b border-border pb-6 text-left">
            <AvatarUpload
              avatarUrl={profile.avatarUrl}
              name={profile.name}
              onAvatarChange={(url) => setProfile({ ...profile, avatarUrl: url })}
              size="lg"
            />
            <div>
              <h2 className="text-lg font-bold text-foreground">{profile.name}</h2>
              {user?.email && (
                <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </p>
              )}
              {profile.mainFocus && (
                <p className="text-xs text-muted-foreground mt-2 max-w-xs">
                  {t('profile.focus')}: {profile.mainFocus}
                </p>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-2">
            <p className="app-section-label px-1">{t('profile.settings')}</p>

            {/* Language — switch the whole app + AI support */}
            <div className="flex w-full items-center gap-3 border-b border-border px-1 py-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-secondary">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{t('profile.language')}</p>
                <p className="text-xs text-muted-foreground">{t('profile.languageSub')}</p>
              </div>
              <div className="flex flex-shrink-0 gap-1 rounded-md bg-muted p-1">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code as Language)}
                    aria-pressed={language === l.code}
                    className={
                       'px-3 h-9 rounded text-xs font-bold transition-colors ' +
                      (language === l.code
                         ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground')
                    }
                  >
                    {l.code}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { onOpenReminders(); onOpenChange(false); }}
              className="flex h-14 w-full items-center gap-3 border-b border-border px-1 text-left transition-colors hover:text-accent"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{t('profile.reminders')}</p>
                <p className="text-xs text-muted-foreground">{t('profile.remindersSub')}</p>
              </div>
            </button>

            {isAdmin && (
              <button
                onClick={() => { navigate('/admin'); onOpenChange(false); }}
                className="flex h-14 w-full items-center gap-3 border-b border-border px-1 text-left transition-colors hover:text-accent"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{t('profile.admin')}</p>
                  <p className="text-xs text-muted-foreground">{t('profile.adminSub')}</p>
                </div>
              </button>
            )}
          </div>

        </div>

        {/* Sticky footer — Logout always visible, no dead end */}
        <div className="border-t border-border bg-background px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full h-12 gap-2 border-border text-muted-foreground hover:border-destructive/50 hover:bg-background hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
            {t('profile.logout')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
