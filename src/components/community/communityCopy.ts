export const TEMPLATES = {
  landed: { bg: 'Днес приземих...', en: 'Today I landed...' },
  clean_program: { bg: 'Първа чиста програма', en: 'First clean program' },
  record: { bg: 'Нов рекорд на точки', en: 'New points record' },
} as const;
export type TemplateKey = keyof typeof TEMPLATES;

export const PHRASES = {
  bravo: { bg: 'Браво!', en: 'Well done!' },
  me_too: { bg: 'И аз така', en: 'Same here' },
  you_can: { bg: 'Ще успееш', en: 'You will get it' },
  share_how: { bg: 'Сподели как', en: 'Share how' },
} as const;
export type PhraseKey = keyof typeof PHRASES;

export const REACTIONS = ['skate', 'fire', 'clap', 'heart'] as const;
export type ReactionKind = (typeof REACTIONS)[number];
export const REACTION_LABEL: Record<ReactionKind, { bg: string; en: string }> = {
  skate: { bg: 'Кънка', en: 'Skate' }, fire: { bg: 'Огън', en: 'Fire' },
  clap: { bg: 'Ръкопляскане', en: 'Applause' }, heart: { bg: 'Сърце', en: 'Heart' },
};

export const DISCIPLINES = {
  singles: { bg: 'Единично', en: 'Singles' }, pairs: { bg: 'Двойки', en: 'Pairs' },
  dance: { bg: 'Танци на лед', en: 'Ice dance' }, synchro: { bg: 'Синхронно', en: 'Synchro' },
} as const;

export const RULES = {
  bg: [
    'Говорим за спорта, не за телата си.',
    'Подкрепяме, не сравняваме.',
    'Не споделяме лични данни: телефон, адрес, училище, профили в мрежите.',
    'Ако някой не е добре, казваме на възрастен.',
    'Всяка публикация минава проверка. Някои чакат одобрение, преди да се покажат.',
  ],
  en: [
    'We talk about skating, not about our bodies.',
    'We support each other, we do not compare.',
    'No personal details: phone, address, school, social profiles.',
    'If someone is not okay, we tell an adult.',
    'Every post is checked. Some wait for approval before they show.',
  ],
};

/** Minimum age to join the skater community without a confirmed parent (Bulgaria: 14). */
export const MIN_INDEPENDENT_AGE = 14;
export const canJoinSkaterSpace = (role: string, age: number) => role === 'skater' && age >= MIN_INDEPENDENT_AGE;
