import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Voice capture built on the browser SpeechRecognition API.
 *
 * Product rules (Phase B):
 * - user triggered only, never always-on listening
 * - SkateGoals never stores raw audio; only the text the athlete keeps
 * - interim text is shown live but only final text is committed to a field
 * - unsupported browsers / denied permission degrade to typing, never crash
 */

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type RecognitionCtor = new () => SpeechRecognitionLike;

const getCtor = (): RecognitionCtor | null => {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

export type VoiceError = 'unsupported' | 'denied' | 'nospeech' | 'failed' | null;

interface Options {
  /** BCP-47 language for recognition, e.g. en-US / bg-BG */
  lang: string;
  /** called with each finalised chunk of speech */
  onFinalText: (text: string) => void;
}

export const useVoiceCapture = ({ lang, onFinalText }: Options) => {
  const [supported] = useState(() => !!getCtor());
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<VoiceError>(null);

  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef(onFinalText);
  finalRef.current = onFinalText;

  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch { /* already stopped */ }
    setListening(false);
    setInterim('');
  }, []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor) { setError('unsupported'); return; }
    setError(null);
    try { recRef.current?.abort(); } catch { /* no active session */ }

    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let live = '';
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const res = e.results[i];
        const text = res[0]?.transcript ?? '';
        if (res.isFinal) {
          const clean = text.trim();
          if (clean) finalRef.current(clean);
        } else {
          live += text;
        }
      }
      setInterim(live);
    };

    rec.onerror = (e) => {
      const code = e?.error;
      if (code === 'not-allowed' || code === 'service-not-allowed') setError('denied');
      else if (code === 'no-speech') setError('nospeech');
      else if (code === 'aborted') setError(null);
      else setError('failed');
      setListening(false);
      setInterim('');
    };

    rec.onend = () => {
      setListening(false);
      setInterim('');
    };

    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setError('failed');
      setListening(false);
    }
  }, [lang]);

  const toggle = useCallback(() => {
    if (listening) stop(); else start();
  }, [listening, start, stop]);

  useEffect(() => () => { try { recRef.current?.abort(); } catch { /* nothing running */ } }, []);

  return { supported, listening, interim, error, start, stop, toggle };
};
