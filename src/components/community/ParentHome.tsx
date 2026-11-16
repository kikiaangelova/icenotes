import React, { useState } from 'react';
import { LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { GdprSettings } from '@/components/GdprSettings';
import { ParentSpace } from './ParentSpace';

/** Parents never get the skater app shell: no journal, no AI chats, no training screens. */
export const ParentHome: React.FC<{ nickname: string }> = ({ nickname }) => {
  const { signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const bg = language === 'bg';
  return (
    <div className="authenticated-app min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="mx-auto flex h-[68px] max-w-4xl items-center justify-between gap-2 px-4 sm:px-8">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold">{nickname}</p>
            <p className="text-[13px] text-muted-foreground">{bg ? 'Родител' : 'Parent'}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {(['bg', 'en'] as const).map(c => <Button key={c} variant={language === c ? 'default' : 'outline'} className="h-11 w-12" aria-pressed={language === c} onClick={() => setLanguage(c)}>{c.toUpperCase()}</Button>)}
            <Button variant="ghost" size="icon" className="h-11 w-11" aria-label={bg ? 'Настройки' : 'Settings'} onClick={() => setSettingsOpen(true)}><Settings className="h-5 w-5" /></Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 sm:px-8"><ParentSpace /></main>

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent side="right" className="authenticated-app app-sheet w-full p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border px-5 py-5 text-left">
            <SheetTitle>{bg ? 'Настройки' : 'Settings'}</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 overflow-y-auto p-5">
            <GdprSettings />
            <Button variant="outline" className="h-12 w-full gap-2" onClick={signOut}><LogOut className="h-5 w-5" />{bg ? 'Изход' : 'Sign out'}</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
