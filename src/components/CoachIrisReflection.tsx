import React, { useEffect, useState } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { IrisAvatar } from '@/components/IrisAvatar';

const SYSTEM_PROMPT = `You are Coach Kiki, a sport psychologist reading a skater's journal entry. Reply with at most 3 short spoken sentences: name one concrete thing you actually noticed in what they wrote (quote their own words if useful), then ask ONE open question that helps them find their own answer. No empathy boilerplate, no advice unless they asked, no encouragement lines, no emoji, no poster phrases like "be kind to yourself", "that's valid", "you've got this", "trust the process". Plain, human, short.`;

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
            systemOverride: SYSTEM_PROMPT,
            stream: false,
            language,
            messages: [
              {
                role: 'user',
                content: `Here is my journal entry:\n\n"""${text}"""`,
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

  return (
    <div className="animate-fade-in mt-4 rounded-2xl border border-lavender-foreground/25 bg-gradient-to-br from-lavender/40 via-grape/15 to-lavender/20 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-lavender-foreground/15 flex items-center justify-center">
          <Snowflake className="w-4 h-4 text-lavender-foreground" />
        </div>
        <span className="text-sm font-bold text-lavender-foreground">
          Coach Kiki noticed:
        </span>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-lavender-foreground/80 italic">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Reading your reflection…
        </div>
      ) : (
        <p className="text-sm sm:text-base leading-relaxed text-foreground whitespace-pre-wrap">
          {reply}
        </p>
      )}
    </div>
  );
};
