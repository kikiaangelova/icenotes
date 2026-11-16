import React, { useState, useEffect } from 'react';
import { Seo } from '@/components/Seo';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { contactMessageSchema } from '@/lib/contactMessage';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

const Contact: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || website.trim()) return;
    const parsed = contactMessageSchema.safeParse({ name, email, message, locale: language, consent });
    if (!parsed.success) {
      toast({ title: language === 'bg' ? 'Провери името, имейла, съобщението и съгласието.' : 'Check your name, email, message and consent.', variant: 'destructive' });
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({ name: parsed.data.name ?? '', email: parsed.data.email ?? '', message: parsed.data.message ?? '', locale: language, consent: true });
      if (error) throw error;
    } catch {
      toast({ title: t('fb.error'), variant: 'destructive' });
      return;
    } finally { setBusy(false); }

    setSubmitted(true);
    setName('');
    setMessage('');
    setEmail(''); setConsent(false);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="public-editorial min-h-screen bg-background">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <Seo title="Contact SkateGoals – Get in Touch" description="Questions about SkateGoals, your account or your data? Contact the SkateGoals team." path="/contact" />

        <section className="px-6 md:px-12 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">{t('contact.eyebrow')}</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-5">
                {t('contact.title')}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('contact.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-7">
                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle className="font-serif">{t('contact.form.title')}</CardTitle>
                    <CardDescription>{t('contact.form.desc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="text-center py-10 space-y-4">
                        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-7 h-7 text-success" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{language === 'bg' ? 'Благодарим ти. Ще ти отговорим по имейл.' : 'Thank you. We will reply by email.'}</h3>

                        <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-2">
                          {t('contact.form.another')}
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t('contact.form.name')}</Label>
                          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('contact.form.namePh')} maxLength={80} required className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-email">{t('contact.form.email')}</Label>
                          <Input id="contact-email" type="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={254} autoComplete="email" required className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">{t('contact.form.message')}</Label>
                          <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('contact.form.messagePh')} maxLength={4000} required className="min-h-[140px] resize-none" />
                        </div>
                        <div className="hidden" aria-hidden><input name="website" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" /></div>
                        <div className="flex items-start gap-3">
                          <Checkbox id="contact-consent" checked={consent} onCheckedChange={value => setConsent(value === true)} className="mt-1" />
                          <label htmlFor="contact-consent" className="text-sm leading-relaxed">{language === 'bg' ? 'Съгласен/на съм SkateGoals да пази тези данни, за да отговори на съобщението ми. ' : 'I agree that SkateGoals stores these details to reply to my message. '}<Link to="/privacy" target="_blank" rel="noopener noreferrer" className="underline">{language === 'bg' ? 'Политиката за поверителност' : 'Privacy Policy'}</Link></label>
                        </div>
                        <Button type="submit" disabled={busy || !consent} className="w-full h-11 font-semibold gap-2">
                          <Send className="w-4 h-4" />
                          {busy ? t('fb.sending') : t('contact.form.send')}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-5 space-y-6">
                <div className="p-6 rounded-xl border border-border/60 bg-card space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{t('contact.email.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('contact.email.desc')}
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-border/60 bg-card space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{t('contact.feedback.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'bg' ? 'Идея или въпрос за SkateGoals? Използвай формата, независимо дали имаш профил.' : 'An idea or question about SkateGoals? Use the form whether or not you have an account.'}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Contact;
