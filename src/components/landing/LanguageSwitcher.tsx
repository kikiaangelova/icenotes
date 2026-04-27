import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      aria-label={`Switch language to ${language === 'en' ? 'Bulgarian' : 'English'}`}
      className={cn('rounded-xl h-9 px-2.5 gap-1.5 font-semibold', className)}
    >
      <Globe className="w-4 h-4" />
      <span className="text-xs uppercase tracking-wide">{language === 'en' ? 'EN' : 'BG'}</span>
    </Button>
  );
};
