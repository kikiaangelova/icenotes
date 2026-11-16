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

export const PARENT_RULES = {
  bg: [
    'Тук сме, за да подкрепяме децата си, не за да ги сравняваме.',
    'Не пишем за тялото, теглото или храненето на конкретно дете.',
    'Не споделяме имена, снимки, клубове или лични данни на деца.',
    'Уважаваме треньорите и другите родители, дори когато не сме съгласни.',
    'Всяка публикация минава проверка. Някои чакат одобрение, преди да се покажат.',
  ],
  en: [
    'We are here to support our kids, not to compare them.',
    'We do not write about a specific child\'s body, weight or eating.',
    'No names, photos, clubs or personal details of children.',
    'We respect coaches and other parents, even when we disagree.',
    'Every post is checked. Some wait for approval before they show.',
  ],
};

export const PARENT_TOPICS = {
  competitions: { bg: 'Състезания и пътувания', en: 'Competitions and travel' },
  equipment: { bg: 'Екипировка и кънки', en: 'Equipment and skates' },
  support: { bg: 'Как да подкрепям детето си', en: 'Supporting your child' },
  school: { bg: 'Училище и тренировки', en: 'School and training' },
  free: { bg: 'Свободни разговори', en: 'Open chat' },
} as const;
export type ParentTopic = keyof typeof PARENT_TOPICS;

/** What a linked parent may ever see. AI chats, journal entries and training notes are never listed here. */
export const SHAREABLE = ['share_streak', 'share_elements', 'share_goals'] as const;

/** Minimum age to join the skater community without a confirmed parent (Bulgaria: 14). */
export const MIN_INDEPENDENT_AGE = 14;
export const canJoinSkaterSpace = (role: string, age: number) => role === 'skater' && age >= MIN_INDEPENDENT_AGE;
