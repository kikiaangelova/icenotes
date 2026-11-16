import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AvatarUpload } from '@/components/AvatarUpload';
import { ChevronLeft, LogOut, Bell, Shield, Mail, Globe, Trophy, Users, Award, ChevronRight, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useJournal } from '@/context/JournalContext';
import { useAuth } from '@/context/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useNavigate } from 'react-router-dom';
import { useLanguage, LANGUAGES, type Language } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { GdprSettings } from '@/components/GdprSettings';
import { SavedQuotesSection } from '@/components/SavedQuotesSection';

interface ProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoHome: () => void;
  onOpenReminders: () => void;
  onLogout: () => void;
}

export const PROFILE_CATEGORIES = ['advanced-novice', 'junior', 'senior', 'adult', 'other'] as const;
const CAT_KEY: Record<string, string> = {
  'advanced-novice': 'ob.cat.advancedNovice', junior: 'ob.cat.junior', senior: 'ob.cat.senior', adult: 'ob.cat.adult', other: 'ob.cat.other',
};
const LEVELS = ['foundations', 'consistency', 'refining', 'competing'] as const;

const Section: React.FC<{ icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
  <section className="rink-card space-y-3 p-4">
    <p className="flex items-center gap-2 text-[15px] font-bold text-foreground"><Icon className="h-4 w-4 text-accent-ink" />{title}</p>
    {children}
  </section>
);

type Draft = { name: string; club: string; category: string; level: string; comp: string; compDate: string };

/** Full profile screen: photo, club, level, category, next competition, language, reminders. Always exitable. */
export const ProfileSheet: React.FC<ProfileSheetProps> = ({ open, onOpenChange, onOpenReminders, onLogout }) => {
  const { profile, setProfile, setProfileAsync } = useJournal();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const bg = language === 'bg';
  const fromProfile = (): Draft => ({
    name: profile?.name ?? '', club: profile?.club ?? '', category: profile?.skatingCategory ?? '',
    level: profile?.selfLevel ?? '', comp: profile?.nextCompetition ?? '', compDate: profile?.nextCompetitionDate ?? '',
  });
  const [draft, setDraft] = useState<Draft>(fromProfile);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) setDraft(fromProfile()); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, profile]);

  if (!profile) return null;
  const initial = fromProfile();
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  const set = (k: keyof Draft, v: string) => setDraft((d) => ({ ...d, [k]: v }));

  const save = async () => {
    if (!draft.name.trim()) return;
    setSaving(true);
    try {
      await setProfileAsync({
        ...profile, name: draft.name.trim(), club: draft.club.trim(), skatingCategory: draft.category,
        selfLevel: (draft.level || profile.selfLevel) as typeof profile.selfLevel,
        nextCompetition: draft.comp.trim(), nextCompetitionDate: draft.compDate,
      });
      toast({ title: bg ? 'Профилът е запазен' : 'Profile saved' });
    } catch {
      toast({ title: bg ? 'Профилът не беше запазен' : 'Could not save the profile', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const choice = (on: boolean) => cn('rink-choice px-3 text-[14px]', on && 'rink-choice-on');
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="authenticated-app app-sheet w-full sm:max-w-md p-0 flex flex-col">
        <div className="sticky top-0 z-10 flex h-16 items-center border-b border-border bg-background px-4">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="-ml-3 h-11 gap-1.5 text-sm">
            <ChevronLeft className="w-4 h-4" />{t('profile.back')}
          </Button>
          <SheetHeader className="flex-1 pr-8 text-center">
            <SheetTitle className="text-sm font-semibold">{t('profile.title')}</SheetTitle>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto bg-background px-4 py-6 space-y-4">
          {/* Identity */}
          <section className="rink-card flex flex-col items-center gap-3 p-5 text-center">
            <AvatarUpload avatarUrl={profile.avatarUrl} name={profile.name} onAvatarChange={(url) => setProfile({ ...profile, avatarUrl: url })} size="lg" />
            <p className="text-[13px] text-muted-foreground">{bg ? 'Докосни снимката, за да я смениш' : 'Tap the photo to change it'}</p>
            <div className="w-full space-y-1.5 text-left">
              <Label htmlFor="profile-display-name">{t('profile.displayName')}</Label>
              <Input id="profile-display-name" value={draft.name} onChange={(e) => set('name', e.target.value)} maxLength={60} autoComplete="name" className="h-12" />
            </div>
            {user?.email && <p className="inline-flex items-center gap-1 text-[13px] text-muted-foreground"><Mail className="h-3.5 w-3.5" />{user.email}</p>}
          </section>

          <Section icon={Users} title={bg ? 'Клуб' : 'Club'}>
            <Input aria-label={bg ? 'Клуб' : 'Club'} value={draft.club} onChange={(e) => set('club', e.target.value)} maxLength={80} placeholder={bg ? 'Например СК Ледена пързалка' : 'Your skating club'} className="h-12" />
          </Section>

          <Section icon={Trophy} title={bg ? 'Категория' : 'Category'}>
            <div className="grid grid-cols-2 gap-2">
              {PROFILE_CATEGORIES.map((c) => (
                <button key={c} type="button" aria-pressed={draft.category === c} onClick={() => set('category', c)} className={choice(draft.category === c)}>{t(CAT_KEY[c])}</button>
              ))}
            </div>
          </Section>

          <Section icon={Award} title={bg ? 'Ниво' : 'Level'}>
            <div className="grid grid-cols-2 gap-2">
              {LEVELS.map((l) => (
                <button key={l} type="button" aria-pressed={draft.level === l} onClick={() => set('level', l)} className={choice(draft.level === l)}>{t(`level.${l}.label`)}</button>
              ))}
            </div>
          </Section>

          <Section icon={CalendarDays} title={bg ? 'Следващо състезание' : 'Next competition'}>
            <Input aria-label={bg ? 'Име на състезанието' : 'Competition name'} value={draft.comp} onChange={(e) => set('comp', e.target.value)} maxLength={120} placeholder={bg ? 'Име на състезанието' : 'Competition name'} className="h-12" />
            <Input type="date" aria-label={bg ? 'Дата' : 'Date'} value={draft.compDate} onChange={(e) => set('compDate', e.target.value)} className="h-12" />
          </Section>

          <Button onClick={save} disabled={saving || !dirty || !draft.name.trim()} className="h-12 w-full text-[15px] font-bold">
            {saving ? t('profile.nameSaving') : (bg ? 'Запази профила' : 'Save profile')}
          </Button>

          <Section icon={Globe} title={t('profile.language')}>
            <p className="text-[13px] text-muted-foreground">{t('profile.languageSub')}</p>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label={t('profile.language')}>
              {LANGUAGES.map((l) => (
                <button key={l.code} type="button" onClick={() => setLanguage(l.code as Language)} aria-pressed={language === l.code} className={choice(language === l.code)}>
                  {l.code === 'bg' ? 'Български' : 'English'}
                </button>
              ))}
            </div>
          </Section>

          <SavedQuotesSection />

          <button type="button" onClick={() => { onOpenReminders(); onOpenChange(false); }} className="rink-card flex min-h-[64px] w-full items-center gap-3 p-4 text-left">
            <Bell className="h-5 w-5 text-accent-ink" />
            <span className="flex-1"><span className="block text-[15px] font-bold text-foreground">{t('profile.reminders')}</span><span className="block text-[13px] text-muted-foreground">{t('profile.remindersSub')}</span></span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          {isAdmin && (
            <button type="button" onClick={() => { navigate('/admin'); onOpenChange(false); }} className="rink-card flex min-h-[64px] w-full items-center gap-3 p-4 text-left">
              <Shield className="h-5 w-5 text-accent-ink" />
              <span className="flex-1"><span className="block text-[15px] font-bold text-foreground">{t('profile.admin')}</span><span className="block text-[13px] text-muted-foreground">{t('profile.adminSub')}</span></span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          )}

          <GdprSettings />
        </div>

        <div className="border-t border-border bg-background px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <Button onClick={onLogout} variant="outline" className="w-full h-12 gap-2 border-border text-muted-foreground hover:border-destructive/50 hover:bg-background hover:text-destructive">
            <LogOut className="w-5 h-5" />{t('profile.logout')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
