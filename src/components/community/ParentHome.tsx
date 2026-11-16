import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ParentSpace } from './ParentSpace';

/** Parents never get the skater app shell: no journal, no AI chats, no training screens. */
export const ParentHome: React.FC<{ nickname: string }> = ({ nickname }) => {
  const { signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const bg = language === 'bg';
  return (
    <div className="authenticated-app min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="mx-auto flex h-[68px] max-w-4xl items-center justify-between gap-2 px-4 sm:px-8">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold">{nickname}</p>
            <p className="text-[13px] text-muted-foreground">{bg ? 'Родител' : 'Parent'}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {(['bg', 'en'] as const).map(c => <Button key={c} variant={language === c ? 'default' : 'outline'} className="h-11 w-12" aria-pressed={language === c} onClick={() => setLanguage(c)}>{c.toUpperCase()}</Button>)}
            <Button variant="ghost" className="h-11 gap-1.5" onClick={signOut}><LogOut className="h-4 w-4" />{bg ? 'Изход' : 'Sign out'}</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 sm:px-8"><ParentSpace /></main>
    </div>
  );
};
