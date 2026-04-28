import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Language = 'en' | 'bg';

export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'bg', label: 'Bulgarian', nativeLabel: 'Български' },
];

// Each entry has both EN and BG. EN is the source-of-truth fallback.
type Entry = { en: string; bg: string };
type Dict = Record<string, Entry>;

const dict: Dict = {
  // ───── Navbar (marketing) ─────
  'nav.home': { en: 'Home', bg: 'Начало' },
  'nav.about': { en: 'About', bg: 'За нас' },
  'nav.features': { en: 'Features', bg: 'Функции' },
  'nav.howItWorks': { en: 'How It Works', bg: 'Как работи' },
  'nav.psychology': { en: 'Psychology', bg: 'Спортна психология' },
  'nav.coach': { en: 'Coach', bg: 'Треньор' },
  'nav.contact': { en: 'Contact', bg: 'Контакт' },
  'nav.login': { en: 'Log In', bg: 'Вход' },
  'nav.getStarted': { en: 'Get Started', bg: 'Започни' },

  // ───── Hero (landing) ─────
  'hero.badge': { en: 'Made for figure skaters, by a figure skater', bg: 'Създадено за фигуристи, от фигуристка' },
  'hero.title.line1': { en: 'Your skating journey', bg: 'Твоят път в пързалянето' },
  'hero.title.line2.prefix': { en: 'deserves to be', bg: 'заслужава да бъде' },
  'hero.title.highlight': { en: 'remembered', bg: 'запомнен' },
  'hero.subtitle': {
    en: 'A cozy space to reflect, track your progress, and grow as an athlete — one session at a time.',
    bg: 'Уютно място за рефлексия, проследяване на прогреса и растеж като спортист — една тренировка наведнъж.',
  },
  'hero.attribution': { en: 'Created by a young figure skater and her mom 💙', bg: 'Създадено от млада фигуристка и нейната майка 💙' },
  'hero.cta': { en: 'Start Your Journey', bg: 'Започни своя път' },
  'hero.disclaimer': { en: '100% free · Always private · No credit card needed', bg: '100% безплатно · Винаги поверително · Без банкова карта' },
  'hero.joinPrefix': { en: 'Join', bg: 'Присъедини се към' },
  'hero.joinSuffix.one': { en: 'skater already here', bg: 'фигурист, който вече е тук' },
  'hero.joinSuffix.many': { en: 'skaters already here', bg: 'фигуристи, които вече са тук' },

  // ───── Benefits ─────
  'benefit.mind.title': { en: 'Strengthen Your Mind', bg: 'Укрепи ума си' },
  'benefit.mind.text': { en: 'Build confidence and mental resilience through structured reflection.', bg: 'Изгради увереност и психическа устойчивост чрез подредена рефлексия.' },
  'benefit.training.title': { en: 'Track Your Training', bg: 'Проследявай тренировките' },
  'benefit.training.text': { en: 'Log sessions, jumps, and goals. Train with clear intention.', bg: 'Записвай тренировки, скокове и цели. Тренирай с ясно намерение.' },
  'benefit.growth.title': { en: 'See Your Growth', bg: 'Виж своя растеж' },
  'benefit.growth.text': { en: 'Spot patterns and celebrate wins over weeks and months.', bg: 'Забелязвай тенденции и празнувай победи в седмиците и месеците.' },

  // ───── Social proof + steps + final CTA ─────
  'social.text': { en: 'Skaters are already reflecting, training smarter, and growing with IceNotes every day ⛸️', bg: 'Фигуристи вече рефлектират, тренират по-умно и растат с IceNotes всеки ден ⛸️' },
  'social.cta': { en: 'Join IceNotes', bg: 'Присъедини се към IceNotes' },
  'steps.heading': { en: 'Simple as 1-2-3 ✨', bg: 'Просто като 1-2-3 ✨' },
  'steps.train.title': { en: 'Train', bg: 'Тренирай' },
  'steps.train.text': { en: 'Practice as usual — on or off ice.', bg: 'Тренирай както обикновено — на лед или извън него.' },
  'steps.reflect.title': { en: 'Reflect', bg: 'Рефлектирай' },
  'steps.reflect.text': { en: '5 quiet minutes to write it down.', bg: '5 спокойни минути, за да го запишеш.' },
  'steps.grow.title': { en: 'Grow', bg: 'Развивай се' },
  'steps.grow.text': { en: 'Watch your confidence bloom.', bg: 'Виж как увереността ти разцъфтява.' },
  'finalCta.heading': { en: 'Ready to grow as a skater?', bg: 'Готов/а ли си да израснеш като фигурист?' },
  'finalCta.subtitle.before': { en: 'Free, private, and built with', bg: 'Безплатно, поверително и създадено с' },
  'finalCta.subtitle.after': { en: 'for this beautiful sport.', bg: 'за този прекрасен спорт.' },
  'finalCta.welcomeBack': { en: 'Welcome Back', bg: 'Добре дошъл/дошла отново' },

  // ───── Feeling chips (daily journal) ─────
  'feeling.calm': { en: 'Calm', bg: 'Спокойствие' },
  'feeling.focused': { en: 'Focused', bg: 'Фокус' },
  'feeling.challenging': { en: 'Challenging', bg: 'Предизвикателен ден' },
  'feeling.heavy': { en: 'Heavy', bg: 'Тежък ден' },
  'feeling.energizing': { en: 'Energizing', bg: 'Енергия' },

  // ───── Journal — supportive microcopy ─────
  'journal.helper': { en: 'Write as much or as little as you want.', bg: 'Напиши толкова, колкото искаш.' },
  'journal.enoughForToday': { en: "That's enough for today.", bg: 'Това е достатъчно за днес.' },
  'journal.saveReflection': { en: "Save today's reflection", bg: 'Запази днешната рефлексия' },
  'journal.captured': { en: "Today's reflection captured", bg: 'Днешната рефлексия е запазена' },
  'journal.captured.gentle': { en: 'Saved 💙 Rest well, skater.', bg: 'Запазено 💙 Почини си, фигуристке.' },
  'journal.captured.lowDay': { en: 'Hard days are part of the journey. Be gentle with yourself today — tomorrow is a fresh sheet of ice. 💙', bg: 'Трудните дни също са част от пътя. Бъди мил/а със себе си днес — утре е нов лед. 💙' },
  'journal.section.daily': { en: 'Daily Journal', bg: 'Ежедневен дневник' },
  'journal.dateFormat': { en: 'EEEE, MMMM d', bg: 'EEEE, d MMMM' },
  'journal.workedOn.label': { en: 'What did you work on today?', bg: 'Върху какво работи днес?' },
  'journal.workedOn.placeholder': { en: 'Jumps, spins, edges, footwork, just skating around…', bg: 'Скокове, пирети, кантове, стъпки, просто пързаляне…' },
  'journal.feeling.label': { en: 'How did it feel today?', bg: 'Как се чувстваше днес?' },
  'journal.smallWin.label': { en: 'One small win or insight today', bg: 'Една малка победа или прозрение днес' },
  'journal.smallWin.helper': { en: 'A reflection, not an achievement. What did you notice?', bg: 'Рефлексия, не постижение. Какво забеляза?' },
  'journal.smallWin.placeholder': { en: 'Something clicked, I felt more relaxed, I noticed my breathing…', bg: 'Нещо се намести, бях по-спокоен/а, забелязах дишането си…' },
  'journal.coachNotes.label': { en: 'Notes from your coach', bg: 'Бележки от треньора' },
  'journal.coachNotes.optional': { en: '(optional)', bg: '(по избор)' },
  'journal.coachNotes.helper': { en: 'What did your coach say today? What should you focus on?', bg: 'Какво каза треньорът ти днес? На какво да обърнеш внимание?' },
  'journal.coachNotes.placeholder': { en: 'Working on arm position, more breathing before jumps…', bg: 'Работим върху позицията на ръцете, повече дишане преди скок…' },
  'journal.startAgain': { en: 'You can always start again tomorrow.', bg: 'Винаги можеш да започнеш отново утре.' },
  'journal.backDashboard': { en: 'Back to dashboard', bg: 'Назад към таблото' },

  // Optional rating-context notes (B2)
  'journal.note.emotional': { en: 'What was behind that today? (optional)', bg: 'Какво стоеше зад това днес? (по желание)' },
  'journal.note.confidence': { en: 'What helped or hurt your confidence today? (optional)', bg: 'Какво помогна или попречи на увереността ти днес? (по желание)' },
  'journal.note.focus': { en: 'What pulled your focus today? (optional)', bg: 'Какво отвличаше фокуса ти днес? (по желание)' },

  // ───── Mind Journal (Mind tab) ─────
  'mind.heading': { en: 'Mind Journal', bg: 'Дневник на ума' },
  'mind.subheading': { en: 'Tools to support your mental training', bg: 'Инструменти за подкрепа на психичната тренировка' },
  'mind.tab.cbt': { en: 'Reframe', bg: 'Пренастрой' },
  'mind.tab.gratitude': { en: 'Gratitude', bg: 'Благодарност' },
  'mind.tab.body': { en: 'Body Scan', bg: 'Тялото' },
  'mind.tab.compassion': { en: 'Compassion', bg: 'Съчувствие' },
  'mind.tab.precomp': { en: 'Pre-Comp', bg: 'Преди старт' },
  'mind.tab.postcomp': { en: 'Post-Comp', bg: 'След старт' },
  'mind.save': { en: 'Save entry', bg: 'Запази' },

  // CBT
  'mind.cbt.title': { en: 'Thought reframing', bg: 'Пренастройване на мисли' },
  'mind.cbt.desc': { en: 'Notice a tough thought, examine it gently, find a balanced view.', bg: 'Забележи трудна мисъл, разгледай я внимателно, намери балансирана гледна точка.' },
  'mind.cbt.situation': { en: 'What happened?', bg: 'Какво се случи?' },
  'mind.cbt.thought': { en: 'What thought went through your mind?', bg: 'Каква мисъл премина през ума ти?' },
  'mind.cbt.emotion': { en: 'What emotion did you feel?', bg: 'Каква емоция изпита?' },
  'mind.cbt.intensity': { en: 'How strong was it? (1-10)', bg: 'Колко силна беше? (1-10)' },
  'mind.cbt.evidenceFor': { en: 'Evidence the thought is true', bg: 'Доказателства, че мисълта е вярна' },
  'mind.cbt.evidenceAgainst': { en: 'Evidence the thought might not be true', bg: 'Доказателства, че мисълта може да не е вярна' },
  'mind.cbt.balanced': { en: 'A more balanced thought', bg: 'По-балансирана мисъл' },
  'mind.cbt.newIntensity': { en: 'How strong is the emotion now? (1-10)', bg: 'Колко силна е емоцията сега? (1-10)' },

  // Gratitude
  'mind.gratitude.title': { en: 'Three good things', bg: 'Три хубави неща' },
  'mind.gratitude.desc': { en: 'Three things you are grateful for today.', bg: 'Три неща, за които си благодарен/на днес.' },
  'mind.gratitude.placeholder': { en: 'I am grateful for…', bg: 'Благодарен/на съм за…' },

  // Body scan
  'mind.body.title': { en: 'Body scan & emotion check-in', bg: 'Сканиране на тялото и емоции' },
  'mind.body.desc': { en: 'Notice where you carry tension and name what you feel.', bg: 'Забележи къде носиш напрежение и назови това, което чувстваш.' },
  'mind.body.tension': { en: 'Where do you feel tension?', bg: 'Къде усещаш напрежение?' },
  'mind.body.overall': { en: 'How does your body feel overall? (1-10)', bg: 'Как се чувства тялото ти като цяло? (1-10)' },
  'mind.body.primary': { en: 'Main emotion', bg: 'Основна емоция' },
  'mind.body.secondary': { en: 'Secondary emotion (optional)', bg: 'Втора емоция (по желание)' },
  'mind.body.notes': { en: 'Notes', bg: 'Бележки' },

  // Body parts
  'body.head': { en: 'Head', bg: 'Глава' },
  'body.neck': { en: 'Neck & shoulders', bg: 'Врат и рамене' },
  'body.chest': { en: 'Chest', bg: 'Гърди' },
  'body.back': { en: 'Back', bg: 'Гръб' },
  'body.stomach': { en: 'Stomach', bg: 'Корем' },
  'body.hips': { en: 'Hips', bg: 'Таз и бедра' },
  'body.legs': { en: 'Legs', bg: 'Крака' },
  'body.feet': { en: 'Feet', bg: 'Стъпала' },

  // Self-compassion
  'mind.compassion.title': { en: 'Speak to yourself like a friend', bg: 'Говори си като на приятел' },
  'mind.compassion.desc': { en: 'When the inner critic gets loud, kindness creates space.', bg: 'Когато вътрешният критик се обажда, добротата създава пространство.' },
  'mind.compassion.situation': { en: 'What are you struggling with?', bg: 'С какво се бориш?' },
  'mind.compassion.friend': { en: 'What would you say to a friend in this situation?', bg: 'Какво би казал/а на приятел в тази ситуация?' },
  'mind.compassion.kind': { en: 'A kind message to yourself', bg: 'Мило послание към себе си' },

  // Pre-competition
  'mind.precomp.title': { en: 'Pre-competition mental routine', bg: 'Психическа подготовка преди старт' },
  'mind.precomp.desc': { en: 'Visualize success, breathe, and set your intention.', bg: 'Визуализирай успех, дишай и задай намерение.' },
  'mind.precomp.event': { en: 'Event name', bg: 'Име на състезанието' },
  'mind.precomp.eventDate': { en: 'Event date', bg: 'Дата на състезанието' },
  'mind.precomp.visualization': { en: 'Visualize your best skate — describe it', bg: 'Визуализирай най-доброто си пързаляне — опиши го' },
  'mind.precomp.anchor': { en: 'Confidence anchor (a phrase, image, or memory)', bg: 'Котва на увереността (фраза, образ или спомен)' },
  'mind.precomp.breathing': { en: 'I completed a breathing exercise', bg: 'Направих дихателно упражнение' },
  'mind.precomp.intention': { en: 'My intention today is…', bg: 'Моето намерение днес е…' },

  // Post-competition (B4)
  'mind.postcomp.title': { en: 'After your competition', bg: 'След състезанието' },
  'mind.postcomp.desc': {
    en: 'Three soft questions for the day after — regardless of placement.',
    bg: 'Три тихи въпроса за деня след старта — без значение от резултата.',
  },
  'mind.postcomp.didWell': { en: 'What did you do well today, regardless of placement?', bg: 'Какво направи добре днес, без значение от резултата?' },
  'mind.postcomp.surprise': { en: 'What surprised you — about your skating or yourself?', bg: 'Какво те изненада — в пързалянето ти или в самия теб?' },
  'mind.postcomp.carryForward': { en: 'What will you carry from this competition into your next training week?', bg: 'Какво ще вземеш от това състезание в следващата си тренировъчна седмица?' },
  'mind.postcomp.reminder': { en: 'You showed up. That already counts. 💙', bg: 'Беше там. Това вече има стойност. 💙' },

  // ───── Common ─────
  'common.optional': { en: 'optional', bg: 'по желание' },
  'common.add': { en: 'Add', bg: 'Добави' },
  'common.remove': { en: 'Remove', bg: 'Премахни' },
  'common.save': { en: 'Save', bg: 'Запази' },
  'common.cancel': { en: 'Cancel', bg: 'Отказ' },
  'common.back': { en: 'Back', bg: 'Назад' },
  'common.continue': { en: 'Continue', bg: 'Продължи' },
  'common.skip': { en: 'Skip', bg: 'Пропусни' },
  'common.loading': { en: 'Loading…', bg: 'Зареждане…' },
  'common.saving': { en: 'Saving…', bg: 'Запазваме…' },
  'common.tryAgain': { en: 'Try again', bg: 'Опитай отново' },
  'common.error': { en: 'Something went wrong', bg: 'Нещо не се получи' },
  'common.savedHeart': { en: 'Saved 💙', bg: 'Запазено 💙' },

  // ───── Training section (marketing keys, kept) ─────
  'training.heading': { en: 'Daily Practice', bg: 'Ежедневни тренировки' },
  'training.subheading': { en: 'Track your training across all disciplines', bg: 'Проследявай тренировките си във всички дисциплини' },
  'training.onIce.title': { en: 'On-Ice Training', bg: 'Тренировка на лед' },
  'training.onIce.desc': { en: 'Jumps, spins, footwork, and programs', bg: 'Скокове, пирети, стъпки и програми' },
  'training.offIce.title': { en: 'Off-Ice Training', bg: 'Тренировка извън лед' },
  'training.offIce.desc': { en: 'Strength, flexibility, and conditioning', bg: 'Сила, гъвкавост и кондиция' },
  'training.mental.title': { en: 'Mental Preparation', bg: 'Психическа подготовка' },
  'training.mental.desc': { en: 'Visualization, focus, and mindset', bg: 'Визуализация, фокус и нагласа' },
  'training.onIce.edges': { en: 'Edge work & stroking', bg: 'Кантове и базови елементи' },
  'training.onIce.spins': { en: 'Spins practice', bg: 'Пируети' },
  'training.onIce.jumps': { en: 'Jump technique', bg: 'Техника на скоковете' },
  'training.onIce.program': { en: 'Program run-through', bg: 'Прогон на програма' },
  'training.onIce.choreo': { en: 'Choreography', bg: 'Хореография' },
  'training.onIce.moves': { en: 'Moves in the Field', bg: 'Движения в полето' },
  'training.onIce.free': { en: 'Free Skate', bg: 'Свободно пързаляне' },
  'training.offIce.warmup': { en: 'Warm-up & stretching', bg: 'Загряване и разтягане' },
  'training.offIce.core': { en: 'Core strengthening', bg: 'Сила на корпуса' },
  'training.offIce.jumpSim': { en: 'Jump simulation', bg: 'Симулация на скокове' },
  'training.offIce.ballet': { en: 'Ballet & dance', bg: 'Балет и танци' },
  'training.offIce.cardio': { en: 'Cardio conditioning', bg: 'Кардио кондиция' },
  'training.offIce.strength': { en: 'Strength', bg: 'Сила' },
  'training.mental.visualization': { en: 'Program visualization', bg: 'Визуализация на програма' },
  'training.mental.breathing': { en: 'Breathing exercises', bg: 'Дихателни упражнения' },
  'training.mental.goalReview': { en: 'Goal review', bg: 'Преглед на целите' },
  'training.mental.competition': { en: 'Competition simulation', bg: 'Симулация на състезание' },
  'training.mental.affirmations': { en: 'Positive affirmations', bg: 'Позитивни утвърждения' },
  'training.onIceShort': { en: 'On-Ice', bg: 'На лед' },
  'training.offIceShort': { en: 'Off-Ice', bg: 'Извън лед' },

  // ───── Footer ─────
  'footer.tagline': { en: 'A cozy journaling space for ambitious figure skaters. ⛸️', bg: 'Уютно дневниково пространство за амбициозни фигуристи. ⛸️' },
  'footer.navigate': { en: 'Navigate', bg: 'Навигация' },
  'footer.product': { en: 'Product', bg: 'Продукт' },
  'footer.account': { en: 'Account', bg: 'Профил' },
  'footer.journal': { en: 'Journal', bg: 'Дневник' },
  'footer.goals': { en: 'Goals', bg: 'Цели' },
  'footer.progress': { en: 'Progress', bg: 'Прогрес' },
  'footer.signup': { en: 'Sign Up', bg: 'Регистрация' },
  'footer.login': { en: 'Log In', bg: 'Вход' },
  'footer.rights': { en: 'All rights reserved.', bg: 'Всички права запазени.' },
  'footer.builtWith': { en: 'Built with', bg: 'Създадено с' },
  'footer.forSkaters': { en: 'for skaters who dream big.', bg: 'за фигуристи, които мечтаят на едро.' },

  // ───── About page ─────
  'about.eyebrow': { en: 'About', bg: 'За нас' },
  'about.title': { en: 'Built by skaters, for skaters.', bg: 'Създадено от фигуристи. За фигуристи.' },
  'about.subtitle': { en: 'A private space to reflect, train intentionally, and grow — on and off the ice.', bg: 'Лично пространство, в което рефлектираш, тренираш с цел и растеш — на леда и извън него.' },
  'about.story.title': { en: 'Our Story', bg: 'Нашата история' },
  'about.story.lead': { en: 'Created by a young figure skater and her mom who saw a gap: skaters often struggle not from lack of talent, but lack of tools.', bg: 'Създадохме IceNotes заедно — млада фигуристка и нейната майка. Видяхме нещо просто, но важно: на повечето състезатели не им липсва талант, а инструменти, с които да го развиват спокойно и последователно.' },
  'about.story.b1': { en: 'Reflect after every session', bg: 'Спокойна рефлексия след всяка тренировка' },
  'about.story.b2': { en: 'Track progress over time', bg: 'Ясен поглед върху прогреса във времето' },
  'about.story.b3': { en: 'Build mental resilience', bg: 'Силна психика и устойчивост на леда' },
  'about.mission.title': { en: 'Our Mission', bg: 'Нашата мисия' },
  'about.mission.b1': { en: 'Help skaters train with intention', bg: 'Да помогнем на фигуристите да тренират с яснота и цел' },
  'about.mission.b2': { en: 'Reflect with honesty', bg: 'Да рефлектират честно — пред себе си' },
  'about.mission.b3': { en: 'Grow with confidence', bg: 'Да израстват с увереност, стъпка по стъпка' },
  'about.mission.b4': { en: 'Make mental prep as valued as ice time', bg: 'Да поставим психичната подготовка наравно с времето на леда' },
  'about.who.title': { en: "Who It's For", bg: 'За кого е създадено' },
  'about.who.b1': { en: 'Beginners learning their first waltz jump', bg: 'Начинаещи, които учат първите си елементи' },
  'about.who.b2': { en: 'Competitive skaters training for nationals', bg: 'Състезатели, които се готвят за национални първенства' },
  'about.who.b3': { en: 'Coaches and skating families', bg: 'Треньори и семейства, които живеят с фигурното пързаляне' },
  'about.cta.title': { en: 'Join the IceNotes community.', bg: 'Стани част от общността на IceNotes.' },
  'about.cta.subtitle': { en: 'Free forever. Private by default. Made with love for skating.', bg: 'Безплатно завинаги. Поверително по подразбиране. Създадено с обич към фигурното пързаляне.' },
  'about.cta.button': { en: 'Get Started Free', bg: 'Започни безплатно' },
  'about.coach.desc': { en: 'Meet the coaches behind IceNotes', bg: 'Запознай се с треньорите зад IceNotes' },

  // ───── How It Works page ─────
  'how.eyebrow': { en: 'How It Works', bg: 'Как работи' },
  'how.title': { en: 'Five steps to smarter training.', bg: 'Пет стъпки към по-осъзната тренировка.' },
  'how.subtitle': { en: "IceNotes is designed to fit naturally into your skating routine. Here's how it works.", bg: 'IceNotes се вписва естествено в твоето ежедневие на леда. Ето как:' },
  'how.step1.title': { en: 'Create Your Free Account', bg: 'Създай безплатен профил' },
  'how.step1.desc': { en: 'Sign up in under two minutes. Tell us your name, how you see yourself as a skater, and what you want to focus on. No credit card required.', bg: 'Регистрацията отнема под две минути. Сподели как се виждаш като фигурист и върху какво искаш да работиш. Без банкова карта.' },
  'how.step2.title': { en: 'Reflect After Every Session', bg: 'Рефлектирай след всяка тренировка' },
  'how.step2.desc': { en: 'Use the daily journal to capture what you worked on, how you felt, and your small wins. Structured prompts help you build the habit of self-reflection.', bg: 'В дневника записваш върху какво работиш, как си се чувствал/а и кои са малките победи. Подредените въпроси ти помагат да изградиш навика да се вслушваш в себе си.' },
  'how.step3.title': { en: 'Track Your Training & Jumps', bg: 'Проследявай тренировки и скокове' },
  'how.step3.desc': { en: 'Log on-ice and off-ice sessions with detail. Track jump attempts, landing rates, and technical progress. Set weekly goals to keep your training intentional.', bg: 'Записвай тренировките на лед и извън него с подробности. Следи опитите за скокове, успешните приземявания и техническия напредък. Поставяй седмични цели, за да тренираш с фокус.' },
  'how.step4.title': { en: 'Develop Your Mental Game', bg: 'Развивай психичната си игра' },
  'how.step4.desc': { en: 'Use pre-skate breathing exercises, guided visualizations, and daily affirmations. Build the emotional resilience that separates good skaters from great ones.', bg: 'Използвай дихателни упражнения преди тренировка, водени визуализации и ежедневни утвърждения. Това е емоционалната устойчивост, която отличава добрите фигуристи от великите.' },
  'how.step5.title': { en: 'See Your Growth Over Time', bg: 'Виж как растеш с времето' },
  'how.step5.desc': { en: "Activity calendars, progress summaries, and consistency analytics help you identify patterns and celebrate how far you've come.", bg: 'Календар на активността, обобщения и анализ на постоянството ти показват тенденциите и колко път вече си изминал/а.' },
  'how.cta.title': { en: 'Ready to start?', bg: 'Готов/а да започнеш?' },
  'how.cta.subtitle': { en: 'Create your free account and start journaling after your next session.', bg: 'Създай безплатен профил и започни да водиш дневник още след следващата си тренировка.' },
  'how.cta.button': { en: 'Create Your Free Account', bg: 'Създай безплатен профил' },

  // ───── Features page ─────
  'features.eyebrow': { en: 'Features', bg: 'Функции' },
  'features.title': { en: 'Everything you need to train with intention.', bg: 'Всичко, от което имаш нужда, за да тренираш с цел.' },
  'features.subtitle': { en: 'Purpose-built tools for structured reflection, tracking, and growth.', bg: 'Инструменти, създадени специално за подредена рефлексия, проследяване и растеж.' },
  'features.cat.reflection': { en: 'Reflection', bg: 'Рефлексия' },
  'features.cat.mindset': { en: 'Mindset', bg: 'Нагласа' },
  'features.cat.performance': { en: 'Performance', bg: 'Изпълнение' },
  'features.cat.training': { en: 'Training', bg: 'Тренировка' },
  'features.cat.planning': { en: 'Planning', bg: 'Планиране' },
  'features.cat.insights': { en: 'Insights', bg: 'Прозрения' },
  'features.cat.tools': { en: 'Tools', bg: 'Инструменти' },
  'features.f1.title': { en: 'Daily Journal', bg: 'Ежедневен дневник' },
  'features.f1.desc': { en: 'Capture what you worked on, how you felt, and your small wins after every session. Structured prompts make reflection easy and consistent.', bg: 'Записвай върху какво работи, как се чувстваше и кои бяха малките победи след всяка тренировка. Подредени въпроси правят рефлексията лесна и постоянна.' },
  'features.f2.title': { en: 'Reflection Space', bg: 'Пространство за рефлексия' },
  'features.f2.desc': { en: 'A private, free-form space for deeper thoughts about your skating journey. Process emotions, set intentions, and grow through self-awareness.', bg: 'Лично, свободно пространство за по-дълбоки мисли по пътя ти в пързалянето. Прехвърляй емоции, задавай намерения и растеш чрез себепознание.' },
  'features.f3.title': { en: 'Mental Preparation', bg: 'Психична подготовка' },
  'features.f3.desc': { en: 'Pre-skate breathing exercises (Box, 4-7-8, Energizing), guided visualizations for programs and confidence, and daily affirmations.', bg: 'Дихателни упражнения преди лед (Кутия, 4-7-8, Енергизиращо), водени визуализации за програми и увереност, и ежедневни утвърждения.' },
  'features.f4.title': { en: 'Jump Tracker', bg: 'Дневник на скоковете' },
  'features.f4.desc': { en: 'Log every jump attempt with type, level, quality, and landing success. Track your consistency and see technical progress over time.', bg: 'Записвай всеки опит за скок — вид, ниво, качество и приземяване. Виж постоянството си и техническия напредък във времето.' },
  'features.f5.title': { en: 'On-Ice Training Log', bg: 'Дневник на тренировките на лед' },
  'features.f5.desc': { en: 'Detailed session logging for edges, spins, footwork, and programs. Track duration, activities, and how each session felt.', bg: 'Подробен запис на тренировки — кантове, пируети, стъпки и програми. Проследявай продължителност, активности и усещане от всяка сесия.' },
  'features.f6.title': { en: 'Off-Ice Training Log', bg: 'Дневник на тренировките извън лед' },
  'features.f6.desc': { en: 'Log strength, flexibility, and conditioning work. Keep your off-ice preparation as structured as your time on the ice.', bg: 'Записвай силова, гъвкавост и кондиционна работа. Подготовката извън лед е също толкова важна, колкото времето на леда.' },
  'features.f7.title': { en: 'Weekly Goals', bg: 'Седмични цели' },
  'features.f7.desc': { en: 'Set targets for on-ice hours, off-ice sessions, and specific jump attempts each week. Stay intentional about your development.', bg: 'Задавай цели за часове на лед, тренировки извън лед и конкретни скокове всяка седмица. Развивай се с яснота.' },
  'features.f8.title': { en: 'Session Timer', bg: 'Таймер за тренировка' },
  'features.f8.desc': { en: 'Time your practice sessions with lap tracking. Stay accountable and build awareness of how you spend your ice time.', bg: 'Засичай тренировките си с отделни обиколки. Бъди наясно как използваш времето си на леда.' },
  'features.f9.title': { en: 'Progress Analytics', bg: 'Анализ на прогреса' },
  'features.f9.desc': { en: 'Activity calendars, training volume summaries, and consistency tracking. See patterns and celebrate your growth at a glance.', bg: 'Календар на активността, обобщение на обема и проследяване на постоянството. Виждаш тенденциите и празнуваш растежа с един поглед.' },
  'features.f10.title': { en: 'Journey View', bg: 'Изглед на пътя' },
  'features.f10.desc': { en: "A complete timeline of your skating development. Look back at your entries, sessions, and milestones to see how far you've come.", bg: 'Цялостна времева линия на твоето развитие. Връщаш се към записите, тренировките и важните моменти и виждаш колко път си изминал/а.' },
  'features.f11.title': { en: 'Motivational Quotes', bg: 'Мотивиращи цитати' },
  'features.f11.desc': { en: 'A curated collection of quotes for athletes. Save your favorites and get daily inspiration before you step on the ice.', bg: 'Подбрана колекция от цитати за спортисти. Запази любимите си и получавай ежедневно вдъхновение преди да стъпиш на леда.' },
  'features.f12.title': { en: 'PDF Export', bg: 'Експорт в PDF' },
  'features.f12.desc': { en: 'Export your training data and journal entries as a PDF. Share progress with coaches or keep a personal archive of your journey.', bg: 'Изнеси тренировките и записите си в PDF. Сподели прогреса с треньора или си запази личен архив на пътя.' },
  'features.cta.title': { en: 'Start using these tools today.', bg: 'Започни да използваш тези инструменти още днес.' },
  'features.cta.subtitle': { en: 'All features are free. No credit card needed.', bg: 'Всички функции са безплатни. Без банкова карта.' },
  'features.cta.button': { en: 'Create Your Free Account', bg: 'Създай безплатен профил' },

  // ───── Contact page ─────
  'contact.eyebrow': { en: 'Contact', bg: 'Контакт' },
  'contact.title': { en: 'Get in touch.', bg: 'Свържи се с нас.' },
  'contact.subtitle': { en: "Have a question, suggestion, or feedback? We'd love to hear from you.", bg: 'Имаш въпрос, идея или обратна връзка? С удоволствие ще те чуем.' },
  'contact.form.title': { en: 'Send us a message', bg: 'Изпрати ни съобщение' },
  'contact.form.desc': { en: 'We typically respond within 24 hours.', bg: 'Обикновено отговаряме до 24 часа.' },
  'contact.form.name': { en: 'Name', bg: 'Име' },
  'contact.form.namePh': { en: 'Your name', bg: 'Твоето име' },
  'contact.form.email': { en: 'Email', bg: 'Имейл' },
  'contact.form.emailPh': { en: 'you@example.com', bg: 'ti@primer.com' },
  'contact.form.subject': { en: 'Subject', bg: 'Тема' },
  'contact.form.subjectPh': { en: "What's this about?", bg: 'За какво е съобщението?' },
  'contact.form.message': { en: 'Message', bg: 'Съобщение' },
  'contact.form.messagePh': { en: 'Tell us more...', bg: 'Разкажи ни повече…' },
  'contact.form.send': { en: 'Send Message', bg: 'Изпрати съобщение' },
  'contact.form.thanks': { en: 'Thank you!', bg: 'Благодарим ти!' },
  'contact.form.thanksDesc': { en: "Your message has been sent. We'll get back to you soon.", bg: 'Получихме съобщението ти. Ще ти отговорим съвсем скоро.' },
  'contact.form.another': { en: 'Send another message', bg: 'Изпрати ново съобщение' },
  'contact.toast.title': { en: 'Message sent!', bg: 'Съобщението е изпратено!' },
  'contact.toast.desc': { en: "We'll get back to you as soon as possible.", bg: 'Ще се свържем с теб възможно най-скоро.' },
  'contact.email.title': { en: 'Email', bg: 'Имейл' },
  'contact.email.desc': { en: 'For general inquiries, reach out at:', bg: 'За общи въпроси ни пиши на:' },
  'contact.feedback.title': { en: 'Feedback & Ideas', bg: 'Обратна връзка и идеи' },
  'contact.feedback.desc': { en: 'IceNotes is built for skaters, by people who care about skating. Your feedback directly shapes the product.', bg: 'IceNotes е създаден за фигуристите от хора, на които пързалянето им е на сърцето. Твоето мнение пряко оформя продукта.' },
  'contact.coach.text': { en: "Are you a coach? We're exploring features for coaches and their athletes. Let us know what would be most useful for your team.", bg: 'Треньор ли си? Разработваме нови функции за треньори и техните състезатели. Сподели какво би ти било най-полезно.' },
  'contact.coach.bold': { en: 'Are you a coach?', bg: 'Треньор ли си?' },

  // ───── Sport Psychology page ─────
  'psy.eyebrow': { en: 'Sport Psychology', bg: 'Спортна психология' },
  'psy.title': { en: 'Train your mind like your body.', bg: 'Тренирай ума така, както тренираш тялото.' },
  'psy.subtitle': { en: 'Build mental strength alongside physical skill.', bg: 'Изгради психична сила паралелно с техническото умение.' },
  'psy.t1.title': { en: 'Mental Preparation', bg: 'Психична подготовка' },
  'psy.t1.desc': { en: 'Box breathing, 4-7-8 technique, and energizing breathwork before every session.', bg: 'Дишане по квадрат, техника 4-7-8 и енергизиращо дишане преди всяка тренировка.' },
  'psy.t2.title': { en: 'Visualization', bg: 'Визуализация' },
  'psy.t2.desc': { en: 'Mentally rehearse programs, jumps, and competition scenarios.', bg: 'Мислено повтаряй програми, скокове и състезателни сценарии.' },
  'psy.t3.title': { en: 'Building Confidence', bg: 'Изграждане на увереност' },
  'psy.t3.desc': { en: 'Daily affirmations, small-win tracking, and structured reflection.', bg: 'Ежедневни утвърждения, проследяване на малките победи и подредена рефлексия.' },
  'psy.t4.title': { en: 'Competition Mindset', bg: 'Състезателна нагласа' },
  'psy.t4.desc': { en: 'Manage nerves, stay focused, and turn anxiety into energy.', bg: 'Управлявай вълнението, остани фокусиран/а и превърни тревогата в енергия.' },
  'psy.t5.title': { en: 'Emotional Resilience', bg: 'Емоционална устойчивост' },
  'psy.t5.desc': { en: 'Process frustration, bounce back from falls, and stay motivated.', bg: 'Преработвай разочарованието, ставай след падане и пази мотивацията си жива.' },
  'psy.t6.title': { en: 'Focus & Flow State', bg: 'Фокус и състояние на поток' },
  'psy.t6.desc': { en: 'Eliminate distractions and maintain deep concentration.', bg: 'Премахни разсейването и задръж дълбока концентрация.' },
  'psy.cta.title': { en: 'Start building your mental game.', bg: 'Започни да изграждаш психичната си игра.' },
  'psy.cta.subtitle': { en: 'All mental training tools are included free.', bg: 'Всички инструменти за психична тренировка са безплатни.' },
  'psy.cta.button': { en: 'Get Started Free', bg: 'Започни безплатно' },

  // ───── Today / Guided Journey ─────
  'today.tab': { en: 'Today', bg: 'Днес' },
  'today.title': { en: "Today's Journey", bg: 'Дневен ритуал' },
  'today.subtitle': { en: 'A calm, guided path through your training day.', bg: 'Спокоен, направляван път през тренировъчния ти ден.' },
  'today.progress': { en: 'Step {current} of {total}', bg: 'Стъпка {current} от {total}' },
  'today.next': { en: 'Continue', bg: 'Продължи' },
  'today.back': { en: 'Back', bg: 'Назад' },
  'today.skip': { en: 'Skip for today', bg: 'Пропусни за днес' },
  'today.done.title': { en: 'You showed up today.', bg: 'Беше тук днес.' },
  'today.done.subtitle': { en: 'That is what builds a skater. Rest well.', bg: 'Точно това гради фигурист. Почивай добре.' },
  'today.restart': { en: 'Start again', bg: 'Започни отново' },
  'today.stage.pre.label': { en: 'Pre-training', bg: 'Преди тренировка' },
  'today.stage.pre.title': { en: 'Arrive in your body', bg: 'Влез в тялото си' },
  'today.stage.pre.desc': { en: 'Breathe, visualize, and set an intention before you step on the ice.', bg: 'Поеми въздух, визуализирай и постави намерение, преди да стъпиш на леда.' },
  'today.stage.training.label': { en: 'Training', bg: 'Тренировка' },
  'today.stage.training.title': { en: 'Train with focus', bg: 'Тренирай с фокус' },
  'today.stage.training.desc': { en: 'Use the timer, log your session, and track your jumps when you are ready.', bg: 'Използвай таймера, запиши сесията и отбележи скоковете си, когато си готов/а.' },
  'today.stage.post.label': { en: 'Post-training', bg: 'След тренировка' },
  'today.stage.post.title': { en: 'Reflect with kindness', bg: 'Рефлектирай с добрина' },
  'today.stage.post.desc': { en: 'What went well, what was hard, what you learned — then a softer view of yourself.', bg: 'Какво се получи, какво беше трудно, какво научи — и след това по-меко отношение към себе си.' },
  'today.stage.grounding.label': { en: 'Daily grounding', bg: 'Заземяване' },
  'today.stage.grounding.title': { en: 'Land back into yourself', bg: 'Върни се към себе си' },
  'today.stage.grounding.desc': { en: 'Gratitude, a body scan, and a quiet check-in with how you really feel.', bg: 'Благодарност, сканиране на тялото и тих разговор с това как наистина се чувстваш.' },
  'today.stage.weekly.label': { en: 'Weekly review', bg: 'Седмичен преглед' },
  'today.stage.weekly.title': { en: 'Look back, look ahead', bg: 'Поглед назад и напред' },
  'today.stage.weekly.desc': { en: 'Notice the patterns of the week and choose your focus for the next one.', bg: 'Забележи моделите от седмицата и избери своя фокус за следващата.' },
  'today.weekly.improved': { en: 'What improved this week?', bg: 'Какво се подобри тази седмица?' },
  'today.weekly.patterns': { en: 'What patterns do you notice?', bg: 'Какви модели забелязваш?' },
  'today.weekly.next': { en: 'What will you focus on next?', bg: 'Върху какво ще се фокусираш след това?' },
  'today.weekly.placeholder': { en: 'Write freely…', bg: 'Пиши свободно…' },
  'today.weekly.save': { en: 'Save weekly review', bg: 'Запази прегледа' },
  'today.weekly.saved': { en: 'Saved for this week 💙', bg: 'Запазено за тази седмица 💙' },

  // ───── App-wide common ─────
  'app.tagline': { en: 'Reflect · Train · Perform', bg: 'Рефлексия · Тренировка · Изпълнение' },
  'app.loadingJourney': { en: 'Loading your journey…', bg: 'Зареждаме твоя път…' },
  'app.focusNow': { en: 'Your focus right now', bg: 'Твоят фокус в момента' },
  'app.everySessionCounts': { en: "Every session counts. You're doing amazing. 💙", bg: 'Всяка тренировка има значение. Справяш се чудесно. 💙' },

  // ───── Header (in-app) ─────
  'header.dailyLog': { en: 'Daily Log', bg: 'Дневен запис' },
  'header.profile': { en: 'Profile', bg: 'Профил' },
  'header.settings': { en: 'Settings', bg: 'Настройки' },
  'header.logout': { en: 'Log out', bg: 'Изход' },
  'header.signOut': { en: 'Sign out', bg: 'Излизане' },
  'header.signOut.confirm.title': { en: 'Sign out?', bg: 'Излизане от профила?' },
  'header.signOut.confirm.desc': { en: 'Your data is safely stored. You can sign back in anytime to continue your journey. 💙', bg: 'Данните ти са на сигурно място. Можеш да влезеш отново по всяко време, за да продължиш пътя си. 💙' },
  'header.signOut.confirm.stay': { en: 'Stay signed in', bg: 'Остани в профила' },
  'header.logoutConfirm': { en: 'Are you sure you want to log out? Your data will remain saved.', bg: 'Сигурен/на ли си, че искаш да излезеш? Данните ти остават запазени.' },
  'header.skaterSuffix': { en: 'Skater', bg: 'Фигурист' },
  'header.reminders': { en: 'Reminders', bg: 'Напомняния' },
  'header.adminDashboard': { en: 'Admin dashboard', bg: 'Админ панел' },
  'header.reminderSettings': { en: 'Reminder Settings', bg: 'Настройки за напомняния' },

  // ───── Dashboard tabs (5-tab structure) ─────
  'dash.tab.today': { en: 'Today', bg: 'Днес' },
  'dash.tab.train': { en: 'Train', bg: 'Тренировка' },
  'dash.tab.mind': { en: 'Mind', bg: 'Ум' },
  'dash.tab.goals': { en: 'Goals', bg: 'Цели' },
  'dash.tab.growth': { en: 'Growth', bg: 'Растеж' },

  // Mind sub-pills
  'dash.mind.preskate': { en: 'Pre-Skate', bg: 'Преди лед' },
  'dash.mind.journal': { en: 'Mind Journal', bg: 'Дневник на ума' },
  'dash.mind.psych': { en: 'Sport Psych', bg: 'Спортна психология' },
  'dash.mind.inspire': { en: 'Inspiration', bg: 'Вдъхновение' },

  // Goals timeframe toggle
  'dash.goals.week': { en: 'Week', bg: 'Седмица' },
  'dash.goals.month': { en: 'Month', bg: 'Месец' },
  'dash.goals.season': { en: 'Season', bg: 'Сезон' },

  // Card titles & subtitles
  'dash.weeklyGoals.title': { en: 'Weekly Goals', bg: 'Седмични цели' },
  'dash.weeklyGoals.subtitle': { en: 'Set your intentions for the week', bg: 'Задай своите намерения за седмицата' },
  'dash.skatingPlan.title': { en: 'My Skating Plan', bg: 'Моят план за пързалянето' },
  'dash.skatingPlan.subtitle': { en: 'Weekly, monthly & season goals', bg: 'Седмични, месечни и сезонни цели' },
  'dash.mentalPrep.title': { en: 'Mental Prep', bg: 'Психическа подготовка' },
  'dash.mentalPrep.subtitle': { en: 'Calm your mind before training', bg: 'Успокой ума си преди тренировка' },
  'dash.sportPsych.title': { en: 'Sport Psychology', bg: 'Спортна психология' },
  'dash.sportPsych.subtitle': { en: 'Strengthen your mental game', bg: 'Укрепи психичната си игра' },
  'dash.inspiration.title': { en: 'Inspiration', bg: 'Вдъхновение' },
  'dash.inspiration.subtitle': { en: 'Words that keep you going', bg: 'Думи, които те държат напред' },
  'dash.todayTraining.title': { en: "Today's Training", bg: 'Днешната тренировка' },
  'dash.todayTraining.subtitle': { en: 'Track your on-ice and off-ice sessions', bg: 'Записвай тренировките си на лед и извън него' },
  'dash.sessionTimer.title': { en: 'Session Timer', bg: 'Таймер за тренировка' },
  'dash.sessionTimer.subtitle': { en: 'Time your practice with lap tracking', bg: 'Засичай тренировката си с обиколки' },
  'dash.onIce.title': { en: 'On-Ice Training', bg: 'Тренировка на лед' },
  'dash.onIce.logged': { en: 'Session logged ✨', bg: 'Сесията е записана ✨' },
  'dash.onIce.activities': { en: 'Edges, spins, footwork, programs', bg: 'Кантове, пируети, стъпки, програми' },
  'dash.offIce.title': { en: 'Off-Ice Training', bg: 'Тренировка извън лед' },
  'dash.offIce.activities': { en: 'Strength, flexibility, conditioning', bg: 'Сила, гъвкавост, кондиция' },
  'dash.reflect.title': { en: 'Reflect', bg: 'Рефлексия' },
  'dash.reflect.subtitle': { en: 'Deeper thoughts about your skating', bg: 'По-дълбоки мисли за пързалянето ти' },
  'dash.jumpTracker.title': { en: 'Jump Tracker', bg: 'Дневник на скоковете' },
  'dash.jumpTracker.subtitle': { en: 'Log your jumps and track progress', bg: 'Записвай скоковете и следи напредъка си' },
  'dash.dailyJournal.title': { en: 'Daily Journal', bg: 'Ежедневен дневник' },
  'dash.dailyJournal.subtitle': { en: "Capture today's reflections", bg: 'Запиши днешните мисли' },
  'dash.progress.title': { en: 'Your Progress', bg: 'Твоят прогрес' },
  'dash.progress.subtitle': { en: "See how far you've come", bg: 'Виж колко път си изминал/а' },
  'dash.journey.title': { en: 'Your Journey', bg: 'Твоят път' },
  'dash.journey.subtitle': { en: 'The bigger picture of your growth', bg: 'По-голямата картина на твоя растеж' },

  // Today summary
  'dash.todaySummary.title': { en: "Yesterday's training", bg: 'Вчерашната тренировка' },
  'dash.todaySummary.empty': { en: 'No training logged yesterday — every break is part of the journey too.', bg: 'Вчера нямаше записана тренировка — и почивката е част от пътя.' },
  'dash.todaySummary.cta': { en: 'Want to write one sentence about it?', bg: 'Искаш ли да напишеш едно изречение за нея?' },

  // Back button (in-app)
  'dash.back': { en: '← Back', bg: '← Назад' },

  // ───── Onboarding ─────
  'onb.welcome.title': { en: 'Welcome to IceNotes', bg: 'Добре дошъл/дошла в IceNotes' },
  'onb.welcome.subtitle': { en: 'Your structured journal for mindset, training, and performance growth.', bg: 'Твоят подреден дневник за нагласа, тренировка и растеж.' },
  'onb.welcome.subtitle2': { en: 'Built for skaters who want to grow.', bg: 'Създаден за фигуристи, които искат да растат.' },
  'onb.welcome.nameLabel': { en: 'What should we call you?', bg: 'Как да се обръщаме към теб?' },
  'onb.welcome.namePh': { en: 'Your name', bg: 'Твоето име' },
  'onb.continue': { en: 'Continue', bg: 'Продължи' },

  'onb.level.title': { en: 'How do you currently see yourself as a skater?', bg: 'Как се виждаш в момента като фигурист?' },
  'onb.level.subtitle': { en: "This is not an evaluation. It's your self-perception, and you can change it anytime.", bg: 'Това не е оценка. Това е как сам/а се виждаш — и можеш да го промениш по всяко време.' },

  'onb.goals.title': { en: 'What would you like to focus on right now?', bg: 'Върху какво искаш да се фокусираш сега?' },
  'onb.goals.subtitle': { en: 'Your focus can evolve. This is just where you are today.', bg: 'Фокусът ти може да се променя. Това е просто къде си днес.' },
  'onb.goals.mainLabel': { en: 'Main focus *', bg: 'Основен фокус *' },
  'onb.goals.mainPh': { en: 'Working on my axel, building confidence, enjoying practice more…', bg: 'Работя върху аксела си, изграждам увереност, радвам се на тренировките повече…' },
  'onb.goals.feelingLabel': { en: 'What would progress feel like for you? (optional)', bg: 'Как би се усещал напредъкът за теб? (по желание)' },
  'onb.goals.feelingPh': { en: 'Feeling more relaxed on the ice, landing jumps more often…', bg: 'Чувствам се по-спокоен/а на леда, приземявам скокове по-често…' },

  'onb.details.title': { en: 'A bit more about you', bg: 'Малко повече за теб' },
  'onb.details.subtitle': { en: 'You can skip this. You can change it anytime.', bg: 'Можеш да пропуснеш. Можеш да го промениш по всяко време.' },
  'onb.details.age': { en: 'Age', bg: 'Възраст' },
  'onb.details.height': { en: 'Height (cm)', bg: 'Височина (см)' },
  'onb.details.weight': { en: 'Weight (kg)', bg: 'Тегло (кг)' },
  'onb.details.weight.label': { en: 'Weight', bg: 'Тегло' },
  'onb.details.weight.tender': { en: 'Only share if it helps you. You can skip and never see this again.', bg: 'Сподели само ако ти помага. Можеш да пропуснеш и да не виждаш това отново.' },
  'onb.details.weight.skip': { en: "Don't ask me again", bg: 'Не ме питай отново' },
  'onb.details.weight.show': { en: 'Show weight field', bg: 'Покажи поле за тегло' },
  'onb.details.note': { en: 'This information is optional and stored securely.', bg: 'Тази информация е по желание и се съхранява сигурно.' },
  'onb.details.cta.start': { en: 'Begin My Journey', bg: 'Започни моя път' },
  'onb.details.cta.starting': { en: 'Setting up…', bg: 'Подготвяме всичко…' },
  'onb.details.footer': { en: 'Progress, not perfection.', bg: 'Напредък, не съвършенство.' },

  'onb.toast.welcome.title': { en: 'Welcome to IceNotes 💙', bg: 'Добре дошъл/дошла в IceNotes 💙' },
  'onb.toast.welcome.desc': { en: 'Your skating story starts here. One session at a time.', bg: 'Твоята история на леда започва тук. Една тренировка наведнъж.' },
  'onb.toast.error.title': { en: 'Something went wrong', bg: 'Нещо не се получи' },
  'onb.toast.error.desc': { en: 'Could not save your profile. Please try again.', bg: 'Профилът не можа да бъде запазен. Моля, опитай отново.' },

  // Self-levels
  'level.foundations.label': { en: 'Building foundations', bg: 'Изграждам основи' },
  'level.foundations.desc': { en: 'Learning the basics and finding your balance', bg: 'Уча основите и намирам баланса си' },
  'level.consistency.label': { en: 'Developing consistency', bg: 'Развивам постоянство' },
  'level.consistency.desc': { en: 'Working on making skills more reliable', bg: 'Работя елементите ми да са по-надеждни' },
  'level.refining.label': { en: 'Refining performance', bg: 'Шлифовам изпълнението' },
  'level.refining.desc': { en: 'Polishing technique and expression', bg: 'Полирам техниката и изразяването' },
  'level.competing.label': { en: 'Competing with confidence', bg: 'Състезавам се уверено' },
  'level.competing.desc': { en: 'Preparing for or participating in competitions', bg: 'Подготвям се за или участвам в състезания' },

  // ───── 404 ─────
  'notFound.title': { en: 'Oops! Page not found', bg: 'Опа! Страницата не е намерена' },
  'notFound.return': { en: 'Return to Home', bg: 'Към началото' },

  // ───── Auth page ─────
  'auth.tagline': { en: 'Reflect. Train. Perform.', bg: 'Рефлексия. Тренировка. Изпълнение.' },
  'auth.welcome': { en: 'Welcome', bg: 'Добре дошъл/дошла' },
  'auth.welcomeSubtitle': { en: 'Track your skating journey', bg: 'Проследявай своя път в пързалянето' },
  'auth.tab.login': { en: 'Log In', bg: 'Вход' },
  'auth.tab.signup': { en: 'Sign Up', bg: 'Регистрация' },
  'auth.field.email': { en: 'Email', bg: 'Имейл' },
  'auth.field.password': { en: 'Password', bg: 'Парола' },
  'auth.field.name': { en: 'Name', bg: 'Име' },
  'auth.field.confirmPassword': { en: 'Confirm Password', bg: 'Потвърди паролата' },
  'auth.placeholder.email': { en: 'you@example.com', bg: 'ti@primer.com' },
  'auth.placeholder.password': { en: '••••••••', bg: '••••••••' },
  'auth.placeholder.name': { en: 'Your name', bg: 'Твоето име' },
  'auth.placeholder.passwordMin': { en: 'At least 6 characters', bg: 'Поне 6 символа' },
  'auth.placeholder.confirmPassword': { en: 'Confirm your password', bg: 'Потвърди паролата си' },
  'auth.forgot.link': { en: 'Forgot password?', bg: 'Забравена парола?' },
  'auth.cta.login': { en: 'Log In', bg: 'Влез' },
  'auth.cta.loggingIn': { en: 'Logging in…', bg: 'Влизаме…' },
  'auth.cta.signup': { en: 'Create Account', bg: 'Създай профил' },
  'auth.cta.creating': { en: 'Creating account…', bg: 'Създаваме профила…' },
  'auth.backHome': { en: 'Back to home', bg: 'Към началото' },
  'auth.terms': { en: 'By continuing, you agree to track your skating journey with us.', bg: 'С продължаването приемаш да следваш своя път в пързалянето заедно с нас.' },
  'auth.forgot.title': { en: 'Forgot Password', bg: 'Забравена парола' },
  'auth.forgot.descAsk': { en: "Enter your email and we'll send you a reset link", bg: 'Въведи имейла си и ще ти изпратим линк за нова парола' },
  'auth.forgot.descSent': { en: 'Check your email for the reset link', bg: 'Провери имейла си за линка за възстановяване' },
  'auth.forgot.heading': { en: 'Reset your password', bg: 'Възстанови паролата си' },
  'auth.forgot.send': { en: 'Send Reset Link', bg: 'Изпрати линк' },
  'auth.forgot.sending': { en: 'Sending…', bg: 'Изпращаме…' },
  'auth.forgot.sentTo': { en: "We've sent a password reset link to", bg: 'Изпратихме линк за нова парола на' },
  'auth.forgot.checkSpam': { en: "Didn't receive the email? Check your spam folder or try again.", bg: 'Не получаваш имейл? Провери папка „Спам“ или опитай отново.' },
  'auth.forgot.tryAgain': { en: 'Try again', bg: 'Опитай отново' },
  'auth.forgot.back': { en: 'Back to login', bg: 'Назад към вход' },
  'auth.reset.heading': { en: 'Set your new password', bg: 'Задай нова парола' },
  'auth.reset.title': { en: 'New Password', bg: 'Нова парола' },
  'auth.reset.desc': { en: 'Choose a strong password for your account', bg: 'Избери силна парола за профила си' },
  'auth.reset.field.new': { en: 'New Password', bg: 'Нова парола' },
  'auth.reset.field.confirm': { en: 'Confirm Password', bg: 'Потвърди паролата' },
  'auth.reset.cta': { en: 'Update Password', bg: 'Запази паролата' },
  'auth.reset.updating': { en: 'Updating…', bg: 'Запазваме…' },
  'auth.toast.missingFields.title': { en: 'Missing fields', bg: 'Липсват полета' },
  'auth.toast.missingFields.desc': { en: 'Please enter your email and password', bg: 'Моля, въведи имейл и парола' },
  'auth.toast.missingFieldsAll.desc': { en: 'Please fill in all required fields', bg: 'Моля, попълни всички задължителни полета' },
  'auth.toast.loginFailed': { en: 'Login failed', bg: 'Входът не успя' },
  'auth.toast.welcomeBack.title': { en: 'Welcome back!', bg: 'Радваме се, че си отново тук!' },
  'auth.toast.welcomeBack.desc': { en: "You've successfully logged in", bg: 'Успешно влезе в профила си' },
  'auth.toast.signupFailed': { en: 'Signup failed', bg: 'Регистрацията не успя' },
  'auth.toast.created.title': { en: 'Account created!', bg: 'Профилът е създаден!' },
  'auth.toast.created.desc': { en: 'Welcome to IceNotes', bg: 'Добре дошъл/дошла в IceNotes' },
  'auth.toast.passMismatch.title': { en: "Passwords don't match", bg: 'Паролите не съвпадат' },
  'auth.toast.passMismatch.desc': { en: 'Please make sure your passwords match', bg: 'Увери се, че двете пароли са еднакви' },
  'auth.toast.passShort.title': { en: 'Password too short', bg: 'Паролата е твърде къса' },
  'auth.toast.passShort.desc': { en: 'Password must be at least 6 characters', bg: 'Паролата трябва да е поне 6 символа' },
  'auth.toast.emailRequired.title': { en: 'Email required', bg: 'Имейлът е задължителен' },
  'auth.toast.emailRequired.desc': { en: 'Please enter your email address', bg: 'Моля, въведи своя имейл' },
  'auth.toast.error': { en: 'Error', bg: 'Грешка' },
  'auth.toast.emailSent.title': { en: 'Email sent!', bg: 'Имейлът е изпратен!' },
  'auth.toast.emailSent.desc': { en: 'Check your inbox for the password reset link', bg: 'Провери пощата си за линка за нова парола' },
  'auth.toast.passRequired.title': { en: 'Password required', bg: 'Паролата е задължителна' },
  'auth.toast.passRequired.desc': { en: 'Please enter a new password', bg: 'Моля, въведи нова парола' },
  'auth.toast.passUpdated.title': { en: 'Password updated!', bg: 'Паролата е обновена!' },
  'auth.toast.passUpdated.desc': { en: 'Your password has been successfully changed', bg: 'Паролата ти беше успешно сменена' },

  // ───── Dashboard misc (extra) ─────
  'dash.focusNow': { en: '✨ Your focus right now', bg: '✨ Твоят фокус в момента' },
  'dash.footer.encourage': { en: "Every session counts. You're doing amazing. 💙", bg: 'Всяка тренировка има значение. Справяш се прекрасно. 💙' },
  'dash.signout.title': { en: 'Sign out?', bg: 'Излизане?' },
  'dash.signout.desc': { en: 'Your data is safely stored. You can sign back in anytime to continue your journey. 💙', bg: 'Данните ти са в безопасност. Можеш да влезеш отново винаги, когато решиш. 💙' },
  'dash.signout.stay': { en: 'Stay signed in', bg: 'Остани в профила' },
  'dash.signout.confirm': { en: 'Sign out', bg: 'Излез' },

  // Tone-aware journal save messages (B1)
  'journal.captured.celebratory': { en: 'Beautiful day on the ice. Capture this feeling. ✨', bg: 'Прекрасен ден на леда. Запомни това усещане. ✨' },
  'journal.captured.neutral': { en: 'Saved. One more page in your story. 💙', bg: 'Запазено. Още една страница в твоята история. 💙' },

  // Achievements — softer streak language
  'ach.title': { en: 'Achievements', bg: 'Постижения' },
  'ach.summary.unlocked': { en: 'unlocked', bg: 'отключени' },
  'ach.keepGoing': { en: 'Keep showing up — every reflection counts.', bg: 'Продължавай да идваш — всяка рефлексия има значение.' },
  'ach.unlocked': { en: 'Unlocked', bg: 'Отключени' },
  'ach.inProgress': { en: 'In progress', bg: 'В прогрес' },
  'ach.locked': { en: 'Coming up', bg: 'Предстои' },
  'ach.streak3.title': { en: 'Getting started', bg: 'Първи стъпки' },
  'ach.streak3.desc': { en: '3 days journaled this month', bg: '3 дни с дневник този месец' },
  'ach.streak7.title': { en: 'A week of reflection', bg: 'Седмица рефлексия' },
  'ach.streak7.desc': { en: '7 days journaled this month', bg: '7 дни с дневник този месец' },
  'ach.streak30.title': { en: 'Steady presence', bg: 'Постоянно присъствие' },
  'ach.streak30.desc': { en: '30 days journaled this month', bg: '30 дни с дневник този месец' },
  'ach.jumps10.title': { en: 'First flight', bg: 'Първи полет' },
  'ach.jumps10.desc': { en: 'Logged 10 jump attempts', bg: 'Записани 10 опита за скок' },
  'ach.jumps50.title': { en: 'Jump explorer', bg: 'Изследовател на скоковете' },
  'ach.jumps50.desc': { en: 'Logged 50 jump attempts', bg: 'Записани 50 опита за скок' },
  'ach.jumps100.title': { en: 'Century club', bg: 'Стотицата' },
  'ach.jumps100.desc': { en: 'Logged 100 jump attempts', bg: 'Записани 100 опита за скок' },
  'ach.landed25.title': { en: 'Clean landings', bg: 'Чисти приземявания' },
  'ach.landed25.desc': { en: '25 landed jumps', bg: '25 приземени скока' },
  'ach.triple5.title': { en: 'Triple moments', bg: 'Тройни моменти' },
  'ach.triple5.desc': { en: '5 landed triple jumps', bg: '5 приземени тройни скока' },
  'ach.logs10.title': { en: 'Quiet consistency', bg: 'Тиха постоянност' },
  'ach.logs10.desc': { en: '10 daily reflections', bg: '10 ежедневни рефлексии' },
  'ach.goals1.title': { en: 'First goal reached', bg: 'Първа достигната цел' },
  'ach.goals1.desc': { en: 'Completed your first goal', bg: 'Завърши първата си цел' },
  'ach.goals5.title': { en: 'Goals in motion', bg: 'Цели в движение' },
  'ach.goals5.desc': { en: '5 goals completed', bg: '5 завършени цели' },
  'ach.tasks20.title': { en: 'Mindful doer', bg: 'Осъзнат деятел' },
  'ach.tasks20.desc': { en: '20 tasks completed', bg: '20 завършени задачи' },
  'ach.unit.days': { en: 'days', bg: 'дни' },
  'ach.unit.jumps': { en: 'jumps', bg: 'скока' },
  'ach.unit.landings': { en: 'landings', bg: 'приземявания' },
  'ach.unit.triples': { en: 'triples', bg: 'тройни' },
  'ach.unit.logs': { en: 'reflections', bg: 'рефлексии' },
  'ach.unit.goal': { en: 'goal', bg: 'цел' },
  'ach.unit.goals': { en: 'goals', bg: 'цели' },
  'ach.unit.tasks': { en: 'tasks', bg: 'задачи' },
};

// ───── Tone helper (B1) ─────
/** Adaptive tone classification for journal feedback. */
export type Tone = 'gentle' | 'neutral' | 'celebratory';
export const getToneForRatings = (opts: {
  emotionalState?: number | null;
  confidenceLevel?: number | null;
}): Tone => {
  const e = opts.emotionalState ?? null;
  const c = opts.confidenceLevel ?? null;
  if ((e !== null && e <= 3) || (c !== null && c <= 4)) return 'gentle';
  if ((e !== null && e >= 8) || (c !== null && c >= 8)) return 'celebratory';
  return 'neutral';
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Set the language without persisting back to localStorage (used when syncing from profile). */
  setLanguageSilent: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof dict | string) => string;
  availableLanguages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'icenotes.language';
const SUPPORTED: ReadonlyArray<Language> = ['en', 'bg'];

const isLanguage = (val: unknown): val is Language =>
  typeof val === 'string' && (SUPPORTED as ReadonlyArray<string>).includes(val);

const detectInitialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(saved)) return saved;
    const browser = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
    if (browser.startsWith('bg')) return 'bg';
    return 'en';
  } catch {
    return 'en';
  }
};

// Dev-only: warn once per missing key so silent gaps are visible.
const warnedKeys = new Set<string>();
const warnMissingKey = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV && !warnedKeys.has(key)) {
    warnedKeys.add(key);
    // eslint-disable-next-line no-console
    console.warn(`[i18n] Missing translation key: "${key}"`);
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch {}
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    if (isLanguage(lang)) setLanguageState(lang);
  }, []);

  const setLanguageSilent = useCallback((lang: Language) => {
    if (!isLanguage(lang)) return;
    setLanguageState((current) => (current === lang ? current : lang));
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((p) => {
      const i = SUPPORTED.indexOf(p);
      return SUPPORTED[(i + 1) % SUPPORTED.length];
    });
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = dict[key];
      if (!entry) {
        warnMissingKey(key);
        return key;
      }
      return entry[language] ?? entry.en ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, setLanguageSilent, toggleLanguage, t, availableLanguages: LANGUAGES }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
