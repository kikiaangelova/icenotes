import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { useLanguage, LANGUAGES, Language } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Change language"
          className={cn('rounded-xl h-9 px-2.5 gap-1.5 font-semibold', className)}
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wide">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-xl">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLanguage(l.code as Language)}
            className="rounded-lg flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground w-6">
                {l.code}
              </span>
              <span className="text-sm">{l.nativeLabel}</span>
            </span>
            {language === l.code && <Check className="w-4 h-4 opacity-70" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
