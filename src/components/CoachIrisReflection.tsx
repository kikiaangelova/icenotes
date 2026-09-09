import React, { useEffect, useState } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Brain } from 'lucide-react';

// The system prompt lives server-side (role: "psych"). The client only frames the task.
const TASK = {
  en: 'Read my journal entry below. Name one concrete thing you noticed in what I wrote, in at most three short sentences, then ask me one open question. Nothing else.',
  bg: 'Прочети записа ми по-долу. Кажи едно конкретно нещо, което забеляза в написаното, най-много в три кратки изречения, и после ми задай един отворен въпрос. Нищо друго.',
};

interface CoachIrisReflectionProps {
  journalText: string;
  /** Optional key — when it changes, a new reflection is fetched. */
  triggerKey?: string | number;
}

export const CoachIrisReflection: React.FC<CoachIrisReflectionProps> = ({
  journalText,
  triggerKey,
}) => {
  const { language } = useLanguage();
  const [reply, setReply] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const text = journalText?.trim();
    if (!text) {
      setFailed(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setFailed(false);
      setReply('');
      try {
        const { data, error } = await supabase.functions.invoke('skating-coach', {
          body: {
            role: 'psych',
            stream: false,
            language,
            messages: [
              {
                role: 'user',
                content: `${language === 'bg' ? TASK.bg : TASK.en}\n\n"""${text}"""`,
              },
            ],
          },
        });
        if (cancelled) return;
        if (error) throw error;
        const content =
          data?.choices?.[0]?.message?.content ??
          data?.message?.content ??
          '';
        if (!content || typeof content !== 'string') throw new Error('empty');
        setReply(content.trim());
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [journalText, triggerKey, language]);

  // Silently fail
  if (failed) return null;

  const continueInChat = () => {
    const msg =
      language === 'bg'
        ? `Ето какво записах днес:\n\n"""${journalText.trim()}"""\n\nПопита ме: ${reply}`
        : `Here's what I wrote today:\n\n"""${journalText.trim()}"""\n\nYou asked me: ${reply}`;
    window.dispatchEvent(
      new CustomEvent('coach-iris:open', { detail: { message: msg, role: 'psych' } }),
    );
  };

  return (
    <div className="animate-fade-in mt-4 rounded-2xl border border-border bg-muted/40 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-4 h-4 text-primary" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {language === 'bg' ? 'Забелязано в записа ти' : 'Noticed in your reflection'}
        </span>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          {language === 'bg' ? 'Чете записа ти…' : 'Reading your reflection…'}
        </div>
      ) : (
        <>
          <p className="text-sm sm:text-base leading-relaxed text-foreground whitespace-pre-wrap">
            {reply}
          </p>
          <button
            onClick={continueInChat}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {language === 'bg' ? 'Продължи разговора' : 'Continue the conversation'}
          </button>
        </>
      )}
    </div>
  );
};
