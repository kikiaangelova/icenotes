// SkateGoals Phase A — the causal athlete loop:
// plan → train → log → reflect → next focus.
// EN and BG are written natively for a figure-skating environment, never literal translations.
export const PHASEA_DICT: Record<string, { en: string; bg: string }> = {
  // ── Bottom navigation ──
  'nav5.support': { en: 'Support', bg: 'Подкрепа' },

  // ── Today ──
  'a.today.working': { en: 'Current focus', bg: 'Фокус в момента' },
  'a.today.noFocus': { en: 'No focus set yet', bg: 'Още няма зададен фокус' },
  'a.today.setFocus': { en: 'Set your focus', bg: 'Задай фокус' },
  'a.today.next': { en: 'Next up', bg: 'Следва' },
  'a.today.next.log': {
    en: 'After training, log the session while the details are clear.',
    bg: 'След тренировка запиши най-важното, докато още го помниш.',
  },
  'a.today.next.reflect': {
    en: 'Note what worked, what was difficult, and the next focus.',
    bg: 'Какво се получи? Какво беше трудно? Какъв е следващият фокус?',
  },
  'a.today.next.done': {
    en: 'Session and reflection are in. Next focus is set.',
    bg: 'Готово. Фокусът за следващата тренировка е зададен.',
  },
  'a.today.cta.log': { en: 'Log training', bg: 'Запиши тренировка' },
  'a.today.cta.logSub': { en: 'On ice or off ice · about one minute', bg: 'На лед или суха тренировка · около минута' },
  'a.today.cta.reflect': { en: 'How did training go?', bg: 'Как мина тренировката?' },
  'a.today.cta.reflectSub': { en: 'Note what worked and what comes next.', bg: 'Запиши какво се получи и какво следва.' },
  'a.today.cta.done': { en: 'Add another session', bg: 'Добави още една тренировка' },
  'a.today.cta.doneSub': { en: 'Log another session if you trained again', bg: 'Запиши още една тренировка днес' },
  'a.today.sessionsToday': { en: 'Training today', bg: 'Тренировки днес' },
  'a.today.prep': { en: 'Pre-training focus', bg: 'Фокус преди тренировка' },
  'a.today.prepSub': { en: 'Optional. Two minutes to settle.', bg: 'По желание. Две минути, за да се настроиш.' },
  'a.today.comp': { en: 'Competition prep', bg: 'Подготовка за старт' },
  'a.today.compSub': { en: 'Routine and focus for the start', bg: 'Рутина и фокус за старта' },

  // ── Training screen ──
  'a.tr.title': { en: 'Training', bg: 'Тренировки' },
  'a.tr.sub': {
    en: 'Record the session while the details are still clear.',
    bg: 'Запиши тренировката, докато още помниш детайлите.',
  },
  'a.tr.type': { en: 'Type of session', bg: 'Вид тренировка' },
  'a.tr.onIce': { en: 'On ice', bg: 'На лед' },
  'a.tr.offIce': { en: 'Off ice', bg: 'Суха тренировка' },
  'a.tr.what': { en: 'What did you train today?', bg: 'Какво тренира днес?' },
  'a.tr.whatHint': { en: 'Tap what applies', bg: 'Маркирай каквото важи' },
  'a.tr.duration': { en: 'Duration', bg: 'Времетраене' },
  'a.tr.min': { en: 'min', bg: 'мин' },
  'a.tr.how': { en: 'How did it go?', bg: 'Как мина?' },
  'a.tr.feel.great': { en: 'Strong', bg: 'Стабилно' },
  'a.tr.feel.good': { en: 'Solid', bg: 'Добре' },
  'a.tr.feel.okay': { en: 'Average', bg: 'Средно' },
  'a.tr.feel.tough': { en: 'Hard', bg: 'Трудно' },
  'a.tr.note': { en: 'Note', bg: 'Бележка' },
  'a.tr.notePh': { en: 'Coach feedback, a useful detail, or something to revisit', bg: 'Насока от треньора, важен детайл или нещо за следващия път' },
  'a.tr.save': { en: 'Save session', bg: 'Запиши тренировката' },
  'a.tr.saving': { en: 'Saving…', bg: 'Записва се…' },
  'a.tr.saveHint': { en: 'After saving, you can note how it went.', bg: 'След това можеш да запишеш как мина.' },
  'a.tr.needType': { en: 'Choose at least one area before saving.', bg: 'Избери поне една област преди записа.' },
  'a.tr.history': { en: 'Recent sessions', bg: 'Последни тренировки' },
  'a.tr.historyEmpty': { en: 'Nothing logged yet. Your first session appears here.', bg: 'Още няма записи. Първата ти тренировка ще се появи тук.' },
  'a.tr.prepOpen': { en: 'Set a focus first', bg: 'Първо задай фокус' },

  // ── On-ice / off-ice element labels (stored value stays canonical) ──
  'a.el.Edge work & stroking': { en: 'Edges & stroking', bg: 'Ръбове и пързаляне' },
  'a.el.Spins practice': { en: 'Spins', bg: 'Пируети' },
  'a.el.Jump technique': { en: 'Jumps', bg: 'Скокове' },
  'a.el.Program run-through': { en: 'Program run-through', bg: 'Програма' },
  'a.el.Footwork sequences': { en: 'Step sequences', bg: 'Стъпкови серии' },
  'a.el.Choreography': { en: 'Choreography', bg: 'Хореография' },
  'a.el.Warm-up & stretching': { en: 'Warm-up & stretching', bg: 'Загрявка и разтягане' },
  'a.el.Core strengthening': { en: 'Core', bg: 'Коремна преса и стабилност' },
  'a.el.Jump simulation': { en: 'Jump simulation', bg: 'Имитации на скокове' },
  'a.el.Ballet & dance': { en: 'Ballet & dance', bg: 'Балет и танц' },
  'a.el.Cardio conditioning': { en: 'Conditioning', bg: 'Кондиция' },
  'a.el.Flexibility training': { en: 'Flexibility', bg: 'Гъвкавост' },

  // ── Reflection sheet ──
  'a.rf.title': { en: 'After training', bg: 'След тренировката' },
  'a.rf.sub': {
    en: 'The session is saved. Set one clear focus for the next training.',
    bg: 'Запиши най-важното и избери един фокус за следващия път.',
  },
  'a.rf.worked': { en: 'What worked', bg: 'Какво се получи' },
  'a.rf.workedPh': { en: 'A useful detail from today', bg: 'Важен детайл от днес' },
  'a.rf.hard': { en: 'What was difficult', bg: 'Какво беше трудно' },
  'a.rf.hardPh': { en: 'What got in the way', bg: 'Какво попречи' },
  'a.rf.focus': { en: 'Focus for next training', bg: 'Фокус за следващата тренировка' },
  'a.rf.focusPh': { en: 'One thing you will work on', bg: 'Едно нещо, върху което ще работиш' },
  'a.rf.save': { en: 'Save focus', bg: 'Запази фокуса' },
  'a.rf.saving': { en: 'Saving…', bg: 'Записва се…' },
  'a.rf.skip': { en: 'Skip for now', bg: 'Пропусни засега' },
  'a.rf.saved': { en: 'Focus saved. You will see it on Today.', bg: 'Фокусът е записан. Ще го виждаш в „Днес“.' },

  // ── Support screen ──
  'a.sp.title': { en: 'Support', bg: 'Подкрепа' },
  'a.sp.sub': {
    en: 'Choose planning support or sport-psychology reflection.',
    bg: 'От какво имаш нужда сега?',
  },
  'a.sp.startersCoach': { en: 'You can start with', bg: 'Може да започнеш с' },
  'a.sp.coach.s1': { en: 'Help me prioritize this week around my coach’s plan', bg: 'Помогни ми да подредя седмицата според плана с треньора' },
  'a.sp.coach.s2': { en: 'Help me choose one focus between sessions', bg: 'Помогни ми да избера един фокус между тренировките' },
  'a.sp.coach.s3': { en: 'Connect my season goal to one action this week', bg: 'Свържи целта ми за сезона с една стъпка тази седмица' },
  'a.sp.psych.s1': { en: 'Nervous before the start', bg: 'Притеснявам се преди старта' },
  'a.sp.psych.s2': { en: 'A hard session is still on my mind', bg: 'Още мисля за трудната тренировка' },
  'a.sp.psych.s3': { en: 'I lose focus in the program', bg: 'Губя фокус в програмата' },
  'a.sp.tools': { en: 'Without AI', bg: 'Без AI' },
  'a.sp.psychTools': { en: 'Sport psychology exercises', bg: 'Упражнения по спортна психология' },
  'a.sp.psychToolsSub': { en: 'Short, practical, no chat', bg: 'Кратки, практични, без чат' },

  // ── Section labels for reused surfaces ──
  'a.goals.title': { en: 'Goals', bg: 'Цели' },
  'a.goals.sub': { en: 'Season goal → this week → next action.', bg: 'Цел за сезона → фокус за седмицата → следваща стъпка.' },
  'a.prog.title': { en: 'Progress', bg: 'Прогрес' },
  'a.prog.sub': { en: 'What your training and reviews show over time.', bg: 'Какво показват тренировките и прегледите ти във времето.' },
  'a.more.label': { en: 'Tools', bg: 'Инструменти' },
  'a.more.hint': { en: 'Timer, jumps, calendar', bg: 'Таймер, скокове и календар' },
};
