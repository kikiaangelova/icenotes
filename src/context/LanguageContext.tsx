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
  'hero.badge': { en: 'Made for figure skaters, by a 14-year-old figure skater', bg: 'Създадено за фигуристи, от 14-годишна фигуристка' },
  'hero.title.line1': { en: 'Your skating journey', bg: 'Твоят път в пързалянето' },
  'hero.title.line2.prefix': { en: 'deserves to be', bg: 'заслужава да бъде' },
  'hero.title.highlight': { en: 'remembered', bg: 'запомнен' },
  'hero.subtitle': {
    en: 'A quiet space to reflect, train, and watch yourself grow — one session at a time.',
    bg: 'Тихо място, в което да помислиш, да тренираш и да видиш как растеш — тренировка по тренировка.',
  },
  'hero.attribution': { en: 'Created by a young figure skater and her mom 💙', bg: 'Създадено от млада фигуристка и нейната майка 💙' },
  'hero.cta': { en: 'Start Your Journey', bg: 'Започни своя път' },
  'hero.disclaimer': { en: '100% free · Always private · No credit card needed', bg: '100% безплатно · Винаги поверително · Без банкова карта' },
  'hero.joinPrefix': { en: 'Join', bg: 'Присъедини се към' },
  'hero.joinSuffix.one': { en: 'skater already here', bg: 'фигурист, който вече е тук' },
  'hero.joinSuffix.many': { en: 'skaters already here', bg: 'фигуристи, които вече са тук' },

  // ───── Benefits ─────
  'benefit.mind.title': { en: 'A clearer head', bg: 'По-ясна глава' },
  'benefit.mind.text': { en: 'Quiet reflection that builds real confidence on the ice.', bg: 'Тиха рефлексия, която гради истинска увереност на леда.' },
  'benefit.training.title': { en: 'Sessions that stick', bg: 'Тренировки, които остават' },
  'benefit.training.text': { en: 'Log what you did. See what worked. Train with a reason.', bg: 'Запиши какво направи. Виж какво работи. Тренирай с причина.' },
  'benefit.growth.title': { en: 'Your own progress', bg: 'Твоят собствен прогрес' },
  'benefit.growth.text': { en: 'Look back over weeks and months — and notice how far you’ve come.', bg: 'Погледни назад към седмици и месеци — и виж колко път си изминала.' },

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
  'journal.helper': { en: 'Write a lot or just a line. Both count.', bg: 'Напиши много или само ред. И двете са достатъчно.' },
  'journal.enoughForToday': { en: 'That’s enough for today.', bg: 'За днес е достатъчно.' },
  'journal.saveReflection': { en: 'Save today', bg: 'Запази днес' },
  'journal.captured': { en: 'Today is saved.', bg: 'Денят е запазен.' },
  'journal.captured.gentle': { en: 'Saved 💙 Get some rest.', bg: 'Запазено 💙 Сега почивай.' },
  'journal.captured.lowDay': { en: 'Hard days count too. Be easy on yourself — tomorrow is fresh ice. 💙', bg: 'Трудните дни също се броят. Бъди мила със себе си — утре е нов лед. 💙' },
  'journal.section.daily': { en: 'Daily journal', bg: 'Дневник' },
  'journal.dateFormat': { en: 'EEEE, MMMM d', bg: 'EEEE, d MMMM' },
  'journal.workedOn.label': { en: 'What did you work on today?', bg: 'Върху какво работи днес?' },
  'journal.workedOn.placeholder': { en: 'Jumps, spins, edges, just skating around…', bg: 'Скокове, пирети, кантове, просто пързаляне…' },
  'journal.feeling.label': { en: 'How did today feel?', bg: 'Как ти беше днес?' },
  'journal.smallWin.label': { en: 'One small thing that worked', bg: 'Едно малко нещо, което се получи' },
  'journal.smallWin.helper': { en: 'Doesn’t have to be big. Just something you noticed.', bg: 'Не трябва да е нещо голямо. Просто нещо, което забеляза.' },
  'journal.smallWin.placeholder': { en: 'Something clicked, I felt calmer, I caught my breath better…', bg: 'Нещо се намести, бях по-спокойна, дишането ми вървеше по-добре…' },
  'journal.coachNotes.label': { en: 'What your coach said', bg: 'Какво каза треньорът' },
  'journal.coachNotes.optional': { en: '(if you want)', bg: '(ако искаш)' },
  'journal.coachNotes.helper': { en: 'A correction, a tip, something to remember.', bg: 'Поправка, съвет, нещо, което да запомниш.' },
  'journal.coachNotes.placeholder': { en: 'Arms tighter, breathe before the jump…', bg: 'По-събрани ръце, дишане преди скока…' },
  'journal.startAgain': { en: 'Tomorrow is a new page.', bg: 'Утре е нова страница.' },
  'journal.backDashboard': { en: 'Back', bg: 'Назад' },

  // Optional rating-context notes (B2)
  'journal.note.emotional': { en: 'What was behind that? (optional)', bg: 'Какво стоеше зад това? (по желание)' },
  'journal.note.confidence': { en: 'What helped — or didn’t? (optional)', bg: 'Какво помогна — или не? (по желание)' },
  'journal.note.focus': { en: 'What pulled your focus? (optional)', bg: 'Какво ти разсейваше фокуса? (по желание)' },

  // ───── Mind Journal (Mind tab) ─────
  'mind.heading': { en: 'Mind journal', bg: 'Дневник на ума' },
  'mind.subheading': { en: 'A quiet place for the mental side.', bg: 'Тихо място за психичната страна.' },
  'mind.tab.cbt': { en: 'Reframe', bg: 'Пренастрой' },
  'mind.tab.gratitude': { en: 'Gratitude', bg: 'Благодарност' },
  'mind.tab.body': { en: 'Body Scan', bg: 'Тялото' },
  'mind.tab.compassion': { en: 'Compassion', bg: 'Съчувствие' },
  'mind.tab.precomp': { en: 'Pre-Comp', bg: 'Преди старт' },
  'mind.tab.postcomp': { en: 'Post-Comp', bg: 'След старт' },
  'mind.save': { en: 'Save entry', bg: 'Запази' },

  // CBT
  'mind.cbt.title': { en: 'Reframe a thought', bg: 'Пренастрой една мисъл' },
  'mind.cbt.desc': { en: 'Take a tough thought apart. Look at it from a calmer angle.', bg: 'Разгледай трудна мисъл. Погледни я отстрани, по-спокойно.' },
  'mind.cbt.situation': { en: 'What happened?', bg: 'Какво стана?' },
  'mind.cbt.thought': { en: 'What went through your head?', bg: 'Каква мисъл ти мина?' },
  'mind.cbt.emotion': { en: 'What did you feel?', bg: 'Какво усети?' },
  'mind.cbt.intensity': { en: 'How strong was it? (1–10)', bg: 'Колко силно беше? (1–10)' },
  'mind.cbt.evidenceFor': { en: 'What backs the thought up', bg: 'Какво подкрепя мисълта' },
  'mind.cbt.evidenceAgainst': { en: 'What argues against it', bg: 'Какво говори против нея' },
  'mind.cbt.balanced': { en: 'A calmer way to put it', bg: 'По-спокоен начин да го кажеш' },
  'mind.cbt.newIntensity': { en: 'How strong is it now? (1–10)', bg: 'Колко силно е сега? (1–10)' },

  // Gratitude
  'mind.gratitude.title': { en: 'Three good things', bg: 'Три хубави неща' },
  'mind.gratitude.desc': { en: 'Three things from today. Small ones count.', bg: 'Три неща от днешния ден. Малките също се броят.' },
  'mind.gratitude.placeholder': { en: 'Today I’m glad about…', bg: 'Днес съм благодарна за…' },

  // Body scan
  'mind.body.title': { en: 'Body & feeling check-in', bg: 'Тяло и усещане' },
  'mind.body.desc': { en: 'Where are you holding tension? What are you feeling?', bg: 'Къде носиш напрежение? Какво усещаш?' },
  'mind.body.tension': { en: 'Where do you feel tight?', bg: 'Къде ти е стегнато?' },
  'mind.body.overall': { en: 'How does your body feel? (1–10)', bg: 'Как се усеща тялото? (1–10)' },
  'mind.body.primary': { en: 'Main feeling', bg: 'Основно усещане' },
  'mind.body.secondary': { en: 'Anything else? (optional)', bg: 'Нещо друго? (по желание)' },
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
  'mind.compassion.title': { en: 'Talk to yourself like a friend', bg: 'Говори си като на приятел' },
  'mind.compassion.desc': { en: 'When the inner critic gets loud, kindness opens space.', bg: 'Когато вътрешният критик надига глас, добротата отваря пространство.' },
  'mind.compassion.situation': { en: 'What’s hard right now?', bg: 'Какво ти е трудно сега?' },
  'mind.compassion.friend': { en: 'What would you tell a friend in this spot?', bg: 'Какво би казала на приятел на твое място?' },
  'mind.compassion.kind': { en: 'Now say something kind to yourself', bg: 'А сега кажи нещо мило на себе си' },

  // Pre-competition
  'mind.precomp.title': { en: 'Before the competition', bg: 'Преди старта' },
  'mind.precomp.desc': { en: 'Picture it. Breathe. Pick one thing to hold onto.', bg: 'Представи си го. Поеми въздух. Избери едно нещо, за което да се хванеш.' },
  'mind.precomp.event': { en: 'Event name', bg: 'Състезание' },
  'mind.precomp.eventDate': { en: 'Date', bg: 'Дата' },
  'mind.precomp.visualization': { en: 'Picture your best skate — describe it', bg: 'Представи си най-доброто си изпълнение — опиши го' },
  'mind.precomp.anchor': { en: 'Something to hold onto (a word, an image, a memory)', bg: 'Нещо, за което да се хванеш (дума, образ или спомен)' },
  'mind.precomp.breathing': { en: 'I did a breathing exercise', bg: 'Направих дихателно упражнение' },
  'mind.precomp.intention': { en: 'Today I’m skating for…', bg: 'Днес се пързалям за…' },

  // Post-competition (B4)
  'mind.postcomp.title': { en: 'After the competition', bg: 'След старта' },
  'mind.postcomp.desc': {
    en: 'Three quiet questions — no matter where you placed.',
    bg: 'Три тихи въпроса — без значение къде си се класирала.',
  },
  'mind.postcomp.didWell': { en: 'What went well today, no matter the result?', bg: 'Какво се получи днес, без значение от резултата?' },
  'mind.postcomp.surprise': { en: 'What surprised you — in the skating or in yourself?', bg: 'Какво те изненада — в пързалянето или в теб?' },
  'mind.postcomp.carryForward': { en: 'What do you want to take into next week?', bg: 'Какво искаш да вземеш със себе си в следващата седмица?' },
  'mind.postcomp.reminder': { en: 'You showed up. That already counts. 💙', bg: 'Излезе на леда. Това вече се брои. 💙' },

  // ───── Common ─────
  'common.optional': { en: 'optional', bg: 'по желание' },
  'common.add': { en: 'Add', bg: 'Добави' },
  'common.remove': { en: 'Remove', bg: 'Премахни' },
  'common.save': { en: 'Save', bg: 'Запази' },
  'common.cancel': { en: 'Cancel', bg: 'Отказ' },
  'common.back': { en: 'Back', bg: 'Назад' },
  'common.continue': { en: 'Continue', bg: 'Продължи' },
  'common.skip': { en: 'Skip', bg: 'Пропусни' },
  'common.loading': { en: 'Loading…', bg: 'Зареждаме…' },
  'common.saving': { en: 'Saving…', bg: 'Запазваме…' },
  'common.tryAgain': { en: 'Try again', bg: 'Пробвай пак' },
  'common.error': { en: 'Something didn’t work', bg: 'Нещо не се получи' },
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
  'about.title': { en: 'Built by a 14-year-old figure skater, for figure skaters.', bg: 'Създадено от 14-годишна фигуристка за фигуристи.' },
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
  'today.title': { en: 'Today', bg: 'Днес' },
  'today.subtitle': { en: 'A calm path through your training day.', bg: 'Спокоен път през тренировъчния ден.' },
  'today.progress': { en: 'Step {current} of {total}', bg: 'Стъпка {current} от {total}' },
  'today.next': { en: 'Continue', bg: 'Продължи' },
  'today.back': { en: 'Back', bg: 'Назад' },
  'today.skip': { en: 'Skip for today', bg: 'Пропусни за днес' },
  'today.done.title': { en: 'You showed up today.', bg: 'Беше тук днес.' },
  'today.done.subtitle': { en: 'That’s what builds a skater. Get some rest.', bg: 'Точно това гради фигурист. Сега си почини.' },
  'today.restart': { en: 'Start over', bg: 'Започни отново' },
  'today.stage.pre.label': { en: 'Before', bg: 'Преди' },
  'today.stage.pre.title': { en: 'Land in your body', bg: 'Влез в тялото си' },
  'today.stage.pre.desc': { en: 'Breathe, picture it, set one intention before you step on the ice.', bg: 'Поеми въздух, представи си го и си задай едно намерение, преди да стъпиш на леда.' },
  'today.stage.training.label': { en: 'Training', bg: 'Тренировка' },
  'today.stage.training.title': { en: 'Train with focus', bg: 'Тренирай с фокус' },
  'today.stage.training.desc': { en: 'Use the timer, log the session, note your jumps when you’re ready.', bg: 'Пусни таймера, запиши тренировката, отбележи скоковете, когато си готова.' },
  'today.stage.post.label': { en: 'After', bg: 'След' },
  'today.stage.post.title': { en: 'Reflect — gently', bg: 'Помисли — спокойно' },
  'today.stage.post.desc': { en: 'What worked, what was hard, what you took away. Be easy on yourself.', bg: 'Какво се получи, какво беше трудно, какво научи. Бъди мила със себе си.' },
  'today.stage.grounding.label': { en: 'Grounding', bg: 'Заземяване' },
  'today.stage.grounding.title': { en: 'Come back to yourself', bg: 'Върни се към себе си' },
  'today.stage.grounding.desc': { en: 'A small gratitude, a body check, an honest read on how you feel.', bg: 'Малка благодарност, поглед към тялото, честна проверка как си.' },
  'today.stage.weekly.label': { en: 'Weekly', bg: 'Седмично' },
  'today.stage.weekly.title': { en: 'Look back, look ahead', bg: 'Поглед назад, поглед напред' },
  'today.stage.weekly.desc': { en: 'See the patterns of the week. Pick one focus for the next.', bg: 'Виж моделите от седмицата. Избери един фокус за следващата.' },
  'today.weekly.improved': { en: 'What got better this week?', bg: 'Какво стана по-добро тази седмица?' },
  'today.weekly.patterns': { en: 'Any patterns you noticed?', bg: 'Забеляза ли модели?' },
  'today.weekly.next': { en: 'What’s your focus next week?', bg: 'Какъв ти е фокусът за следващата?' },
  'today.weekly.placeholder': { en: 'Just write…', bg: 'Просто пиши…' },
  'today.weekly.save': { en: 'Save the week', bg: 'Запази седмицата' },
  'today.weekly.saved': { en: 'Saved for this week 💙', bg: 'Запазено за тази седмица 💙' },

  // ───── Today: quick log (Today-first home) ─────
  'today.quick.eyebrow': { en: 'Today', bg: 'Днес' },
  'today.quick.title': { en: 'Log today in a minute', bg: 'Запиши деня си за минута' },
  'today.quick.duration.label': { en: 'How long did you train?', bg: 'Колко дълго тренира?' },
  'today.quick.duration.placeholder': { en: '60', bg: '60' },
  'today.quick.duration.unit': { en: 'minutes', bg: 'минути' },
  'today.quick.type.label': { en: 'What kind of session?', bg: 'Какъв беше денят?' },
  'today.quick.type.onIce': { en: 'On-ice', bg: 'На лед' },
  'today.quick.type.offIce': { en: 'Off-ice', bg: 'Извън лед' },
  'today.quick.type.rest': { en: 'Rest day', bg: 'Почивка' },
  'today.quick.focus.label': { en: 'How was your focus?', bg: 'Как беше фокусът ти?' },
  'today.quick.focus.low': { en: 'Scattered', bg: 'Разпиляна' },
  'today.quick.focus.high': { en: 'Locked in', bg: 'Изцяло вътре' },
  'today.quick.mood.label': { en: 'Energy & mood', bg: 'Енергия и настроение' },
  'today.quick.wentWell.label': { en: 'What worked?', bg: 'Какво се получи?' },
  'today.quick.wentWell.placeholder': { en: 'A small win, a moment, a feeling…', bg: 'Малка победа, момент, усещане…' },
  'today.quick.needsWork.label': { en: 'What needs work?', bg: 'Над какво има да се работи?' },
  'today.quick.needsWork.placeholder': { en: 'Something to come back to…', bg: 'Нещо, към което да се върнеш…' },
  'today.quick.oneLine.label': { en: 'One sentence about today', bg: 'Едно изречение за днес' },
  'today.quick.oneLine.placeholder': { en: 'In a few words — how was it?', bg: 'С няколко думи — как беше?' },
  'today.quick.save': { en: 'Save today', bg: 'Запази деня' },
  'today.quick.helper': { en: 'Fill in only what feels useful. Half is fine.', bg: 'Попълни само това, което ти е полезно. И половината е добре.' },
  'today.quick.saved.title': { en: 'Today is saved. Nice work.', bg: 'Денят е запазен. Браво.' },
  'today.quick.saved.subtitle': { en: 'Come back tomorrow — or open the full journal below.', bg: 'Върни се утре — или отвори пълния дневник по-долу.' },
  'today.deeper.title': { en: 'Want to go deeper?', bg: 'Искаш ли да навлезеш по-надълбоко?' },
  'today.deeper.open': { en: 'Open', bg: 'Отвори' },
  'today.deeper.close': { en: 'Hide', bg: 'Скрий' },

  // ───── Today: post-save summary card ─────
  'today.summary.eyebrow': { en: 'Today', bg: 'Днес' },
  'today.summary.title': { en: 'Nicely done.', bg: 'Браво.' },
  'today.summary.title.gentle': { en: 'Saved. Be easy on yourself today.', bg: 'Запазено. Бъди мила със себе си днес.' },
  'today.summary.title.celebratory': { en: 'What a day. Hold on to this. ✨', bg: 'Какъв ден. Запази това усещане. ✨' },
  // Three rotating gentle messages for hard days (low confidence/mood/energy)
  'today.summary.gentle.0': {
    en: 'Saved. Take a breath — recovery is part of the work.',
    bg: 'Запазено. Поеми дъх — възстановяването също е работа.',
  },
  'today.summary.gentle.1': {
    en: 'Not every session has to feel strong to count.',
    bg: 'Не всяка тренировка трябва да усещаш силна, за да се брои.',
  },
  'today.summary.gentle.2': {
    en: 'A hard day still tells you something useful.',
    bg: 'Дори трудният ден ти казва нещо полезно.',
  },
  'today.summary.minutes': { en: 'minutes', bg: 'минути' },
  'today.summary.focus': { en: 'focus', bg: 'фокус' },
  'today.summary.mood': { en: 'mood', bg: 'настроение' },
  'today.summary.elements': { en: 'What you worked on', bg: 'Върху какво работи' },
  'today.summary.prompt': { en: 'Add a sentence?', bg: 'Едно изречение отгоре?' },
  'today.summary.promptPlaceholder': { en: 'A thought, a feeling, a moment from today…', bg: 'Мисъл, усещане, момент от днес…' },
  'today.summary.promptSave': { en: 'Save it', bg: 'Запази' },
  'today.summary.promptThanks': { en: 'Saved. Get some rest tonight.', bg: 'Запазено. Сега си почини.' },

  // ───── Jump type labels ─────
  // ───── Jump log: experience-based quality input ─────
  'jumpLog.quality.label': { en: 'How did it feel?', bg: 'Как ти се усети?' },
  'jumpLog.quality.shaky': { en: 'Shaky', bg: 'Нестабилен' },
  'jumpLog.quality.okay': { en: 'Okay', bg: 'ОК' },
  'jumpLog.quality.good': { en: 'Good', bg: 'Добър' },
  'jumpLog.quality.best': { en: 'Best one yet', bg: 'Най-добрият досега' },

  'jump.toe-loop': { en: 'Toe Loop', bg: 'Тулуп' },
  'jump.salchow': { en: 'Salchow', bg: 'Салхов' },
  'jump.loop': { en: 'Loop', bg: 'Луп' },
  'jump.flip': { en: 'Flip', bg: 'Флип' },
  'jump.lutz': { en: 'Lutz', bg: 'Лутц' },
  'jump.axel': { en: 'Axel', bg: 'Аксел' },

  // ───── App-wide common ─────
  'app.tagline': { en: 'Reflect · Train · Perform', bg: 'Помисли · Тренирай · Излез' },
  'app.loadingJourney': { en: 'Loading…', bg: 'Зареждаме…' },
  'app.focusNow': { en: 'What you’re focused on right now', bg: 'Върху какво си фокусирана сега' },
  'app.everySessionCounts': { en: 'Every session counts. You’re doing great. 💙', bg: 'Всяка тренировка се брои. Справяш се страхотно. 💙' },

  // ───── Header (in-app) ─────
  'header.dailyLog': { en: 'Daily Log', bg: 'Дневен запис' },
  'header.profile': { en: 'Profile', bg: 'Профил' },
  'header.settings': { en: 'Settings', bg: 'Настройки' },
  'header.logout': { en: 'Log out', bg: 'Изход' },
  'header.signOut': { en: 'Sign out', bg: 'Излизане' },
  'header.signOut.confirm.title': { en: 'Sign out?', bg: 'Излизаш ли?' },
  'header.signOut.confirm.desc': { en: 'Your data stays safe. Come back whenever. 💙', bg: 'Данните ти остават на сигурно. Върни се, когато решиш. 💙' },
  'header.signOut.confirm.stay': { en: 'Stay signed in', bg: 'Остани' },
  'header.logoutConfirm': { en: 'Sure you want to log out? Your data stays saved.', bg: 'Сигурна ли си, че искаш да излезеш? Данните ти остават.' },
  'header.skaterSuffix': { en: 'Skater', bg: 'Фигурист' },
  'header.reminders': { en: 'Reminders', bg: 'Напомняния' },
  'header.adminDashboard': { en: 'Admin dashboard', bg: 'Админ панел' },
  'header.reminderSettings': { en: 'Reminder Settings', bg: 'Настройки за напомняния' },

  // ───── Dashboard tabs (5-tab structure) ─────
  'dash.tab.today': { en: 'Today', bg: 'Днес' },
  'dash.tab.train': { en: 'Train', bg: 'Тренировка' },
  'dash.tab.mind': { en: 'Mind', bg: 'Ум' },
  'dash.tab.goals': { en: 'Goals', bg: 'Цели' },
  'dash.tab.progress': { en: 'Progress', bg: 'Прогрес' },

  // Mind sub-pills
  'dash.mind.preskate': { en: 'Pre-Skate', bg: 'Преди лед' },
  'dash.mind.journal': { en: 'Mind Journal', bg: 'Дневник на ума' },
  'dash.mind.psych': { en: 'Sport Psych', bg: 'Спортна психология' },
  'dash.mind.inspire': { en: 'Inspiration', bg: 'Вдъхновение' },
  'dash.mind.reflect': { en: 'Reflect', bg: 'Рефлексия' },

  // Goals timeframe toggle
  'dash.goals.week': { en: 'Week', bg: 'Седмица' },
  'dash.goals.month': { en: 'Month', bg: 'Месец' },
  'dash.goals.season': { en: 'Season', bg: 'Сезон' },

  // Card titles & subtitles
  'dash.weeklyGoals.title': { en: 'This week’s goals', bg: 'Цели за седмицата' },
  'dash.weeklyGoals.subtitle': { en: 'What do you want to work on?', bg: 'Над какво искаш да работиш?' },
  'dash.skatingPlan.title': { en: 'Skating plan', bg: 'Планът ти' },
  'dash.skatingPlan.subtitle': { en: 'Week, month, season — your choice.', bg: 'Седмица, месец, сезон — ти избираш.' },
  'dash.mentalPrep.title': { en: 'Mental prep', bg: 'Психическа подготовка' },
  'dash.mentalPrep.subtitle': { en: 'Settle your head before you skate.', bg: 'Успокой главата си преди леда.' },
  'dash.sportPsych.title': { en: 'Sport psychology', bg: 'Спортна психология' },
  'dash.sportPsych.subtitle': { en: 'Train the mental side too.', bg: 'Тренирай и психичната страна.' },
  'dash.inspiration.title': { en: 'Inspiration', bg: 'Вдъхновение' },
  'dash.inspiration.subtitle': { en: 'A few words to keep you going.', bg: 'Няколко думи, които те държат.' },
  'dash.todayTraining.title': { en: 'Today’s training', bg: 'Днешната тренировка' },
  'dash.todayTraining.subtitle': { en: 'On-ice and off-ice, in one place.', bg: 'На лед и извън него, на едно място.' },
  'dash.sessionTimer.title': { en: 'Session timer', bg: 'Таймер за тренировка' },
  'dash.sessionTimer.subtitle': { en: 'Time your session, lap by lap.', bg: 'Засичай тренировката по обиколки.' },
  'dash.onIce.title': { en: 'On-ice', bg: 'На лед' },
  'dash.onIce.logged': { en: 'Saved ✨', bg: 'Запазено ✨' },
  'dash.onIce.activities': { en: 'Edges, spins, footwork, programs', bg: 'Кантове, пируети, стъпки, програми' },
  'dash.offIce.title': { en: 'Off-ice', bg: 'Извън лед' },
  'dash.offIce.activities': { en: 'Strength, flexibility, conditioning', bg: 'Сила, гъвкавост, кондиция' },
  'dash.reflect.title': { en: 'Reflect', bg: 'Рефлексия' },
  'dash.reflect.subtitle': { en: 'Deeper thoughts, when you need them.', bg: 'По-дълбоки мисли, когато ти трябват.' },
  'dash.jumpTracker.title': { en: 'Jumps', bg: 'Скокове' },
  'dash.jumpTracker.subtitle': { en: 'Log them. See the pattern.', bg: 'Записвай ги. Виж модела.' },
  'dash.dailyJournal.title': { en: 'Daily journal', bg: 'Дневник' },
  'dash.dailyJournal.subtitle': { en: 'Today, in your own words.', bg: 'Денят ти, със собствените ти думи.' },
  'dash.progress.title': { en: 'Progress', bg: 'Прогрес' },
  'dash.progress.subtitle': { en: 'See how far you’ve come.', bg: 'Виж колко път си изминала.' },
  'dash.journey.title': { en: 'Your journey', bg: 'Твоят път' },
  'dash.journey.subtitle': { en: 'The bigger picture.', bg: 'По-голямата картина.' },

  // Today summary
  'dash.todaySummary.title': { en: 'Yesterday', bg: 'Вчера' },
  'dash.todaySummary.empty': { en: 'No training yesterday — rest is part of it too.', bg: 'Вчера нямаше тренировка — и почивката е част от това.' },
  'dash.todaySummary.cta': { en: 'Want to add a sentence?', bg: 'Искаш ли да добавиш едно изречение?' },

  // Back button (in-app)
  'dash.back': { en: '← Back', bg: '← Назад' },

  // ───── Onboarding ─────
  'onb.welcome.title': { en: 'Welcome to IceNotes', bg: 'Здравей в IceNotes' },
  'onb.welcome.subtitle': { en: 'Your space for the head, the training, and the days in between.', bg: 'Твоето място за главата, за тренировките и за дните между тях.' },
  'onb.welcome.subtitle2': { en: 'Made for skaters who want to grow.', bg: 'За фигуристи, които искат да растат.' },
  'onb.welcome.nameLabel': { en: 'What should we call you?', bg: 'Как да ти казваме?' },
  'onb.welcome.namePh': { en: 'Your name', bg: 'Името ти' },
  'onb.continue': { en: 'Continue', bg: 'Продължи' },

  'onb.level.title': { en: 'How do you see yourself right now?', bg: 'Как се виждаш в момента?' },
  'onb.level.subtitle': { en: 'Not a grade — just where you are. You can change it anytime.', bg: 'Не е оценка — просто къде си сега. Можеш да го смениш по всяко време.' },

  'onb.goals.title': { en: 'What do you want to focus on?', bg: 'Върху какво искаш да се фокусираш?' },
  'onb.goals.subtitle': { en: 'This will change. That’s the point.', bg: 'Това ще се променя. Точно това е идеята.' },
  'onb.goals.mainLabel': { en: 'Main focus *', bg: 'Главен фокус *' },
  'onb.goals.mainPh': { en: 'My axel, more confidence, enjoying practice…', bg: 'Аксела, повече увереност, да ми е по-приятно…' },
  'onb.goals.feelingLabel': { en: 'What would progress feel like? (optional)', bg: 'Как би изглеждал напредъкът за теб? (по желание)' },
  'onb.goals.feelingPh': { en: 'Calmer on the ice, landing jumps more often…', bg: 'По-спокойна на леда, по-често приземявам скокове…' },

  'onb.details.title': { en: 'A bit about you', bg: 'Малко за теб' },
  'onb.details.subtitle': { en: 'Skip anything you want. Change it later.', bg: 'Пропусни каквото искаш. Сменяш по всяко време.' },
  'onb.details.age': { en: 'Age', bg: 'Възраст' },
  'onb.details.height': { en: 'Height (cm)', bg: 'Височина (см)' },
  'onb.details.weight': { en: 'Weight (kg)', bg: 'Тегло (кг)' },
  'onb.details.weight.label': { en: 'Weight', bg: 'Тегло' },
  'onb.details.weight.tender': { en: 'Only share if it actually helps you. You can hide this.', bg: 'Сподели само ако наистина ти помага. Можеш да го скриеш.' },
  'onb.details.weight.skip': { en: 'Don’t ask me again', bg: 'Не ме питай отново' },
  'onb.details.weight.show': { en: 'Show weight field', bg: 'Покажи полето за тегло' },
  'onb.details.note': { en: 'Optional. Stored privately.', bg: 'По желание. Пази се поверително.' },
  'onb.details.cta.start': { en: 'Let’s go', bg: 'Започваме' },
  'onb.details.cta.starting': { en: 'Setting up…', bg: 'Подготвяме…' },
  'onb.details.footer': { en: 'Progress, not perfection.', bg: 'Напредък, не съвършенство.' },

  'onb.toast.welcome.title': { en: 'Welcome to IceNotes 💙', bg: 'Здравей в IceNotes 💙' },
  'onb.toast.welcome.desc': { en: 'Your story starts here. One session at a time.', bg: 'Историята ти започва тук. Тренировка по тренировка.' },
  'onb.toast.error.title': { en: 'Something didn’t work', bg: 'Нещо не се получи' },
  'onb.toast.error.desc': { en: 'Couldn’t save your profile. Try again?', bg: 'Профилът не се запази. Опитай пак?' },

  // Self-levels
  'level.foundations.label': { en: 'Building foundations', bg: 'Изграждам основите' },
  'level.foundations.desc': { en: 'Learning the basics, finding my balance.', bg: 'Уча базата и намирам баланса си.' },
  'level.consistency.label': { en: 'Working on consistency', bg: 'Работя над постоянството' },
  'level.consistency.desc': { en: 'Making the skills more reliable.', bg: 'Правя елементите по-сигурни.' },
  'level.refining.label': { en: 'Polishing it', bg: 'Шлифовам' },
  'level.refining.desc': { en: 'Cleaning up technique and expression.', bg: 'Изчиствам техниката и изразяването.' },
  'level.competing.label': { en: 'Competing', bg: 'Състезавам се' },
  'level.competing.desc': { en: 'Training for or skating in competitions.', bg: 'Готвя се за състезания или вече се състезавам.' },

  // ───── 404 ─────
  'notFound.title': { en: 'Oops! Page not found', bg: 'Опа! Страницата не е намерена' },
  'notFound.return': { en: 'Return to Home', bg: 'Към началото' },

  // ───── Auth page ─────
  'auth.tagline': { en: 'Reflect. Train. Perform.', bg: 'Помисли. Тренирай. Излез.' },
  'auth.welcome': { en: 'Welcome', bg: 'Здравей' },
  'auth.welcomeSubtitle': { en: 'Your skating, in one place.', bg: 'Пързалянето ти — на едно място.' },
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
  'auth.terms': { en: 'By continuing, you’re saying yes to journaling your skating with us.', bg: 'С продължаването казваш „да“ на това да водиш дневника си тук.' },
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
  'auth.toast.welcomeBack.title': { en: 'Welcome back!', bg: 'Радваме се, че пак си тук!' },
  'auth.toast.welcomeBack.desc': { en: 'You’re in.', bg: 'Влезе.' },
  'auth.toast.signupFailed': { en: 'Signup failed', bg: 'Регистрацията не успя' },
  'auth.toast.created.title': { en: 'Account created.', bg: 'Профилът е готов.' },
  'auth.toast.created.desc': { en: 'Welcome to IceNotes', bg: 'Здравей в IceNotes' },
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
  'dash.focusNow': { en: '✨ What you’re focused on', bg: '✨ Върху какво си фокусирана' },
  'dash.footer.encourage': { en: 'Every session counts. You’re doing great. 💙', bg: 'Всяка тренировка се брои. Справяш се страхотно. 💙' },
  'dash.signout.title': { en: 'Sign out?', bg: 'Излизаш ли?' },
  'dash.signout.desc': { en: 'Your data stays safe. Come back whenever. 💙', bg: 'Данните ти остават на сигурно. Върни се, когато решиш. 💙' },
  'dash.signout.stay': { en: 'Stay signed in', bg: 'Остани' },
  'dash.signout.confirm': { en: 'Sign out', bg: 'Излез' },

  // Tone-aware journal save messages (B1)
  'journal.captured.celebratory': { en: 'Beautiful day on the ice. Hold onto this. ✨', bg: 'Прекрасен ден на леда. Запази усещането. ✨' },
  'journal.captured.neutral': { en: 'Saved. One more page in your story. 💙', bg: 'Запазено. Още една страница в историята ти. 💙' },

  // Achievements — softer streak language
  'ach.title': { en: 'Achievements', bg: 'Постижения' },
  'ach.summary.unlocked': { en: 'unlocked', bg: 'отключени' },
  'ach.keepGoing': { en: 'Keep showing up. Every entry adds up.', bg: 'Продължавай да идваш. Всеки запис се натрупва.' },
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

  // ───── Progress · Insights ─────
  'progress.insights.title': { en: 'What we’re noticing', bg: 'Какво забелязваме' },
  'progress.insights.subtitle': { en: 'A few patterns from your last days.', bg: 'Няколко модела от последните ти дни.' },
  'progress.insights.empty': { en: 'Keep logging — patterns will show up here as we get to know your rhythm.', bg: 'Продължавай да пишеш — моделите ще се появят, щом опознаем ритъма ти.' },

  'progress.section.frequency': { en: 'How often you trained', bg: 'Колко често тренира' },
  'progress.section.frequency.sub': { en: 'Sessions per day, last 14 days', bg: 'Тренировки на ден, последните 14 дни' },
  'progress.section.moodFocus': { en: 'Mood & focus', bg: 'Настроение и фокус' },
  'progress.section.moodFocus.sub': { en: 'How you’ve felt across recent entries', bg: 'Как си се чувствала в последните записи' },
  'progress.section.jumpConsistency': { en: 'Jumps over time', bg: 'Скоковете във времето' },
  'progress.section.jumpConsistency.sub': { en: 'Landing rate week by week', bg: 'Процент приземявания, седмица по седмица' },
  'progress.section.goals': { en: 'Goals', bg: 'Цели' },
  'progress.section.notes': { en: 'How much you wrote', bg: 'Колко много пишеш' },
  'progress.section.notes.sub': { en: 'Reflections per week', bg: 'Рефлексии на седмица' },

  'progress.notes.thisWeek': { en: 'This week', bg: 'Тази седмица' },
  'progress.notes.lastWeek': { en: 'Last week', bg: 'Миналата седмица' },
  'progress.notes.entries': { en: 'entries', bg: 'записа' },
  'progress.notes.entry': { en: 'entry', bg: 'запис' },

  'progress.goals.active': { en: 'Active', bg: 'Активни' },
  'progress.goals.completed': { en: 'Done', bg: 'Завършени' },
  'progress.goals.avg': { en: 'Average progress', bg: 'Среден прогрес' },
  'progress.goals.none': { en: 'No active goals — set one to start.', bg: 'Няма активни цели — задай една, за да започнеш.' },

  // Insight cards (variants)
  'progress.insight.consistency.up': {
    en: 'You trained more steadily this week.',
    bg: 'Тренира по-постоянно тази седмица.'
  },
  'progress.insight.consistency.same': {
    en: 'Same rhythm as last week — that’s consistency.',
    bg: 'Същият ритъм като миналата седмица — това е постоянство.'
  },
  'progress.insight.consistency.down': {
    en: 'Fewer sessions this week. Rest is part of the work.',
    bg: 'По-малко тренировки тази седмица. Почивката също е работа.'
  },
  'progress.insight.focusAfterRest': {
    en: 'Your focus was sharper after rest days.',
    bg: 'Фокусът ти беше по-остър след дни почивка.'
  },
  'progress.insight.moodAfterRest': {
    en: 'You felt lighter after a break.',
    bg: 'Чувстваше се по-леко след почивка.'
  },
  'progress.insight.jumpUp': {
    en: 'Your {jump} got better than last week.',
    bg: '{jump} ти върви по-добре от миналата седмица.'
  },
  'progress.insight.jumpDown': {
    en: '{jump} was harder this week. Useful to know.',
    bg: '{jump} беше по-труден тази седмица. Добре е да знаем.'
  },
  'progress.insight.jumpVolume': {
    en: 'More {jump} attempts this week — volume builds it.',
    bg: 'Повече опити за {jump} тази седмица — обемът го гради.'
  },
  'progress.insight.reflection.up': {
    en: 'You reflected more this week. Awareness grows here.',
    bg: 'Писа повече от миналата седмица. Тук расте осъзнатостта.'
  },
  'progress.insight.reflection.steady': {
    en: 'Steady reflection. Small notes add up.',
    bg: 'Постоянни рефлексии. Малките бележки се натрупват.'
  },
  'progress.insight.bestDay': {
    en: 'Your sharpest day lately was {day}.',
    bg: 'Най-фокусираният ти ден напоследък беше {day}.'
  },
  'progress.insight.streak': {
    en: '{count} days in a row. That’s real consistency.',
    bg: '{count} дни подред. Това е истинско постоянство.'
  },

  // ───── Mindfulness Tools ─────
  'mt.heading': { en: 'Mindfulness tools', bg: 'Инструменти за осъзнатост' },
  'mt.intro': {
    en: 'Short practices you can do right by the rink — before training, between elements, or before a performance.',
    bg: 'Кратки практики, които можеш да направиш до леда — преди тренировка, между елементи или преди изява.',
  },

  // Tool cards
  'mt.breathing.title': { en: '4-7-8 Breathing', bg: 'Дишане 4-7-8' },
  'mt.breathing.desc': { en: 'Calming exercise with a visual timer', bg: 'Успокояващо упражнение с визуален таймер' },
  'mt.viz.title': { en: 'Pre-performance visualization', bg: 'Визуализация преди изява' },
  'mt.viz.desc': { en: 'Guided visualization for competition', bg: 'Водена визуализация за състезание' },
  'mt.gratitude.title': { en: 'Gratitude journal', bg: 'Благодарствен дневник' },
  'mt.gratitude.desc': { en: '3 things you’re grateful for today', bg: '3 неща, за които си благодарен/а днес' },
  'mt.aff.title': { en: 'Skater affirmations', bg: 'Афирмации за пързалячи' },
  'mt.aff.desc': { en: 'Power phrases written for you', bg: 'Силови фрази, написани за теб' },

  // Breathing dialog
  'mt.breathing.subtitle': { en: 'Inhale 4s · Hold 7s · Exhale 8s', bg: 'Вдишай 4с · Задръж 7с · Издишай 8с' },
  'mt.breathing.phase.inhale': { en: 'Inhale', bg: 'Вдишай' },
  'mt.breathing.phase.hold': { en: 'Hold', bg: 'Задръж' },
  'mt.breathing.phase.exhale': { en: 'Exhale', bg: 'Издишай' },
  'mt.breathing.cycle': { en: 'Cycle: {count}', bg: 'Цикъл: {count}' },
  'mt.breathing.cycleNote': { en: '{count} cycles', bg: '{count} цикъла' },
  'mt.breathing.start': { en: 'Start', bg: 'Старт' },
  'mt.breathing.pause': { en: 'Pause', bg: 'Пауза' },
  'mt.breathing.done': { en: 'Done', bg: 'Готово' },
  'mt.breathing.toast': { en: 'Nice work — {count} cycles saved 🌬️', bg: 'Браво! {count} цикъла записани 🌬️' },

  // Visualization dialog
  'mt.viz.step': { en: 'Step {current} of {total}', bg: 'Стъпка {current} от {total}' },
  'mt.viz.eventLabel': { en: 'What event are you preparing for? (optional)', bg: 'За кое събитие се готвиш? (по избор)' },
  'mt.viz.eventPlaceholder': { en: 'e.g. Nationals', bg: 'напр. Държавно първенство' },
  'mt.viz.complete': { en: 'Done', bg: 'Готово' },
  'mt.viz.completeNote': { en: 'Visualization complete', bg: 'Завършена визуализация' },
  'mt.viz.toast': { en: 'You’re ready — carry that feeling with you 🌟', bg: 'Готов/а си — носи това чувство със себе си 🌟' },
  'mt.viz.s1': { en: 'Close your eyes and take 3 deep breaths.', bg: 'Затвори очи и направи 3 дълбоки вдишвания.' },
  'mt.viz.s2': { en: 'Picture yourself walking into the rink — feel the cold, hear the blades.', bg: 'Представи си, че влизаш в залата — усещаш студа на леда, чуваш звука на кънките.' },
  'mt.viz.s3': { en: 'See yourself in starting position — calm, focused, ready.', bg: 'Виждаш себе си в стартова позиция — спокоен/а, фокусиран/а, готов/а.' },
  'mt.viz.s4': { en: 'You skate the program flawlessly — every element comes naturally.', bg: 'Изпълняваш програмата си безупречно — всеки елемент идва естествено.' },
  'mt.viz.s5': { en: 'You feel pride and joy as you finish. The crowd cheers.', bg: 'Усещаш гордост и радост, когато завършваш. Публиката аплодира.' },
  'mt.viz.s6': { en: 'Hold onto that feeling. It’s yours — bring it onto the ice.', bg: 'Запомни това чувство. То е твое — носиш го със себе си на леда.' },

  // Gratitude dialog
  'mt.gr.subtitle': { en: 'What are 3 things you’re grateful for today?', bg: 'Кои са 3 неща, за които си благодарен/а днес?' },
  'mt.gr.label': { en: 'I’m grateful for…', bg: 'Благодарен/а съм за…' },
  'mt.gr.placeholder': { en: 'e.g. my coach, who believes in me', bg: 'напр. треньорката ми, която вярва в мен' },
  'mt.gr.empty': { en: 'Write at least one thing ✨', bg: 'Напиши поне едно нещо ✨' },
  'mt.gr.save': { en: 'Save', bg: 'Запази' },
  'mt.gr.toast': { en: 'Gratitude saved 💜', bg: 'Благодарността записана 💜' },

  // Affirmations dialog
  'mt.aff.subtitle': { en: 'Read it out loud. Feel the words.', bg: 'Прочети на глас. Усети думите.' },
  'mt.aff.save': { en: 'This one resonates with me', bg: 'Тази резонира с мен' },
  'mt.aff.toast': { en: 'That affirmation resonates ✨', bg: 'Афирмацията резонира с теб ✨' },
  'mt.aff.1': { en: 'I am strong, balanced, and confident on the ice.', bg: 'Аз съм силен/а, балансиран/а и уверен/а върху леда.' },
  'mt.aff.2': { en: 'Every jump is a chance to trust my body.', bg: 'Всеки скок е възможност да се доверя на тялото си.' },
  'mt.aff.3': { en: 'Falling is part of learning — I get up and keep going.', bg: 'Падането е част от ученето — ставам отново и продължавам.' },
  'mt.aff.4': { en: 'My ice, my moment, my pace.', bg: 'Моят лед, моят момент, моето темпо.' },
  'mt.aff.5': { en: 'I breathe, I center, I perform with ease.', bg: 'Дишам, центрирам се и изпълнявам с лекота.' },
  'mt.aff.6': { en: 'I am stronger than my doubts.', bg: 'Аз съм по-силен/а от своите съмнения.' },
  'mt.aff.7': { en: 'My training builds my future performance.', bg: 'Тренировката ми гради бъдещата ми изява.' },
  'mt.aff.8': { en: 'I’m allowed to make mistakes and grow from them.', bg: 'Имам право да правя грешки и да расна от тях.' },
  'mt.aff.9': { en: 'My body knows what to do — I trust it.', bg: 'Моето тяло знае какво да прави — доверявам му се.' },
  'mt.aff.10': { en: 'I dance with the ice, not against it.', bg: 'Аз танцувам с леда, а не срещу него.' },
};

// ───── Tone helper (B1) ─────
/** Adaptive tone classification for journal feedback. */
export type Tone = 'gentle' | 'neutral' | 'celebratory';
export const getToneForRatings = (opts: {
  emotionalState?: number | null;
  confidenceLevel?: number | null;
  focusLevel?: number | null;
}): Tone => {
  const e = opts.emotionalState ?? null;
  const c = opts.confidenceLevel ?? null;
  const f = opts.focusLevel ?? null;
  // Gentle tone: low confidence (≤4), low mood (≤3), or low energy/focus (≤3)
  if (
    (c !== null && c <= 4) ||
    (e !== null && e <= 3) ||
    (f !== null && f <= 3)
  ) {
    return 'gentle';
  }
  if ((e !== null && e >= 8) || (c !== null && c >= 8)) return 'celebratory';
  return 'neutral';
};

/** Pick a gentle message variant (0-based index) for a hard day. */
export const pickGentleVariant = (seed?: number): 0 | 1 | 2 => {
  const n = typeof seed === 'number' && Number.isFinite(seed) ? seed : Date.now();
  return (Math.abs(Math.floor(n)) % 3) as 0 | 1 | 2;
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
      const value = entry[language];
      // Strict: never silently fall back to another language. Empty BG must not
      // render English. Surface the gap loudly in dev, return key in prod so
      // QA can spot it instead of mixed-language UI.
      if (!value || value.trim() === '') {
        warnMissingKey(`${key} [${language}]`);
        return key;
      }
      return value;
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
