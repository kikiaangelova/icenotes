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
  'today.core.training': { en: 'Training log', bg: 'Дневник' },
  'today.core.goals':    { en: 'Goals', bg: 'Цели' },
  'today.core.review':   { en: 'Weekly review', bg: 'Седмичен преглед' },
  'today.core.comp':     { en: 'Competition prep', bg: 'Подготовка за старт' },
  'today.support.label': { en: 'AI support', bg: 'AI подкрепа' },
  'today.support.sub':   { en: 'AI Coach · Sport Psychology', bg: 'AI треньор · Спортна психология' },

  // ── The two AI roles ──
  'ai.coach.name':  { en: 'AI Coach', bg: 'AI треньор' },
  'ai.coach.tag':   { en: 'Planning · goals · next step', bg: 'План · цели · следваща стъпка' },
  'ai.coach.desc':  {
    en: 'Turn season goals into this week’s priorities. Review consistency and decide the next useful action.',
    bg: 'Превърни целите за сезона в приоритети за тази седмица. Прегледай постоянството и реши коя е следващата полезна стъпка.',
  },
  'ai.coach.open':  { en: 'Open AI Coach', bg: 'Отвори AI треньора' },
  'ai.coach.greeting': {
    en: 'Tell me where you are right now — the goal you are working toward, or what training looked like this week. I’ll help you find the next useful step.',
    bg: 'Кажи ми къде си в момента — целта, по която работиш, или как мина седмицата на леда. Ще стигнем до следващата полезна стъпка.',
  },
  'ai.coach.placeholder': { en: 'What are you working on?', bg: 'По какво работиш?' },
  'ai.coach.s1': { en: 'Help me set a goal for this week', bg: 'Помогни ми да си поставя цел за тази седмица' },
  'ai.coach.s2': { en: 'My training feels unfocused lately', bg: 'Тренировките ми са разфокусирани напоследък' },
  'ai.coach.s3': { en: 'How do I plan the weeks before my competition?', bg: 'Как да разпределя седмиците преди състезанието?' },
  'ai.coach.s4': { en: 'Review my consistency with me', bg: 'Прегледай с мен колко постоянно тренирам' },

  'ai.psych.name': { en: 'Sport Psychology', bg: 'Спортна психология' },
  'ai.psych.tag':  { en: 'Confidence · nerves · reset', bg: 'Увереност · нерви · рестарт' },
  'ai.psych.desc': {
    en: 'Work through competition nerves, focus, confidence and a reset after a session that went badly.',
    bg: 'Работи върху нервите преди старт, фокуса, увереността и рестарта след тежка тренировка.',
  },
  'ai.psych.open': { en: 'Open Sport Psychology', bg: 'Отвори спортна психология' },
  'ai.psych.greeting': {
    en: 'Say what’s going on — before a competition, after a hard session, or somewhere in between. We’ll take it one question at a time.',
    bg: 'Кажи какво се случва — преди старт, след тежка тренировка или някъде по средата. Ще вървим въпрос по въпрос.',
  },
  'ai.psych.placeholder': { en: 'What’s going on?', bg: 'Какво се случва?' },
  'ai.psych.s1': { en: 'I get nervous before I step on the ice', bg: 'Изнервям се, преди да стъпя на леда' },
  'ai.psych.s2': { en: 'Today’s session went badly and I can’t let it go', bg: 'Днес мина зле и не мога да го оставя' },
  'ai.psych.s3': { en: 'I lose focus in the second half of my program', bg: 'Губя фокус във втората половина на програмата' },
  'ai.psych.s4': { en: 'I want a routine for the minutes before I skate', bg: 'Искам рутина за минутите преди да изляза' },

  'ai.disclaimer': {
    en: 'AI support informed by sport psychology. Not a psychologist, not therapy, not an emergency service. If something serious is going on, talk to an adult you trust.',
    bg: 'AI подкрепа, базирана на спортна психология. Не е психолог, не е терапия и не е спешна помощ. Ако става нещо сериозно, говори с възрастен, на когото имаш доверие.',
  },
  'ai.disclaimer.coach': {
    en: 'AI support for planning and goals. It does not replace your skating coach and does not prescribe training load.',
    bg: 'AI подкрепа за планиране и цели. Не замества треньора ти и не предписва натоварване.',
  },
  'ai.switch': { en: 'Switch role', bg: 'Смени ролята' },
  'ai.tryOne': { en: 'Start with', bg: 'Започни с' },

  // ── Competition prep ──
  'comp.title':    { en: 'Competition prep', bg: 'Подготовка за старт' },
  'comp.subtitle': { en: 'Competition is not training with an audience. Prepare for the difference.', bg: 'Състезанието не е тренировка с публика. Подготви се за разликата.' },
  'comp.open':     { en: 'Start prep', bg: 'Започни подготовка' },
};
