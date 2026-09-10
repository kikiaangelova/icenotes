import React from 'react';
import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useVoiceCapture } from '@/hooks/useVoiceCapture';
import { Textarea } from '@/components/ui/textarea';

const appendText = (current: string, addition: string) => {
  const base = current.trimEnd();
  if (!base) return addition;
  return /[.!?]$/.test(base) ? `${base} ${addition}` : `${base} ${addition}`;
};

interface VoiceButtonProps {
  /** current field value */
  value: string;
  /** receives the field value with recognised speech appended */
  onChange: (next: string) => void;
  className?: string;
  /** compact mic for dense rows (AI chat) */
  size?: 'sm' | 'md';
}

/**
 * Small mic control that turns speech into editable text inside the active field.
 * Nothing is saved automatically and no audio is stored by SkateGoals.
 */
export const VoiceButton: React.FC<VoiceButtonProps> = ({ value, onChange, className, size = 'md' }) => {
  const { t, language } = useLanguage();
  const valueRef = React.useRef(value);
  valueRef.current = value;

  const { supported, listening, interim, error, toggle } = useVoiceCapture({
    lang: language === 'bg' ? 'bg-BG' : 'en-US',
    onFinalText: (text) => onChange(appendText(valueRef.current, text)),
  });

  if (!supported) return null;

  const dim = size === 'sm' ? 'h-11 w-11' : 'h-11 w-11';

  return (
    <div className={cn('flex flex-col items-end gap-1', className)}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={listening}
        aria-label={listening ? t('voice.stop') : t('voice.start')}
        title={listening ? t('voice.stop') : t('voice.start')}
        className={cn(
          dim,
          'rounded-xl border flex items-center justify-center transition-colors shrink-0',
          listening
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50'
        )}
      >
        {listening ? <Square className="w-4 h-4" /> : <Mic className="w-[18px] h-[18px]" />}
      </button>
      {listening && (
        <span className="text-[11px] text-primary font-medium">
          {interim ? interim.slice(-42) : t('voice.listening')}
        </span>
      )}
      {error === 'denied' && <span className="text-[11px] text-muted-foreground">{t('voice.denied')}</span>}
      {error === 'failed' && <span className="text-[11px] text-muted-foreground">{t('voice.failed')}</span>}
      {error === 'nospeech' && <span className="text-[11px] text-muted-foreground">{t('voice.nospeech')}</span>}
    </div>
  );
};

interface VoiceTextareaProps {
  label?: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
  /** show the "voice becomes editable text, audio is not stored" line */
  hint?: boolean;
}

/** Textarea with an inline mic. Used wherever typing after training is friction. */
export const VoiceTextarea: React.FC<VoiceTextareaProps> = ({
  label, value, onChange, placeholder, rows = 3, hint = false,
}) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </label>
      )}
      <div className="flex items-start gap-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="rounded-xl resize-none flex-1"
        />
        <VoiceButton value={value} onChange={onChange} />
      </div>
      {hint && <p className="text-[11px] text-muted-foreground leading-snug">{t('voice.hint')}</p>}
    </div>
  );
};
