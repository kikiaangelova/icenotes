import React, { useState, useEffect } from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';

/**
 * Private product feedback. Replaces the legacy "share your experience" page.
 * Writes to the existing `feedback` table (authenticated insert, admin-only read).
 */
const Feedback: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from('feedback').insert({
      name: name.trim().slice(0, 80),
      skating_level: category.trim().slice(0, 60) || null,
      message: message.trim().slice(0, 4000),
    });
    setBusy(false);
    if (error) {
      toast({ title: t('fb.error'), variant: 'destructive' });
      return;
    }
    setSent(true);
    setName('');
    setCategory('');
    setMessage('');
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <Seo
          title={language === 'bg' ? 'Обратна връзка — SkateGoals' : 'Feedback — SkateGoals'}
          description={
            language === 'bg'
              ? 'Изпрати обратна връзка за SkateGoals. Стига само до екипа на продукта.'
              : 'Send private product feedback to the SkateGoals team.'
          }
          path="/feedback"
        />

        <section className="px-5 md:px-12 pt-16 pb-20 md:pt-24">
          <div className="max-w-xl mx-auto">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">{t('fb.eyebrow')}</p>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-4">{t('fb.title')}</h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8">{t('fb.subtitle')}</p>

            {!user ? (
              <div className="p-6 rounded-xl border border-border/60 bg-card space-y-3">
                <h2 className="text-base font-semibold text-foreground">{t('fb.signin')}</h2>
                <p className="text-sm text-muted-foreground">{t('fb.signinSub')}</p>
                <Link to="/auth">
                  <Button className="h-12 rounded-xl font-semibold mt-2">{t('fb.signin')}</Button>
                </Link>
              </div>
            ) : sent ? (
              <div className="p-6 rounded-xl border border-border/60 bg-card text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto" />
                <h2 className="text-base font-semibold text-foreground">{t('fb.thanks')}</h2>
                <p className="text-sm text-muted-foreground">{t('fb.thanksSub')}</p>
                <Button variant="outline" className="rounded-xl" onClick={() => setSent(false)}>
                  {t('fb.another')}
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5 p-6 rounded-xl border border-border/60 bg-card">
                <div className="space-y-2">
                  <Label htmlFor="fb-name">{t('fb.name')}</Label>
                  <Input
                    id="fb-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('fb.namePh')}
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fb-cat">{t('fb.category')}</Label>
                  <Input
                    id="fb-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder={t('fb.categoryPh')}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fb-msg">{t('fb.message')}</Label>
                  <Textarea
                    id="fb-msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('fb.messagePh')}
                    required
                    className="min-h-[150px] resize-none"
                  />
                </div>
                <Button type="submit" disabled={busy} className="w-full h-12 rounded-xl font-semibold gap-2">
                  <Send className="w-4 h-4" />
                  {busy ? t('fb.sending') : t('fb.send')}
                </Button>
              </form>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Feedback;
