// SkateGoals Phase 1 — copy for the new athlete-first IA and the two AI roles.
// EN and BG are written natively, not translated line-by-line.
export type Phase1Entry = { en: string; bg: string };

export const PHASE1_DICT: Record<string, Phase1Entry> = {
  // ── Bottom navigation (5 destinations) ──
  'nav5.today':    { en: 'Today',    bg: 'Днес' },
  'nav5.training': { en: 'Training', bg: 'Тренировки' },
  'nav5.goals':    { en: 'Goals',    bg: 'Цели' },
  'nav5.mind':     { en: 'Mind',     bg: 'Психика' },
  'nav5.progress': { en: 'Progress', bg: 'Прогрес' },

  // ── Today / performance center ──
  'today.focus.label':   { en: 'Current focus', bg: 'Текущ фокус' },
  'today.focus.empty':   { en: 'No focus set yet', bg: 'Още няма зададен фокус' },
  'today.primary.log':   { en: 'Log training', bg: 'Запиши тренировка' },
  'today.primary.logSub':{ en: 'On-ice or off-ice session', bg: 'Лед или суха тренировка' },
  'today.primary.cont':  { en: 'Finish today', bg: 'Довърши деня' },
  'today.primary.contSub': { en: 'Add your reflection on today’s session', bg: 'Добави рефлексия за днешната тренировка' },
  'today.core.label':    { en: 'Core', bg: 'Основно' },
  'today.core.training': { en: 'Training log', bg: 'Запис на тренировка' },
  'today.core.goals':    { en: 'Goals', bg: 'Цели' },
  'today.core.review':   { en: 'Weekly review', bg: 'Преглед на седмицата' },
  'today.core.comp':     { en: 'Competition prep', bg: 'Подготовка за старт' },
  'today.support.label': { en: 'AI support', bg: 'AI подкрепа' },
  'today.support.sub':   { en: 'AI Coach · Sport Psychology', bg: 'AI Coach · Спортна психология' },

  // ── The two AI roles ──
  'ai.coach.name':  { en: 'AI Coach', bg: 'AI Coach' },
  'ai.coach.tag':   { en: 'Planning · goals · next step', bg: 'План · цели · следваща стъпка' },
  'ai.coach.desc':  {
    en: 'Organize priorities and next actions around the plan you already have with your coach.',
    bg: 'Подреди приоритетите и следващите стъпки около плана, който вече имаш с треньора.',
  },
  'ai.coach.open':  { en: 'Start a conversation', bg: 'Започни разговор' },
  'ai.coach.greeting': {
    en: 'Tell me what you need to organize, and we’ll find one next action.',
    bg: 'Кажи какво искаш да подредиш и ще намерим една следваща стъпка.',
  },
  'ai.coach.placeholder': { en: 'What are you working on?', bg: 'По какво работиш?' },
  'ai.coach.s1': { en: 'Help me define one focus for this week', bg: 'Помогни ми да определя един фокус за тази седмица' },
  'ai.coach.s2': { en: 'My training feels unfocused lately', bg: 'Тренировките ми са разфокусирани напоследък' },
  'ai.coach.s3': { en: 'Help me organize priorities around my coach’s competition plan', bg: 'Помогни ми да подредя приоритетите около плана с треньора преди старта' },
  'ai.coach.s4': { en: 'Review what I followed through on this week', bg: 'Нека прегледаме какво изпълних тази седмица' },

  'ai.psych.name': { en: 'Sport Psychology', bg: 'Спортна психология' },
  'ai.psych.tag':  { en: 'Pressure · confidence · focus', bg: 'Напрежение · увереност · фокус' },
  'ai.psych.desc': {
    en: 'Reflect on pressure, attention, confidence, and resets after difficult sessions.',
    bg: 'Разговор за напрежение, внимание, увереност и рестарт след трудна тренировка.',
  },
  'ai.psych.open': { en: 'Start a conversation', bg: 'Започни разговор' },
  'ai.psych.greeting': {
    en: 'Tell me what is happening, and we’ll take one question at a time.',
    bg: 'Кажи какво се случва и ще вървим въпрос по въпрос.',
  },
  'ai.psych.placeholder': { en: 'What’s going on?', bg: 'Какво се случва?' },
  'ai.psych.s1': { en: 'I feel pressure before I step on the ice', bg: 'Усещам напрежение, преди да стъпя на леда' },
  'ai.psych.s2': { en: 'A difficult session is still on my mind', bg: 'Още мисля за трудната тренировка' },
  'ai.psych.s3': { en: 'I lose focus in the second half of my program', bg: 'Губя фокус във втората половина на програмата' },
  'ai.psych.s4': { en: 'I want a routine for the minutes before I skate', bg: 'Искам рутина за минутите преди да изляза' },

  'ai.disclaimer': {
    en: 'AI informed by sport psychology—not therapy or emergency support. For something serious, talk to a trusted adult.',
    bg: 'AI с насоки от спортната психология — не е терапия или спешна помощ. При сериозен проблем говори с възрастен, на когото имаш доверие.',
  },
  'ai.disclaimer.coach': {
    en: 'AI for planning and goals. It does not replace your skating coach or prescribe training load.',
    bg: 'AI за план и цели. Не замества треньора и не определя натоварването.',
  },
  'ai.switch': { en: 'Switch role', bg: 'Смени ролята' },
  'ai.tryOne': { en: 'You can start with', bg: 'Може да започнеш с' },

  // ── Competition prep ──
  'comp.title':    { en: 'Competition prep', bg: 'Подготовка за старт' },
  'comp.subtitle': { en: 'Competition is not training with an audience. Prepare for the difference.', bg: 'Състезанието не е тренировка с публика. Подготви се за разликата.' },
  'comp.open':     { en: 'Start prep', bg: 'Започни подготовка' },
};
