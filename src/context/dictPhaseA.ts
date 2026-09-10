// SkateGoals Phase A — the causal athlete loop:
// plan → train → log → reflect → next focus.
// EN and BG are written natively for a figure-skating environment, never literal translations.
export const PHASEA_DICT: Record<string, { en: string; bg: string }> = {
  // ── Bottom navigation ──
  'nav5.support': { en: 'Support', bg: 'Подкрепа' },

  // ── Today ──
  'a.today.working': { en: 'Working on', bg: 'Работиш върху' },
  'a.today.noFocus': { en: 'No focus set yet', bg: 'Още няма зададен фокус' },
  'a.today.setFocus': { en: 'Set your focus', bg: 'Задай фокус' },
  'a.today.next': { en: 'Next up', bg: 'Следва' },
  'a.today.next.log': {
    en: 'Log today’s session when you come off the ice.',
    bg: 'Запиши тренировката, щом слезеш от леда.',
  },
  'a.today.next.reflect': {
    en: 'Two lines of reflection and a focus for next time.',
    bg: 'Два реда рефлексия и фокус за следващия път.',
  },
  'a.today.next.done': {
    en: 'Session and reflection are in. Next focus is set.',
    bg: 'Тренировката и рефлексията са записани. Фокусът за следващия път е зададен.',
  },
  'a.today.cta.log': { en: 'Log training', bg: 'Запиши тренировка' },
  'a.today.cta.logSub': { en: 'On ice or dry land · about a minute', bg: 'Лед или суха подготовка · около минута' },
  'a.today.cta.reflect': { en: 'Reflect on today', bg: 'Рефлексия за днес' },
  'a.today.cta.reflectSub': { en: 'Then choose the focus for next training', bg: 'После избери фокуса за следващата тренировка' },
  'a.today.cta.done': { en: 'Add another session', bg: 'Добави още една тренировка' },
  'a.today.cta.doneSub': { en: 'Second session of the day', bg: 'Втора тренировка за деня' },
  'a.today.sessionsToday': { en: 'Logged today', bg: 'Записано днес' },
  'a.today.prep': { en: 'Mental prep before you skate', bg: 'Нагласа преди леда' },
  'a.today.prepSub': { en: 'Optional. Two minutes to settle.', bg: 'По желание. Две минути, за да се настроиш.' },
  'a.today.comp': { en: 'Competition prep', bg: 'Подготовка за старт' },
  'a.today.compSub': { en: 'Routine and focus for the start', bg: 'Рутина и фокус за старта' },

  // ── Training screen ──
  'a.tr.title': { en: 'Training', bg: 'Тренировки' },
  'a.tr.sub': {
    en: 'Log the session, then set the focus for next time.',
    bg: 'Запиши тренировката, после задай фокуса за следващия път.',
  },
  'a.tr.type': { en: 'Type of session', bg: 'Вид тренировка' },
  'a.tr.onIce': { en: 'On ice', bg: 'На лед' },
  'a.tr.offIce': { en: 'Dry land', bg: 'Суха подготовка' },
  'a.tr.what': { en: 'What you worked on', bg: 'Върху какво работи' },
  'a.tr.whatHint': { en: 'Tap what applies', bg: 'Маркирай каквото важи' },
  'a.tr.duration': { en: 'Duration', bg: 'Времетраене' },
  'a.tr.min': { en: 'min', bg: 'мин' },
  'a.tr.how': { en: 'How did it go?', bg: 'Как мина?' },
  'a.tr.feel.great': { en: 'Strong', bg: 'Силно' },
  'a.tr.feel.good': { en: 'Solid', bg: 'Добре' },
  'a.tr.feel.okay': { en: 'Average', bg: 'Средно' },
  'a.tr.feel.tough': { en: 'Hard', bg: 'Трудно' },
  'a.tr.note': { en: 'Note', bg: 'Бележка' },
  'a.tr.notePh': { en: 'Element, correction from the coach, anything to remember', bg: 'Елемент, корекция от треньора, каквото да запомниш' },
  'a.tr.save': { en: 'Save session', bg: 'Запиши тренировката' },
  'a.tr.saving': { en: 'Saving…', bg: 'Записва се…' },
  'a.tr.saveHint': { en: 'After saving you get three short reflection questions.', bg: 'След записа идват три кратки въпроса за рефлексия.' },
  'a.tr.needType': { en: 'Pick what you worked on to save.', bg: 'Маркирай върху какво работи, за да запишеш.' },
  'a.tr.history': { en: 'Recent sessions', bg: 'Последни тренировки' },
  'a.tr.historyEmpty': { en: 'Nothing logged yet. Your first session appears here.', bg: 'Още няма записи. Първата ти тренировка ще се появи тук.' },
  'a.tr.prepOpen': { en: 'Mental prep first', bg: 'Първо нагласа' },

  // ── On-ice / off-ice element labels (stored value stays canonical) ──
  'a.el.Edge work & stroking': { en: 'Edges & stroking', bg: 'Ръбове и ход' },
  'a.el.Spins practice': { en: 'Spins', bg: 'Пируети' },
  'a.el.Jump technique': { en: 'Jumps', bg: 'Скокове' },
  'a.el.Program run-through': { en: 'Program run-through', bg: 'Прокарване на програма' },
  'a.el.Footwork sequences': { en: 'Step sequences', bg: 'Стъпкови серии' },
  'a.el.Choreography': { en: 'Choreography', bg: 'Хореография' },
  'a.el.Warm-up & stretching': { en: 'Warm-up & stretching', bg: 'Загрявка и разтягане' },
  'a.el.Core strengthening': { en: 'Core', bg: 'Коремна преса и стабилност' },
  'a.el.Jump simulation': { en: 'Jump simulation', bg: 'Имитации на скокове' },
  'a.el.Ballet & dance': { en: 'Ballet & dance', bg: 'Балет и танц' },
  'a.el.Cardio conditioning': { en: 'Conditioning', bg: 'Кондиция' },
  'a.el.Flexibility training': { en: 'Flexibility', bg: 'Гъвкавост' },

  // ── Reflection sheet ──
  'a.rf.title': { en: 'Two minutes on today', bg: 'Две минути за днес' },
  'a.rf.sub': {
    en: 'Session saved. What you write here becomes the focus you see on Today.',
    bg: 'Тренировката е записана. Това, което напишеш тук, става фокусът, който виждаш в „Днес“.',
  },
  'a.rf.worked': { en: 'What worked', bg: 'Какво се получи' },
  'a.rf.workedPh': { en: 'e.g. entries into the flip were stable', bg: 'напр. влизанията във флипа бяха стабилни' },
  'a.rf.hard': { en: 'What was difficult', bg: 'Какво беше трудно' },
  'a.rf.hardPh': { en: 'e.g. lost the axel after the run-through', bg: 'напр. загубих аксела след прокарването' },
  'a.rf.focus': { en: 'Focus for next training', bg: 'Фокус за следващата тренировка' },
  'a.rf.focusPh': { en: 'One thing you will work on', bg: 'Едно нещо, върху което ще работиш' },
  'a.rf.save': { en: 'Save and set focus', bg: 'Запиши и задай фокуса' },
  'a.rf.saving': { en: 'Saving…', bg: 'Записва се…' },
  'a.rf.skip': { en: 'Skip for now', bg: 'Пропусни засега' },
  'a.rf.saved': { en: 'Focus saved. You will see it on Today.', bg: 'Фокусът е записан. Ще го виждаш в „Днес“.' },

  // ── Support screen ──
  'a.sp.title': { en: 'Support', bg: 'Подкрепа' },
  'a.sp.sub': {
    en: 'Two different kinds of help. Pick the one that matches the problem.',
    bg: 'Два различни вида помощ. Избери този, който отговаря на въпроса ти.',
  },
  'a.sp.startersCoach': { en: 'Start with', bg: 'Започни с' },
  'a.sp.coach.s1': { en: 'Plan my training week', bg: 'Планирай ми тренировъчната седмица' },
  'a.sp.coach.s2': { en: 'Help me choose a focus between sessions', bg: 'Помогни ми да избера фокус между тренировките' },
  'a.sp.coach.s3': { en: 'Turn my season goal into this week', bg: 'Превърни целта за сезона в план за тази седмица' },
  'a.sp.psych.s1': { en: 'Nervous before the start', bg: 'Притеснявам се преди старта' },
  'a.sp.psych.s2': { en: 'Bad session, need to reset', bg: 'Лоша тренировка, трябва да се презаредя' },
  'a.sp.psych.s3': { en: 'I lose focus in the program', bg: 'Губя фокус в програмата' },
  'a.sp.tools': { en: 'Without AI', bg: 'Без AI' },
  'a.sp.psychTools': { en: 'Sport psychology exercises', bg: 'Упражнения по спортна психология' },
  'a.sp.psychToolsSub': { en: 'Short, practical, no chat', bg: 'Кратки, практични, без чат' },

  // ── Section labels for reused surfaces ──
  'a.goals.title': { en: 'Goals', bg: 'Цели' },
  'a.goals.sub': { en: 'Season goal, this week, next action.', bg: 'Цел за сезона, тази седмица, следваща стъпка.' },
  'a.prog.title': { en: 'Progress', bg: 'Прогрес' },
  'a.prog.sub': { en: 'What your logs and reflections show over time.', bg: 'Какво показват записите и рефлексиите ти във времето.' },
  'a.more.label': { en: 'Library', bg: 'Библиотека' },
  'a.more.hint': { en: 'Timer, jumps, calendar, quotes', bg: 'Таймер, скокове, календар, цитати' },
};
