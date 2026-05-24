// Lightweight heuristic detector for emotionally heavy journal entries.
// Returns whether the entry warrants a decompression flow + which themes
// were detected (used to tailor microcopy).

export type DifficultTheme =
  | 'frustration'
  | 'fear'
  | 'burnout'
  | 'injury'
  | 'self_doubt'
  | 'bad_practice'
  | 'overwhelm';

const PATTERNS: Record<DifficultTheme, RegExp> = {
  frustration: /\b(frustrat|angry|mad|pissed|annoyed|hate|раздраз|ядос|бесн)/i,
  fear:        /\b(scared|afraid|fear|anxious|anxiety|panic|nervous|terrified|страх|стра|тревож|паник)/i,
  burnout:     /\b(burn ?out|exhaust|drained|tired of|done with|нямам сили|изтощ|прегор)/i,
  injury:      /\b(injur|hurt|pain|sore|aching|sprain|broke|травм|болка|боли|нараня)/i,
  self_doubt:  /\b(can'?t do|i suck|not good enough|worthless|stupid|hopeless|hate myself|никога няма|не мога|безполезен|глуп)/i,
  bad_practice:/\b(bad (practice|session|day)|terrible|awful|disaster|fell apart|nothing worked|ужас|кошмар|нищо не|лошо)/i,
  overwhelm:   /\b(overwhelm|too much|can'?t handle|breaking down|crying|cried|претовар|непосилн|плак)/i,
};

export interface EmotionalSignal {
  emotionalState?: number;   // 1-10 (low = harder day)
  confidenceLevel?: number;  // 1-10
  intensity?: number;        // 1-10 (CBT emotion intensity, high = harder)
  feeling?: string;          // e.g. 'heavy', 'challenging'
}

export interface DetectionResult {
  isDifficult: boolean;
  themes: DifficultTheme[];
  /** 'soft' = mild heavy day, 'heavy' = clear distress */
  level: 'none' | 'soft' | 'heavy';
}

export function detectDifficulty(
  text: string,
  signal: EmotionalSignal = {}
): DetectionResult {
  const themes: DifficultTheme[] = [];
  const t = (text || '').toLowerCase();
  for (const [k, re] of Object.entries(PATTERNS)) {
    if (re.test(t)) themes.push(k as DifficultTheme);
  }

  const heavyFeeling = signal.feeling === 'heavy' || signal.feeling === 'challenging';
  const lowMood =
    (typeof signal.emotionalState === 'number' && signal.emotionalState <= 4) ||
    (typeof signal.confidenceLevel === 'number' && signal.confidenceLevel <= 3) ||
    (typeof signal.intensity === 'number' && signal.intensity >= 7);

  const heavyHit = themes.some((th) =>
    ['fear', 'injury', 'burnout', 'overwhelm', 'self_doubt'].includes(th)
  );

  if (heavyHit || (lowMood && themes.length > 0)) {
    return { isDifficult: true, themes, level: 'heavy' };
  }
  if (themes.length > 0 || heavyFeeling || lowMood) {
    return { isDifficult: true, themes, level: 'soft' };
  }
  return { isDifficult: false, themes: [], level: 'none' };
}
