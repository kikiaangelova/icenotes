// SkateGoals Phase 2 — onboarding, public positioning and AI support copy.
// EN and BG written natively side by side, never literal translations.
export const PHASE2_DICT: Record<string, { en: string; bg: string }> = {
  // ── AI session errors ──
  'ai.err.signin': {
    en: 'Sign in to use AI support.',
    bg: 'Влез в профила си, за да ползваш AI подкрепата.',
  },
  'ai.err.session': {
    en: 'Your session expired. Sign in again and continue.',
    bg: 'Сесията ти изтече. Влез пак и продължи.',
  },

  // ── Onboarding ──
  'ob.step': { en: 'Step', bg: 'Стъпка' },
  'ob.of': { en: 'of', bg: 'от' },
  'ob.skip': { en: 'Skip', bg: 'Пропусни' },
  'ob.back': { en: 'Back', bg: 'Назад' },
  'ob.next': { en: 'Continue', bg: 'Продължи' },
  'ob.finish': { en: 'Start using SkateGoals', bg: 'Започни със SkateGoals' },
  'ob.saving': { en: 'Saving…', bg: 'Записва се…' },
  'ob.optional': { en: 'Optional', bg: 'По желание' },

  'ob.s1.title': { en: 'Start with the basics', bg: 'Да започнем с основното' },
  'ob.s1.sub': {
    en: 'These details help SkateGoals show relevant prompts. Your entries are private by default.',
    bg: 'Тези данни помагат на SkateGoals да показва подходящи въпроси. Записките са лични по подразбиране.',
  },
  'ob.s1.name': { en: 'What should we call you?', bg: 'Как да се обръщаме към теб?' },
  'ob.s1.namePh': { en: 'Your name', bg: 'Твоето име' },
  'ob.s1.age': { en: 'Age', bg: 'Възраст' },

  'ob.s2.title': { en: 'Your skating', bg: 'За твоето пързаляне' },
  'ob.s2.sub': {
    en: 'Tell us where you compete and how long you have trained.',
    bg: 'Кажи в коя категория се състезаваш и от колко време тренираш.',
  },
  'ob.s2.category': { en: 'Category', bg: 'Категория' },
  'ob.s2.categoryHint': {
    en: 'Pick the closest one. Systems differ between countries.',
    bg: 'Избери най-близкото. Системите се различават по държави.',
  },
  'ob.cat.advancedNovice': { en: 'Advanced Novice', bg: 'Advanced Novice' },
  'ob.cat.junior': { en: 'Junior', bg: 'Junior' },
  'ob.cat.senior': { en: 'Senior', bg: 'Senior' },
  'ob.cat.other': { en: 'Other', bg: 'Друго' },
  'ob.s2.years': { en: 'How many years have you trained?', bg: 'От колко години тренираш?' },

  'ob.s3.title': { en: 'This season', bg: 'Този сезон' },
  'ob.s3.sub': {
    en: 'The AI Coach uses this context to connect weekly priorities to your existing training plan.',
    bg: 'AI Coach използва този контекст, за да свърже седмичните приоритети с плана ти за подготовка.',
  },
  'ob.s3.focus': { en: 'What matters most right now?', bg: 'Какво е най-важно за теб сега?' },
  'ob.s3.focusPh': {
    en: 'e.g. clean short program, consistent double axel, first Junior season',
    bg: 'напр. чиста кратка програма, стабилен двоен аксел, първи сезон при юношите',
  },
  'ob.s3.elements': { en: 'Elements you are working on', bg: 'Елементи, по които работиш' },
  'ob.s3.elementsPh': {
    en: 'e.g. 2A, 3S, layback, step sequence',
    bg: 'напр. 2A, 3S, лайбек, стъпкова серия',
  },
  'ob.s3.challenge': { en: 'Biggest challenge right now', bg: 'Най-голямото предизвикателство сега' },
  'ob.s3.challengePh': {
    en: 'e.g. inconsistency under pressure, losing focus mid-program',
    bg: 'напр. непостоянство под напрежение, загуба на фокус по средата на програмата',
  },
  'ob.s3.comp': { en: 'Next competition', bg: 'Следващо състезание' },
  'ob.s3.compPh': { en: 'Name of the event', bg: 'Име на състезанието' },
  'ob.s3.compDate': { en: 'Date', bg: 'Дата' },

  'ob.s4.title': { en: 'What do you want help with?', bg: 'С какво искаш помощ?' },
  'ob.s4.sub': {
    en: 'Choose as many as you want. You can change this later.',
    bg: 'Избери колкото искаш. Може да се промени по всяко време.',
  },
  'ob.area.confidence': { en: 'Confidence', bg: 'Увереност' },
  'ob.area.consistency': { en: 'Consistency', bg: 'Постоянство' },
  'ob.area.focus': { en: 'Focus', bg: 'Фокус' },
  'ob.area.nerves': { en: 'Competition nerves', bg: 'Нерви на състезание' },
  'ob.area.goals': { en: 'Goals and planning', bg: 'Цели и планиране' },
  'ob.area.motivation': { en: 'Motivation', bg: 'Мотивация' },
  'ob.area.reset': { en: 'Reset after a difficult session', bg: 'Рестарт след трудна тренировка' },
  'ob.s4.style': { en: 'How should the AI respond?', bg: 'Как искаш да ти отговаря AI?' },
  'ob.style.direct': { en: 'Direct', bg: 'Директно' },
  'ob.style.directSub': { en: 'Say it straight', bg: 'Право в целта' },
  'ob.style.calm': { en: 'Calm', bg: 'Спокойно' },
  'ob.style.calmSub': { en: 'Slower, gentler', bg: 'По-бавно и по-меко' },
  'ob.style.structured': { en: 'Structured', bg: 'Структурирано' },
  'ob.style.structuredSub': { en: 'Steps and order', bg: 'Стъпки и подредба' },
  'ob.s4.note': { en: 'What would make SkateGoals genuinely useful for you?', bg: 'Какво би направило SkateGoals наистина полезно за теб?' },
  'ob.s4.notePh': { en: 'Write it in your own words', bg: 'Напиши го със свои думи' },

  'ob.done.title': { en: 'Profile saved', bg: 'Профилът е записан' },
  'ob.done.desc': { en: 'Start with today’s session or set your first goal.', bg: 'Започни с днешната тренировка или си постави първа цел.' },
  'ob.err.title': { en: 'Didn’t save', bg: 'Не се записа' },
  'ob.err.desc': { en: 'Check your connection and try again.', bg: 'Провери връзката и опитай пак.' },

  // ── Landing page ──
  'lp.chip': { en: 'For competitive figure skaters', bg: 'За състезаващи се фигуристи' },
  'lp.h1.a': { en: 'Your training doesn’t end', bg: 'Тренировката ти не свършва,' },
  'lp.h1.b': { en: 'when you leave the ice.', bg: 'когато слезеш от леда.' },
  'lp.sub': {
    en: 'SkateGoals connects what happens on the ice with what you do next: goals, reflection, competition prep, confidence and progress — in one place that belongs to you.',
    bg: 'SkateGoals свързва случилото се на леда с това, което идва след него: цели, рефлексия, подготовка за старт, увереност и прогрес — на едно място, което е твое.',
  },
  'lp.cta': { en: 'Create your account', bg: 'Създай профил' },
  'lp.cta2': { en: 'See what’s inside', bg: 'Виж какво има вътре' },
  'lp.trust': { en: 'Built for skaters aged 14–18 moving into serious competition.', bg: 'За фигуристи на 14–18, които влизат в сериозния спорт.' },

  'lp.connect.kicker': { en: 'What SkateGoals connects', bg: 'Какво свързва SkateGoals' },
  'lp.connect.title': { en: 'Five parts of your skating, in one system.', bg: 'Пет части от твоето фигурно — в една система.' },
  'lp.connect.training': { en: 'Training', bg: 'Тренировки' },
  'lp.connect.trainingText': { en: 'Log sessions and elements while the details are still fresh.', bg: 'Записваш тренировки и елементи, докато детайлите са пресни.' },
  'lp.connect.goals': { en: 'Goals', bg: 'Цели' },
  'lp.connect.goalsText': { en: 'Season targets broken into this week and today.', bg: 'Целите за сезона, разбити на тази седмица и днес.' },
  'lp.connect.mind': { en: 'Mind', bg: 'Психика' },
  'lp.connect.mindText': { en: 'Confidence, focus and nerves treated as trainable, not as luck.', bg: 'Увереност, фокус и нерви — трениращи се, не въпрос на късмет.' },
  'lp.connect.comp': { en: 'Competition', bg: 'Състезание' },
  'lp.connect.compText': { en: 'Prepare for the parts that only happen on competition day.', bg: 'Подготовка за нещата, които се случват само в деня на старта.' },
  'lp.connect.progress': { en: 'Progress', bg: 'Прогрес' },
  'lp.connect.progressText': { en: 'Weekly review, so a season is more than a feeling.', bg: 'Седмичен преглед, за да не е сезонът само усещане.' },

  'lp.ai.kicker': { en: 'Two AI roles', bg: 'Две AI роли' },
  'lp.ai.title': { en: 'Different questions need different support.', bg: 'Различните въпроси искат различна подкрепа.' },
  'lp.ai.coachDoes': { en: 'What it does', bg: 'Какво прави' },
  'lp.ai.coachList': {
    en: 'Turns your season goal into weekly priorities · reviews consistency · asks what your coach is emphasising · plans the weeks before a competition',
    bg: 'Превръща целта за сезона в седмични приоритети · преглежда постоянството · пита какво набляга треньорът ти · планира седмиците преди старт',
  },
  'lp.ai.coachNot': {
    en: 'It does not correct technique or prescribe training load. Your coach does that.',
    bg: 'Не поправя техника и не предписва натоварване. Това е работа на треньора ти.',
  },
  'lp.ai.psychList': {
    en: 'Nerves before you skate · focus through a program · confidence after a fall · reset after a hard session · a routine for competition day',
    bg: 'Нерви преди изява · фокус през програмата · увереност след падане · рестарт след тежка тренировка · рутина за деня на старта',
  },
  'lp.ai.psychNot': {
    en: 'Sport-psychology-informed AI support. Not a psychologist, not therapy, not an emergency service.',
    bg: 'AI подкрепа, базирана на спортна психология. Не е психолог, не е терапия и не е спешна помощ.',
  },
  'lp.ai.more': { en: 'How the AI support works', bg: 'Как работи AI подкрепата' },

  'lp.loop.kicker': { en: 'The loop', bg: 'Цикълът' },
  'lp.loop.title': { en: 'Train → Track → Reflect → Goal → Prepare → Reset', bg: 'Тренирай → Записвай → Осмисли → Цел → Подготви се → Рестарт' },
  'lp.loop.sub': {
    en: 'Each step feeds the next one. That is the whole product.',
    bg: 'Всяка стъпка захранва следващата. Това е целият продукт.',
  },

  'lp.priv.kicker': { en: 'Your space', bg: 'Твоето пространство' },
  'lp.priv.title': { en: 'Written for you, not for an audience.', bg: 'Пишеш за себе си, не за публика.' },
  'lp.priv.text': {
    en: 'Your entries are private by default. No feed, no scores, no ranking, no coach or parent dashboard. You decide what you take out of the app and tell someone.',
    bg: 'Записките ти са лични по подразбиране. Няма фийд, оценки, класация, табло за треньор или родител. Ти решаваш какво да извадиш навън и на кого да го кажеш.',
  },
  'lp.final.title': { en: 'Set up your season in a few minutes.', bg: 'Настрой сезона си за няколко минути.' },
  'lp.final.sub': { en: 'SkateGoals is being prepared for pilot testing with competitive skaters. Feedback will shape what comes next.', bg: 'SkateGoals се подготвя за пилотно тестване със състезаващи се фигуристи. Обратната връзка ще определя какво следва.' },
  'lp.final.back': { en: 'I already have an account', bg: 'Вече имам профил' },

  // ── AI support page ──
  'aisup.title': { en: 'AI support in SkateGoals', bg: 'AI подкрепата в SkateGoals' },
  'aisup.sub': {
    en: 'Two roles, two separate conversations. One helps you plan; the other helps you handle the pressure.',
    bg: 'Две роли, два отделни разговора. Едната помага да планираш, другата — да се справиш с напрежението.',
  },
  'aisup.does': { en: 'Helps with', bg: 'Помага с' },
  'aisup.doesnt': { en: 'Does not do', bg: 'Не прави' },
  'aisup.coach.does': {
    en: 'Weekly priorities from a season goal|Reviewing consistency honestly|Deciding the next useful step|Planning the weeks before a competition',
    bg: 'Седмични приоритети от целта за сезона|Честен преглед на постоянството|Решение коя е следващата стъпка|Планиране на седмиците преди старт',
  },
  'aisup.coach.doesnt': {
    en: 'Technique corrections|Training load, jump counts or off-ice programmes|Anything about weight, food or supplements|Replacing your coach',
    bg: 'Поправки по техниката|Натоварване, брой скокове или сухи тренировки|Каквото и да е за тегло, храна или добавки|Да замести треньора ти',
  },
  'aisup.psych.does': {
    en: 'Nerves and pressure before skating|Focus and attention through a program|Confidence after mistakes and falls|Reset after a hard session|Routines for competition day',
    bg: 'Нерви и напрежение преди изява|Фокус и внимание през програмата|Увереност след грешки и падания|Рестарт след тежка тренировка|Рутини за деня на старта',
  },
  'aisup.psych.doesnt': {
    en: 'Therapy or counselling|Diagnosis or clinical labels|Emergency or crisis support|Claiming to be a psychologist',
    bg: 'Терапия или консултиране|Диагнози или клинични етикети|Спешна или кризисна помощ|Да твърди, че е психолог',
  },
  'aisup.limits.title': { en: 'What you should know', bg: 'Какво е добре да знаеш' },
  'aisup.limits.text': {
    en: 'AI can be wrong and does not know your body, rink or coach. Chat history may not remain available. Save important next steps in Goals. For pain, injury, food or weight concerns, or feeling hopeless, tell a trusted adult and seek qualified help.',
    bg: 'AI може да греши и не познава тялото ти, пързалката или треньора ти. Историята на чата може да не остане достъпна. Запази важните стъпки в „Цели“. При болка, контузия, тревоги около хранене или тегло, или чувство на безнадеждност, кажи на възрастен, на когото имаш доверие, и потърси квалифицирана помощ.',
  },
  'aisup.cta': { en: 'Create your account', bg: 'Създай профил' },
};
