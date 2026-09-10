import { PHASE1_DICT } from './dictPhase1';
import { PHASE2_DICT } from './dictPhase2';
import { PHASEA_DICT } from './dictPhaseA';
import { PHASE3_DICT } from './dictPhase3';
import { PHASEB_DICT } from './dictPhaseB';
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
  'quick.reflection.kicker': { en: '2 min', bg: '2 мин' },
  'profile.language': { en: 'Language', bg: 'Език' },

  // ───── Reminders (settings dialog) ─────
  'rem.title': { en: 'Reminders', bg: 'Напомняния' },
  'rem.desc': { en: 'Gentle prompts to train and reflect.', bg: 'Тихи напомняния да тренираш и да си запишеш.' },
  'rem.unsupported': { en: 'Notifications are not supported in this browser.', bg: 'Този браузър не поддържа известия.' },
  'rem.blocked.title': { en: 'Notifications are blocked', bg: 'Известията са блокирани' },
  'rem.blocked.desc': { en: 'Enable notifications in your browser settings to receive reminders.', bg: 'Разреши известията в настройките на браузъра, за да получаваш напомняния.' },
  'rem.enable': { en: 'Enable reminders', bg: 'Включи напомнянията' },
  'rem.enableSub': { en: 'Daily notifications at times you choose.', bg: 'Всекидневни известия в избрани от теб часове.' },
  'rem.training': { en: 'Training reminder', bg: 'Напомняне за тренировка' },
  'rem.reflection': { en: 'Reflection reminder', bg: 'Напомняне за рефлексия' },
  'rem.journal': { en: 'Daily note reminder', bg: 'Напомняне за запис' },
  'rem.daily': { en: 'daily', bg: 'всеки ден' },
  'rem.next': { en: 'Next reminder:', bg: 'Следващо напомняне:' },
  'rem.today': { en: 'today', bg: 'днес' },
  'rem.tomorrow': { en: 'tomorrow', bg: 'утре' },
  'rem.at': { en: 'at', bg: 'в' },
  'rem.test': { en: 'Send a test notification', bg: 'Изпрати тестово известие' },
  'rem.foot': { en: 'Reminders only work while this page is open.', bg: 'Напомнянията работят само докато страницата е отворена.' },
  'rem.toast.on': { en: 'Reminders on', bg: 'Напомнянията са включени' },
  'rem.toast.off': { en: 'Reminders off', bg: 'Напомнянията са изключени' },
  'rem.toast.granted': { en: 'Notifications enabled', bg: 'Известията са разрешени' },
  'rem.toast.denied': { en: 'Notifications are blocked. Enable them in your browser settings.', bg: 'Известията са блокирани. Разреши ги от настройките на браузъра.' },
  'rem.toast.failed': { en: 'Could not enable notifications.', bg: 'Известията не бяха включени.' },
  'rem.toast.sent': { en: 'Test notification sent', bg: 'Тестовото известие е изпратено' },
  'rem.toast.first': { en: 'Enable notifications first.', bg: 'Първо разреши известията.' },
  'rem.n.training.title': { en: 'Time to train', bg: 'Време е за тренировка' },
  'rem.n.training.body': { en: 'On the ice or off it — your session is waiting.', bg: 'На лед или суха — тренировката те чака.' },
  'rem.n.reflection.title': { en: 'Reflection time', bg: 'Време за рефлексия' },
  'rem.n.reflection.body': { en: 'Two minutes on how today went.', bg: 'Две минути за това как мина днес.' },
  'rem.n.journal.title': { en: 'Write today down', bg: 'Запиши днешния ден' },
  'rem.n.journal.body': { en: 'Log the session and what stayed with you.', bg: 'Запиши тренировката и какво ти остана.' },
  'rem.n.test.title': { en: 'Test notification', bg: 'Тестово известие' },
  'rem.n.test.body': { en: 'Your reminders are working.', bg: 'Напомнянията ти работят.' },
  'rem.n.on.title': { en: 'Notifications enabled', bg: 'Известията са разрешени' },
  'rem.n.on.body': { en: 'You will get reminders at your chosen times.', bg: 'Ще получаваш напомняния в избраните часове.' },
  'rem.label.training': { en: 'Training', bg: 'Тренировка' },
  'rem.label.reflection': { en: 'Reflection', bg: 'Рефлексия' },
  'rem.label.journal': { en: 'Note', bg: 'Запис' },

  // ───── Avatar upload ─────
  'av.change': { en: 'Change photo', bg: 'Смени снимката' },
  'av.err.type': { en: 'Please choose an image file.', bg: 'Избери файл със снимка.' },
  'av.err.size': { en: 'The image must be under 2MB.', bg: 'Снимката трябва да е под 2MB.' },
  'av.ok': { en: 'Photo updated', bg: 'Снимката е обновена' },
  'av.err.upload': { en: 'Could not upload the photo.', bg: 'Снимката не беше качена.' },

  'profile.languageSub': { en: 'Interface and your AI Coach', bg: 'Интерфейс и AI подкрепа' },
  'nav.home': { en: 'Home', bg: 'Начало' },
  'nav.about': { en: 'About', bg: 'За нас' },
  'nav.features': { en: 'Features', bg: 'Функции' },
  'nav.howItWorks': { en: 'How It Works', bg: 'Как работи' },
  'nav.psychology': { en: 'Psychology', bg: 'Психология' },
  'nav.coach': { en: 'Coach', bg: 'Треньор' },
  'nav.contact': { en: 'Contact', bg: 'Контакти' },
  'nav.login': { en: 'Log In', bg: 'Влез' },
  'nav.getStarted': { en: 'Get Started', bg: 'Започни' },

  // ───── Hero (landing) ─────
  'hero.badge': { en: 'Made for figure skaters, by a 14-year-old figure skater', bg: 'От 14-годишна фигуристка — за фигуристи' },
  'hero.title.line1': { en: 'Your skating journey', bg: 'Пътят ти на леда' },
  'hero.title.line2.prefix': { en: 'deserves to be', bg: 'заслужава да бъде' },
  'hero.title.highlight': { en: 'remembered', bg: 'запомнен' },
  'hero.subtitle': {
    en: 'A quiet space to reflect, train, and watch yourself grow — one session at a time.',
    bg: 'Тихо място, в което да дишаш, да тренираш и да виждаш как растеш — тренировка по тренировка.',
  },
  'hero.attribution': { en: 'Created by a young figure skater and her mom 💙', bg: 'От млада фигуристка — с подкрепата на мама 💙' },
  'hero.cta': { en: 'Trust in the process', bg: 'Започни тихо' },
  'hero.disclaimer': { en: 'Free to use · Private by default · No credit card needed', bg: 'Безплатно · Лично по подразбиране · Без карта' },
  'hero.joinPrefix': { en: 'Join', bg: 'Вече сме' },
  'hero.joinSuffix.one': { en: 'skater already here', bg: 'фигурист тук' },
  'hero.joinSuffix.many': { en: 'skaters already here', bg: 'фигуристи тук' },

  // ───── Benefits ─────
  'benefit.mind.title': { en: 'A softer mind', bg: 'По-тиха глава' },
  'benefit.mind.text': { en: 'Some days the ice is loud. Find a quieter place to land.', bg: 'Има дни, в които ледът е шумен. Тук е по-тихо.' },
  'benefit.training.title': { en: 'Practice that means something', bg: 'Тренировки, които значат нещо' },
  'benefit.training.text': { en: 'Write down what mattered today. Even the falls.', bg: 'Запиши какво ти беше важно днес. И паданията се броят.' },
  'benefit.growth.title': { en: 'Proof you\'re growing', bg: 'Виждаш как растеш' },
  'benefit.growth.text': { en: 'Look back in a month and feel how far you\'ve come.', bg: 'След месец се върни назад и виж изминатия път.' },

  // ───── Social proof + steps + final CTA ─────
  'social.text': { en: 'Skaters who feel everything — finally have somewhere to put it. ⛸️', bg: 'Фигуристи, които усещат всичко — най-после имат къде да го оставят. ⛸️' },
  'social.cta': { en: 'Find your space', bg: 'Намери мястото си' },
  'steps.heading': { en: 'Three small things. Big shift.', bg: 'Три малки неща. Голяма промяна.' },
  'steps.train.title': { en: 'Skate', bg: 'Карай' },
  'steps.train.text': { en: 'Do your session — on the ice or off it.', bg: 'Изкарай тренировката — на лед или суха.' },
  'steps.reflect.title': { en: 'Write it down', bg: 'Запиши го' },
  'steps.reflect.text': { en: 'Five minutes after practice. Whatever is still in your head.', bg: 'Пет минути след тренировка. Каквото още ти се върти в главата.' },
  'steps.grow.title': { en: 'See the pattern', bg: 'Виж модела' },
  'steps.grow.text': { en: 'A month later you can see exactly what changed.', bg: 'След месец виждаш точно какво се е променило.' },
  'finalCta.heading': { en: 'There\'s a quieter way to skate.', bg: 'Има по-тих начин да караш.' },
  'finalCta.subtitle.before': { en: 'Free, private, and made with', bg: 'Безплатно, лично, направено с' },
  'finalCta.subtitle.after': { en: 'for skaters who feel deeply.', bg: 'за фигуристи, които усещат дълбоко.' },
  'finalCta.welcomeBack': { en: 'Back on the ice', bg: 'Отново на леда' },

  // ───── Landing (rebuilt hero + sections) ─────
  'seo.home.title': { en: 'SkateGoals – Reflect. Train. Perform.', bg: 'SkateGoals – Рефлексия. Тренировка. Представяне.' },
  'seo.home.desc': { en: 'A digital journaling and mental-training space for ambitious figure skaters. Track mindset, training and performance with AI support.', bg: 'Дигитален дневник и ментална подготовка за амбициозни фигуристи. Следи мислите, тренировките и представянето си с AI подкрепа.' },
  'seo.dashboard.title': { en: 'Skater Dashboard – SkateGoals', bg: 'Табло на фигуриста – SkateGoals' },
  'seo.dashboard.desc': { en: 'Your private SkateGoals dashboard: log training sessions, track jumps, journal your mindset and chat with your AI Coach.', bg: 'Личното ти пространство в SkateGoals: записвай тренировки, следи скоковете, води дневник и говори с AI подкрепа.' },
  'land.chip': { en: 'Mental training for figure skaters', bg: 'Ментална подготовка за фигуристи' },
  'land.h1.a': { en: 'A mental journal for skaters.', bg: 'Ментален дневник за фигуристи.' },
  'land.h1.b': { en: 'Built for competitive skaters.', bg: 'Създадено за състезаващи се фигуристи.' },
  'land.sub': {
    en: 'Write down how practice actually went — the jumps, the nerves, the good run-throughs. your AI Coach reads it and asks one question back.',
    bg: 'Запиши как наистина мина тренировката — скоковете, напрежението, чистите изпълнения. AI подкрепа прочита записката ти и ти задава един точен въпрос.',
  },
  'land.cta.primary': { en: 'Start free', bg: 'Започни безплатно' },
  'land.cta.secondary': { en: 'See how it works', bg: 'Виж как работи' },
  'land.trust': { en: 'Free · Private · 2 minutes to set up', bg: 'Безплатно · Лично · 2 минути за старт' },
  'land.stat.time': { en: 'min per session', bg: 'мин на тренировка' },
  'land.stat.coach': { en: 'Two AI roles: coaching for goals and planning, sport psychology for nerves and focus.', bg: 'Две AI роли: треньор за целите и плана, спортна психология за нервите и фокуса.' },
  'land.stat.private': { en: 'private by default', bg: 'лично по подразбиране' },
  'land.why.kicker': { en: 'Why skaters use it', bg: 'Защо фигуристите го ползват' },
  'land.why.title': { en: 'Head, body and ice — in one place.', bg: 'Глава, тяло и лед — на едно място.' },
  'land.inside.kicker': { en: 'Inside SkateGoals', bg: 'Вътре в SkateGoals' },
  'land.inside.title': { en: 'Not another tracker.', bg: 'Повече от дневник на тренировките.' },
  'land.inside.titleAccent': { en: 'A training log with a sport psychologist in it.', bg: 'Място, в което спортната психология е част от подготовката.' },
  'land.inside.sub': {
    en: 'Goals, session notes, jumps, mood — and your AI Coach asking what a good psychologist would ask.',
    bg: 'Цели, тренировки, скокове и настроение — плюс въпросите, които един добър спортен психолог би ти задал.',
  },
  'land.note.label': { en: "Tonight's note", bg: 'Бележка за вечерта' },
  'land.note.text': {
    en: '"Fell on the Lutz again. Got back up faster this time. That counts."',
    bg: '„Пак паднах на Лутц. Този път станах по-бързо. И това се брои.“',
  },
  'land.community.kicker': { en: 'Skaters get skaters', bg: 'Фигуристите се разбират' },
  'land.community.title': { en: "The pressure isn't yours alone.", bg: 'Напрежението не е само твое.' },
  'land.community.titleAccent': { en: 'Neither is the progress.', bg: 'Прогресът също.' },
  'land.community.sub': {
    en: 'Real skaters, real seasons — the shaky warm-ups and the nights it finally clicks.',
    bg: 'Истински фигуристи, истински сезони — треперещите загрявки и вечерите, в които най-накрая се получава.',
  },
  'land.community.share': { en: 'Share your season', bg: 'Сподели своя сезон' },
  'land.count.suffix': { en: 'skaters already here', bg: 'фигуристи вече са тук' },
  'feature.goals.title': { en: 'Goals that hold', bg: 'Цели, които можеш да следваш' },
  'feature.goals.text': { en: 'Weekly, monthly, season. Broken into the reps it actually takes.', bg: 'За седмицата, месеца или сезона — разделени на ясни, постижими стъпки.' },
  'feature.sessions.title': { en: 'Session log', bg: 'Дневник на тренировките' },
  'feature.sessions.text': { en: 'Jumps, quality, energy — logged in under two minutes.', bg: 'Скокове, качество, енергия — записани за под две минути.' },
  'feature.reflect.title': { en: 'Reflection', bg: 'Равносметка' },
  'feature.reflect.text': { en: 'Name the fear, the frustration and the small win. Entries are private by default.', bg: 'Назови страха, напрежението и малката победа. Записките са лични по подразбиране.' },
  'feature.coach.title': { en: 'your AI Coach', bg: 'AI подкрепа' },
  'feature.coach.text': { en: 'An AI sport psychologist that reads your entries and asks the right question back.', bg: 'Спортен психолог с AI, който прочита записките ти и задава точния въпрос.' },




  // ───── Feeling chips (daily journal) ─────
  'feeling.calm': { en: 'Calm', bg: 'Спокойно' },
  'feeling.focused': { en: 'Focused', bg: 'Фокус' },
  'feeling.challenging': { en: 'Challenging', bg: 'Трудно' },
  'feeling.heavy': { en: 'Heavy', bg: 'Тежко' },
  'feeling.energizing': { en: 'Energizing', bg: 'Енергия' },

  // ───── Journal — supportive microcopy ─────
  'journal.helper': { en: 'Write a lot or just a line. Both count.', bg: 'Пиши много или само ред. И двете се броят.' },
  'journal.enoughForToday': { en: 'That’s enough for today.', bg: 'Това е достатъчно за днес.' },
  'journal.saveReflection': { en: 'Save today', bg: 'Запази деня' },
  'journal.captured': { en: 'Today is saved.', bg: 'Денят е запазен.' },
  'journal.captured.gentle': { en: 'Saved 💙 Get some rest.', bg: 'Запазено 💙 Сега почивай.' },
  'journal.captured.lowDay': { en: 'Hard days count too. Be easy on yourself — tomorrow is fresh ice. 💙', bg: 'И трудните дни имат значение. Отнеси се към себе си с разбиране — утре е нов ден на леда. 💙' },
  'journal.section.daily': { en: 'Daily journal', bg: 'Дневник' },
  'journal.dateFormat': { en: 'EEEE, MMMM d', bg: 'EEEE, d MMMM' },
  'journal.workedOn.label': { en: 'What did you work on today?', bg: 'Над какво работи днес?' },
  'journal.workedOn.placeholder': { en: 'Jumps, spins, edges, just skating around…', bg: 'Скокове, пируети, ръбове, просто каране…' },
  'journal.feeling.label': { en: 'How did today feel?', bg: 'Как ти беше днес?' },
  'journal.smallWin.label': { en: 'One small thing that worked', bg: 'Едно малко нещо, което се получи' },
  'journal.smallWin.helper': { en: 'Doesn’t have to be big. Just something you noticed.', bg: 'Не трябва да е голямо. Просто нещо, което забеляза.' },
  'journal.smallWin.placeholder': { en: 'A correction worked, focus returned, a section felt more stable…', bg: 'Насока проработи, фокусът се върна, част от програмата беше по-стабилна…' },
  'journal.coachNotes.label': { en: 'What your coach said', bg: 'Какво ти каза треньорът' },
  'journal.coachNotes.optional': { en: '(if you want)', bg: '(ако искаш)' },
  'journal.coachNotes.helper': { en: 'A correction, a tip, something to remember.', bg: 'Поправка, съвет, нещо за запомняне.' },
  'journal.coachNotes.placeholder': { en: 'Arms tighter, breathe before the jump…', bg: 'По-събрани ръце, дишане преди скока…' },
  'journal.startAgain': { en: 'Tomorrow is a new page.', bg: 'Утре е нова страница.' },
  'journal.backDashboard': { en: 'Back', bg: 'Назад' },

  // Optional rating-context notes (B2)
  'journal.note.emotional': { en: 'What was behind that? (optional)', bg: 'Какво стоеше зад това? (по желание)' },
  'journal.note.confidence': { en: 'What helped — or didn’t? (optional)', bg: 'Какво ти помогна — или не? (по желание)' },
  'journal.note.focus': { en: 'What pulled your focus? (optional)', bg: 'Какво те разсейваше? (по желание)' },

  // ───── Mind Journal (Mind tab) ─────
  'mind.heading': { en: 'Mind journal', bg: 'Дневник на ума' },
  'mind.subheading': { en: 'A quiet place for the mental side.', bg: 'Тихо място за главата.' },
  'mind.tab.cbt': { en: 'Reframe', bg: 'Пренастрой' },
  'mind.tab.gratitude': { en: 'Gratitude', bg: 'Благодарност' },
  'mind.tab.body': { en: 'Body Scan', bg: 'Тяло' },
  'mind.tab.compassion': { en: 'Compassion', bg: 'Към себе си' },
  'mind.tab.precomp': { en: 'Pre-Comp', bg: 'Преди старт' },
  'mind.tab.postcomp': { en: 'Post-Comp', bg: 'След старт' },
  'mind.save': { en: 'Save entry', bg: 'Запази' },

  // CBT
  'mind.cbt.title': { en: 'Reframe a thought', bg: 'Пренастрой една мисъл' },
  'mind.cbt.desc': { en: 'Take a tough thought apart. Look at it from a calmer angle.', bg: 'Хвани трудната мисъл и я погледни отстрани — по-спокойно.' },
  'mind.cbt.situation': { en: 'What happened?', bg: 'Какво се случи?' },
  'mind.cbt.thought': { en: 'What went through your head?', bg: 'Каква мисъл ти мина?' },
  'mind.cbt.emotion': { en: 'What did you feel?', bg: 'Какво усети?' },
  'mind.cbt.intensity': { en: 'How strong was it? (1–10)', bg: 'Колко силно беше? (1–10)' },
  'mind.cbt.evidenceFor': { en: 'What backs the thought up', bg: 'Какво подкрепя мисълта' },
  'mind.cbt.evidenceAgainst': { en: 'What argues against it', bg: 'Какво говори срещу нея' },
  'mind.cbt.balanced': { en: 'A calmer way to put it', bg: 'По-спокоен начин да го кажеш' },
  'mind.cbt.newIntensity': { en: 'How strong is it now? (1–10)', bg: 'Колко силно е сега? (1–10)' },

  // Gratitude
  'mind.gratitude.title': { en: 'Three good things', bg: 'Три хубави неща' },
  'mind.gratitude.desc': { en: 'Three things from today. Small ones count.', bg: 'Три неща от днес. И малките се броят.' },
  'mind.gratitude.placeholder': { en: 'Something useful today…', bg: 'Нещо полезно от днес…' },

  // Body scan
  'mind.body.title': { en: 'Body & feeling check-in', bg: 'Тяло и усещане' },
  'mind.body.desc': { en: 'Where are you holding tension? What are you feeling?', bg: 'Къде носиш напрежение? Какво усещаш?' },
  'mind.body.tension': { en: 'Where do you feel tight?', bg: 'Къде ти е стегнато?' },
  'mind.body.overall': { en: 'How does your body feel? (1–10)', bg: 'Как е тялото? (1–10)' },
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
  'mind.compassion.desc': { en: 'When the inner critic gets loud, kindness opens space.', bg: 'Когато вътрешният критик завика, добротата отваря място.' },
  'mind.compassion.situation': { en: 'What’s hard right now?', bg: 'Какво ти е трудно сега?' },
  'mind.compassion.friend': { en: 'What would you tell a friend in this spot?', bg: 'Какво би казал на близък човек в същата ситуация?' },
  'mind.compassion.kind': { en: 'Now say something kind to yourself', bg: 'А сега кажи нещо мило на себе си' },

  // Pre-competition
  'mind.precomp.title': { en: 'Before the competition', bg: 'Преди състезанието' },
  'mind.precomp.desc': { en: 'Picture it. Breathe. Pick one thing to hold onto.', bg: 'Представи си го. Дишай. Избери едно нещо, за което да се хванеш.' },
  'mind.precomp.event': { en: 'Event name', bg: 'Състезание' },
  'mind.precomp.eventDate': { en: 'Date', bg: 'Дата' },
  'mind.precomp.visualization': { en: 'Picture your best skate — describe it', bg: 'Представи си най-доброто си каране — опиши го' },
  'mind.precomp.anchor': { en: 'Something to hold onto (a word, an image, a memory)', bg: 'Нещо, за което да се хванеш (дума, образ, спомен)' },
  'mind.precomp.breathing': { en: 'I did a breathing exercise', bg: 'Направих дихателно упражнение' },
  'mind.precomp.intention': { en: 'Today I’m skating for…', bg: 'Днес карам за…' },

  // Post-competition (B4)
  'mind.postcomp.title': { en: 'After the competition', bg: 'След състезанието' },
  'mind.postcomp.desc': {
    en: 'Three quiet questions — no matter where you placed.',
    bg: 'Три тихи въпроса — без значение как се класира.',
  },
  'mind.postcomp.didWell': { en: 'What went well today, no matter the result?', bg: 'Кое се получи днес — независимо от резултата?' },
  'mind.postcomp.surprise': { en: 'What surprised you — in the skating or in yourself?', bg: 'Кое те изненада — в карането или в самия теб?' },
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
  'common.tryAgain': { en: 'Try again', bg: 'Опитай пак' },
  'common.error': { en: 'Something didn’t work', bg: 'Нещо не се получи' },
  'common.savedHeart': { en: 'Saved 💙', bg: 'Запазено 💙' },

  // ───── Training section (marketing keys, kept) ─────
  'training.heading': { en: 'Daily Practice', bg: 'Ежедневни тренировки' },
  'training.subheading': { en: 'Track your training across all disciplines', bg: 'Следи всичко — на лед, суха тренировка и в главата' },
  'training.onIce.title': { en: 'On-Ice Training', bg: 'На лед' },
  'training.onIce.desc': { en: 'Jumps, spins, footwork, and programs', bg: 'Скокове, пируети, стъпки и програми' },
  'training.offIce.title': { en: 'Off-Ice Training', bg: 'Суха тренировка' },
  'training.offIce.desc': { en: 'Strength, flexibility, and conditioning', bg: 'Сила, гъвкавост, кондиция' },
  'training.mental.title': { en: 'Mental Preparation', bg: 'В главата' },
  'training.mental.desc': { en: 'Visualization, focus, and mindset', bg: 'Визуализация, фокус, нагласа' },
  'training.onIce.edges': { en: 'Edge work & stroking', bg: 'Ръбове и базово каране' },
  'training.onIce.spins': { en: 'Spins practice', bg: 'Пируети' },
  'training.onIce.jumps': { en: 'Jump technique', bg: 'Техника на скоковете' },
  'training.onIce.program': { en: 'Program run-through', bg: 'Прогон на програма' },
  'training.onIce.choreo': { en: 'Choreography', bg: 'Хореография' },
  'training.onIce.moves': { en: 'Moves in the Field', bg: 'Moves in the Field (базови елементи)' },
  'training.onIce.free': { en: 'Free Skate', bg: 'Свободно каране' },
  'training.offIce.warmup': { en: 'Warm-up & stretching', bg: 'Загрявка и стречинг' },
  'training.offIce.core': { en: 'Core strengthening', bg: 'Корем и кор' },
  'training.offIce.jumpSim': { en: 'Jump simulation', bg: 'Симулация на скокове' },
  'training.offIce.ballet': { en: 'Ballet & dance', bg: 'Балет и танци' },
  'training.offIce.cardio': { en: 'Cardio conditioning', bg: 'Кардио' },
  'training.offIce.strength': { en: 'Strength', bg: 'Сила' },
  'training.mental.visualization': { en: 'Program visualization', bg: 'Визуализация на програмата' },
  'training.mental.breathing': { en: 'Breathing exercises', bg: 'Дихателни упражнения' },
  'training.mental.goalReview': { en: 'Goal review', bg: 'Преглед на целите' },
  'training.mental.competition': { en: 'Competition simulation', bg: 'Симулация на старт' },
  'training.mental.affirmations': { en: 'Positive affirmations', bg: 'Афирмации' },
  'training.onIceShort': { en: 'On-Ice', bg: 'На лед' },
  'training.offIceShort': { en: 'Off-Ice', bg: 'Суха' },

  // ───── Footer ─────
  'footer.tagline': { en: 'Training, goals, competition prep and mental performance — in one place that belongs to the athlete.', bg: 'Тренировки, цели, подготовка за състезание и психическа подготовка — на едно място, което е само на състезателя.' },
  'footer.navigate': { en: 'Explore', bg: 'Разгледай' },
  'footer.product': { en: 'Product', bg: 'Продукт' },
  'footer.account': { en: 'Support', bg: 'Помощ' },
  'footer.journal': { en: 'Journal', bg: 'Дневник' },
  'footer.signup': { en: 'Join free', bg: 'Влез безплатно' },
  'footer.login': { en: 'Log in', bg: 'Влез' },
  'footer.privacy': { en: 'Privacy', bg: 'Поверителност' },
  'footer.contact': { en: 'Contact', bg: 'Контакти' },
  'footer.rights': { en: 'All rights reserved.', bg: 'Всички права запазени.' },

  // ───── About page ─────
  'about.eyebrow': { en: 'About', bg: 'За нас' },
  'about.title': { en: 'Written from experience. Built by a skater and her mom.', bg: 'Написано от личен опит. Направено от фигуристка и майка ѝ.' },
  'about.subtitle': { en: 'We made it because we missed a place to write down the real stuff after practice — no pressure, just for us.', bg: 'Създадохме го, защото ни липсваше място, където да записваме истинските неща след тренировка — без напрежение, само за нас.' },
  'about.story.title': { en: 'Our Story', bg: 'Историята накратко' },
  'about.story.lead': { en: 'It started simply: a 14-year-old skater wanted somewhere to write down how practice went — the jumps that worked, the ones that did not, and everything she was carrying off the ice. Her mom, a sport psychologist, helped turn it into an app. No big words, just the thing we were missing.', bg: 'Започна просто: 14-годишна фигуристка искаше къде да записва как е минала тренировката — кои скокове стават, кои не, и всичко, което носи извън леда. Мама ѝ, спортен психолог, помогна да стане приложение. Без големи думи — просто това, което ни липсваше.' },
  'about.story.b1': { en: 'Write it down after practice', bg: 'Запис след всяка тренировка' },
  'about.story.b2': { en: 'See what changes over a season', bg: 'Ясен поглед върху прогреса' },
  'about.story.b3': { en: 'Be steadier at competitions', bg: 'По-спокойна глава на състезания' },
  'about.mission.title': { en: 'Our Mission', bg: 'Защо го правим' },
  'about.mission.b1': { en: 'Help skaters train with intention', bg: 'За да тренираш с яснота' },
  'about.mission.b2': { en: 'Reflect with honesty', bg: 'За да си честен(на) пред себе си' },
  'about.mission.b3': { en: 'Grow with confidence', bg: 'За да растеш с увереност' },
  'about.mission.b4': { en: 'Make mental prep as valued as ice time', bg: 'За да броим главата толкова, колкото и леда' },
  'about.who.title': { en: "Who It's For", bg: 'За кого е' },
  'about.who.b1': { en: 'Beginners learning their first waltz jump', bg: 'Начинаещи с първите си елементи' },
  'about.who.b2': { en: 'Competitive skaters training for nationals', bg: 'Състезатели — от клуб до държавно' },
  'about.who.b3': { en: 'Coaches and skating families', bg: 'Треньори, родители и хората около леда' },
  'about.cta.title': { en: 'Start using SkateGoals.', bg: 'Започни със SkateGoals.' },
  'about.cta.subtitle': { en: 'Private by default. Built for training, goals and competition prep.', bg: 'Лично по подразбиране. За тренировки, цели и подготовка за старт.' },
  'about.cta.button': { en: 'Get Started Free', bg: 'Започни безплатно' },
  'about.coach.desc': { en: 'Meet the coaches behind SkateGoals', bg: 'Запознай се с хората зад SkateGoals' },

  // ───── How It Works page ─────
  'how.eyebrow': { en: 'How It Works', bg: 'Как работи' },
  'how.title': { en: 'Train, track, reflect, set the goal, prepare, reset.', bg: 'Тренирай, записвай, осмисляй, постави целта, подготви се, презареди.' },
  'how.subtitle': { en: 'One loop that connects what happens on the ice with what you decide to work on next.', bg: 'Един цикъл, който свързва случилото се на леда с това, върху което работиш след това.' },
  'how.step1.title': { en: 'Set your context', bg: 'Задай контекста си' },
  'how.step1.desc': { en: 'Name, age, category, years in skating, season goal and current focus. Only what makes the support useful.', bg: 'Име, възраст, категория, години на лед, цел за сезона и текущ фокус. Само това, което прави подкрепата полезна.' },
  'how.step2.title': { en: 'Log the session', bg: 'Запиши тренировката' },
  'how.step2.desc': { en: 'On-ice or off-ice, elements worked, duration, how it went. Under two minutes at the rink.', bg: 'Лед или суха подготовка, работени елементи, времетраене, как мина. Под две минути още на пързалката.' },
  'how.step3.title': { en: 'Reflect and choose the next focus', bg: 'Осмисли и избери следващия фокус' },
  'how.step3.desc': { en: 'What worked, what was hard, and one focus for the next training. That focus follows you to the next session.', bg: 'Какво се получи, какво беше трудно и един фокус за следващата тренировка. Той те чака на следващия лед.' },
  'how.step4.title': { en: 'Prepare and reset', bg: 'Подготви се и презареди' },
  'how.step4.desc': { en: 'Competition prep before a start, and short practical exercises for nerves, focus and getting back after a bad session.', bg: 'Подготовка преди старт и кратки практични упражнения за напрежение, фокус и връщане след слаба тренировка.' },
  'how.step5.title': { en: 'Review and adjust the goal', bg: 'Прегледай и коригирай целта' },
  'how.step5.desc': { en: 'Progress shows what your sessions and reviews actually add up to, so the season goal stays realistic.', bg: 'Прогресът показва до какво водят тренировките и прегледите ти, за да остане целта за сезона реалистична.' },
  'how.cta.title': { en: 'Ready to start?', bg: 'Искаш ли да започнем?' },
  'how.cta.subtitle': { en: 'Create your free account and start journaling after your next session.', bg: 'Направи си безплатен профил и започни да записваш още след следващата тренировка.' },
  'how.cta.button': { en: 'Create Your Free Account', bg: 'Направи безплатен профил' },

  // ───── Features page ─────
  'features.eyebrow': { en: 'Features', bg: 'Функции' },
  'features.title': { en: 'One place for training, goals and competition prep.', bg: 'Едно място за тренировки, цели и подготовка за старт.' },
  'features.subtitle': { en: 'Training log, goals, weekly review, competition prep, mental performance and progress. Element tracking is supporting context.', bg: 'Дневник на тренировките, цели, седмичен преглед, подготовка за старт, ментална подготовка и прогрес. Проследяването на елементи е допълнителен контекст.' },
  'features.cat.reflection': { en: 'Reflection', bg: 'Рефлексия' },
  'features.cat.mindset': { en: 'Mindset', bg: 'Нагласа' },
  'features.cat.performance': { en: 'Performance', bg: 'Изпълнение' },
  'features.cat.training': { en: 'Training', bg: 'Тренировка' },
  'features.cat.planning': { en: 'Planning', bg: 'Планиране' },
  'features.cat.insights': { en: 'Insights', bg: 'Прозрения' },
  'features.cat.tools': { en: 'Tools', bg: 'Инструменти' },
  'features.f1.title': { en: 'Daily Journal', bg: 'Дневен запис' },
  'features.f1.desc': { en: 'Capture what you worked on, how you felt, and your small wins after every session. Structured prompts make reflection easy and consistent.', bg: 'Записвай над какво работи, как ти беше и кои са малките победи след всяка тренировка. Подредените въпроси правят навика лесен.' },
  'features.f2.title': { en: 'Reflection Space', bg: 'Място за равносметка' },
  'features.f2.desc': { en: 'A private, free-form space for deeper thoughts about your skating journey. Process emotions, set intentions, and grow through self-awareness.', bg: 'Лично свободно място за по-дълбоки мисли. Прехвърляй емоции, задавай си намерения, опознавай се.' },
  'features.f3.title': { en: 'Mental Preparation', bg: 'Подготовка за главата' },
  'features.f3.desc': { en: 'Optional paced breathing, realistic pre-performance visualization, and short process cues.', bg: 'Дишане с удобно темпо, реалистична визуализация преди изява и кратки насоки за внимание.' },
  'features.f4.title': { en: 'Jump Tracker', bg: 'Дневник на скоковете' },
  'features.f4.desc': { en: 'Log every jump attempt with type, level, quality, and landing success. Track your consistency and see technical progress over time.', bg: 'Записвай всеки опит — вид, ниво, качество, приземяване. Виж постоянството и техническия си напредък.' },
  'features.f5.title': { en: 'On-Ice Training Log', bg: 'Дневник на леда' },
  'features.f5.desc': { en: 'Detailed session logging for edges, spins, footwork, and programs. Track duration, activities, and how each session felt.', bg: 'Подробен запис на тренировки — ръбове, пируети, стъпки, програми. Време, активности и усещане.' },
  'features.f6.title': { en: 'Off-Ice Training Log', bg: 'Дневник за суха тренировка' },
  'features.f6.desc': { en: 'Log strength, flexibility, and conditioning work. Keep your off-ice preparation as structured as your time on the ice.', bg: 'Сила, гъвкавост, кондиция. Сухата тренировка е също толкова важна, колкото леда.' },
  'features.f7.title': { en: 'Weekly Goals', bg: 'Седмични цели' },
  'features.f7.desc': { en: 'Set targets for on-ice hours, off-ice sessions, and specific jump attempts each week. Stay intentional about your development.', bg: 'Цели за часове на лед, сухи тренировки и конкретни скокове всяка седмица. Тренирай с цел.' },
  'features.f8.title': { en: 'Session Timer', bg: 'Таймер за тренировка' },
  'features.f8.desc': { en: 'Time your practice sessions with lap tracking. Stay accountable and build awareness of how you spend your ice time.', bg: 'Засичай тренировките по обиколки. Бъди наясно как ти минава времето на леда.' },
  'features.f9.title': { en: 'Progress Analytics', bg: 'Анализ на прогреса' },
  'features.f9.desc': { en: 'Activity calendars, training volume summaries, and consistency tracking. See patterns and celebrate your growth at a glance.', bg: 'Календар, обобщения и проследяване на постоянството. Виждаш моделите и празнуваш растежа с един поглед.' },
  'features.f10.title': { en: 'Journey View', bg: 'Целият път' },
  'features.f10.desc': { en: "A complete timeline of your skating development. Look back at your entries, sessions, and milestones to see how far you've come.", bg: 'Времева линия на цялото ти развитие. Връщаш се към записите, тренировките и важните моменти.' },
  'features.f11.title': { en: 'Motivational Quotes', bg: 'Цитати, които зареждат' },
  'features.f11.desc': { en: 'A curated collection of quotes for athletes. Save your favorites and get daily inspiration before you step on the ice.', bg: 'Подбрани цитати за спортисти. Запазвай любимите и взимай ежедневно вдъхновение преди лед.' },
  'features.f12.title': { en: 'PDF Export', bg: 'Експорт в PDF' },
  'features.f12.desc': { en: 'Export your training data and journal entries as a PDF. Share progress with coaches or keep it just for you.', bg: 'Изнеси тренировките и записите в PDF. Сподели с треньора или си пази личен архив.' },
  'features.cta.title': { en: 'Start using these tools today.', bg: 'Започни още днес.' },
  'features.cta.subtitle': { en: 'All features are free. No credit card needed.', bg: 'Всичко е безплатно. Без карта.' },
  'features.cta.button': { en: 'Create Your Free Account', bg: 'Направи безплатен профил' },

  // ───── Contact page ─────
  'contact.eyebrow': { en: 'Contact', bg: 'Контакти' },
  'contact.title': { en: 'Get in touch.', bg: 'Пиши ни.' },
  'contact.subtitle': { en: 'A question about the product, your account or your data? Write to us here.', bg: 'Въпрос за продукта, профила или данните ти? Пиши ни тук.' },
  'contact.form.title': { en: 'Send us a message', bg: 'Изпрати ни съобщение' },
  'contact.form.desc': { en: 'We read every message and reply as soon as we can.', bg: 'Четем всяко съобщение и отговаряме възможно най-скоро.' },
  'contact.form.name': { en: 'Name', bg: 'Име' },
  'contact.form.namePh': { en: 'Your name', bg: 'Твоето име' },
  'contact.form.email': { en: 'Email', bg: 'Имейл' },
  'contact.form.emailPh': { en: 'you@example.com', bg: 'ime@example.com' },
  'contact.form.subject': { en: 'Subject', bg: 'Тема' },
  'contact.form.subjectPh': { en: "What's this about?", bg: 'За какво пишеш?' },
  'contact.form.message': { en: 'Message', bg: 'Съобщение' },
  'contact.form.messagePh': { en: 'Tell us more...', bg: 'Разкажи ни…' },
  'contact.form.send': { en: 'Send Message', bg: 'Изпрати' },
  'contact.form.thanks': { en: 'Thank you!', bg: 'Благодарим ти!' },
  'contact.form.thanksDesc': { en: "Your message has been sent. We'll get back to you soon.", bg: 'Получихме съобщението ти. Ще се чуем скоро.' },
  'contact.form.another': { en: 'Send another message', bg: 'Изпрати ново съобщение' },
  'contact.toast.title': { en: 'Message sent!', bg: 'Съобщението е изпратено!' },
  'contact.toast.desc': { en: "We'll get back to you as soon as possible.", bg: 'Ще се свържем с теб възможно най-скоро.' },
  'contact.email.title': { en: 'How to reach us', bg: 'Как да ни намериш' },
  'contact.email.desc': { en: 'Use the form on this page — it is the channel we monitor.', bg: 'Използвай формата на тази страница — това е каналът, който следим.' },
  'contact.feedback.title': { en: 'Feedback & Ideas', bg: 'Обратна връзка и идеи' },
  'contact.feedback.desc': { en: 'Product feedback from signed-in athletes goes straight to the team on the Feedback page.', bg: 'Обратната връзка от влезли състезатели стига директно до екипа през страницата Обратна връзка.' },
  'contact.coach.text': { en: "Are you a coach? We're exploring features for coaches and their athletes. Let us know what would be most useful for your team.", bg: 'Треньор ли си? Работим върху функции за треньори и техните състезатели. Кажи ни какво ще ти е най-полезно.' },
  'contact.coach.bold': { en: 'Are you a coach?', bg: 'Треньор ли си?' },

  // ───── Sport Psychology page ─────
  'psy.eyebrow': { en: 'Sport Psychology', bg: 'Спортна психология' },
  'psy.title': { en: 'Train your mind like your body.', bg: 'Подготви ума си така, както подготвяш тялото.' },
  'psy.subtitle': { en: 'Build mental strength alongside physical skill.', bg: 'Увереността, фокусът и спокойствието се тренират — също като техниката.' },
  'psy.t1.title': { en: 'Mental Preparation', bg: 'Ментална подготовка' },
  'psy.t1.desc': { en: 'Optional paced breathing and attention cues before a session.', bg: 'Дишане с удобно темпо и насоки за внимание преди тренировка.' },
  'psy.t2.title': { en: 'Visualization', bg: 'Визуализация' },
  'psy.t2.desc': { en: 'Mentally rehearse programs, jumps, and competition scenarios.', bg: 'Премини мислено през програмата, скоковете и различни ситуации на състезание.' },
  'psy.t3.title': { en: 'Building Confidence', bg: 'Изграждане на увереност' },
  'psy.t3.desc': { en: 'Daily affirmations, small-win tracking, and structured reflection.', bg: 'Забелязвай малките победи и изграждай увереност с кратки, смислени упражнения.' },
  'psy.t4.title': { en: 'Competition Mindset', bg: 'Състезателна нагласа' },
  'psy.t4.desc': { en: 'Manage nerves, stay focused, and turn anxiety into energy.', bg: 'Разпознавай напрежението, връщай вниманието си и излизай на леда с повече спокойствие.' },
  'psy.t5.title': { en: 'Emotional Resilience', bg: 'Емоционална устойчивост' },
  'psy.t5.desc': { en: 'Process frustration, bounce back from falls, and stay motivated.', bg: 'Преминавай през разочарованието, възстановявай се след грешка и продължавай без самокритика.' },
  'psy.t6.title': { en: 'Focus & Flow State', bg: 'Фокус и състояние на поток' },
  'psy.t6.desc': { en: 'Eliminate distractions and maintain deep concentration.', bg: 'Намали разсейването и остани изцяло в изпълнението на всеки елемент.' },
  'psy.cta.title': { en: 'Start building your mental game.', bg: 'Започни да тренираш и психическата страна на спорта.' },
  'psy.cta.subtitle': { en: 'All mental training tools are included free.', bg: 'Всички упражнения за ментална подготовка са безплатни.' },
  'psy.cta.button': { en: 'Get Started Free', bg: 'Започни безплатно' },

  // ───── Today / Guided Journey ─────
  'today.tab': { en: 'Today', bg: 'Днес' },
  'today.title': { en: 'Today', bg: 'Днес' },
  'today.subtitle': { en: 'A calm path through your training day.', bg: 'Спокоен път през деня ти.' },
  'today.progress': { en: 'Step {current} of {total}', bg: 'Стъпка {current} от {total}' },
  'today.next': { en: 'Continue', bg: 'Продължи' },
  'today.back': { en: 'Back', bg: 'Назад' },
  'today.skip': { en: 'Skip for today', bg: 'Пропусни за днес' },
  'today.done.title': { en: 'You showed up today.', bg: 'Днес беше там.' },
  'today.done.subtitle': { en: 'That’s what builds a skater. Get some rest.', bg: 'И това е част от израстването. Сега си почини.' },
  'today.restart': { en: 'Start over', bg: 'Започни отново' },
  'today.stage.pre.label': { en: 'Before', bg: 'Преди' },
  'today.stage.pre.title': { en: 'Land in your body', bg: 'Влез в тялото си' },
  'today.stage.pre.desc': { en: 'Breathe, picture it, set one intention before you step on the ice.', bg: 'Дишай, представи си го, задай си едно намерение преди лед.' },
  'today.stage.training.label': { en: 'Training', bg: 'Тренировка' },
  'today.stage.training.title': { en: 'Train with focus', bg: 'Тренирай с фокус' },
  'today.stage.training.desc': { en: 'Use the timer, log the session, note your jumps when you’re ready.', bg: 'Пусни таймера, запиши тренировката и отбележи скоковете, когато решиш.' },
  'today.stage.post.label': { en: 'After', bg: 'След' },
  'today.stage.post.title': { en: 'Reflect — gently', bg: 'Запиши — спокойно' },
  'today.stage.post.desc': { en: 'What worked, what was hard, what you took away. Be easy on yourself.', bg: 'Кое се получи, кое беше трудно, какво научи. Без да се натискаш.' },
  'today.stage.grounding.label': { en: 'Grounding', bg: 'Връщане в настоящето' },
  'today.stage.grounding.title': { en: 'Come back to yourself', bg: 'Върни се при себе си' },
  'today.stage.grounding.desc': { en: 'A small gratitude, a body check, an honest read on how you feel.', bg: 'Спри за миг, усети тялото си и назови честно как си.' },
  'today.stage.weekly.label': { en: 'Weekly', bg: 'Седмично' },
  'today.stage.weekly.title': { en: 'Look back, look ahead', bg: 'Поглед назад, поглед напред' },
  'today.stage.weekly.desc': { en: 'See the patterns of the week. Pick one focus for the next.', bg: 'Виж моделите от седмицата. Избери един фокус за следващата.' },
  'today.weekly.improved': { en: 'What got better this week?', bg: 'Кое стана по-добро тази седмица?' },
  'today.weekly.patterns': { en: 'Any patterns you noticed?', bg: 'Забеляза ли модели?' },
  'today.weekly.next': { en: 'What’s your focus next week?', bg: 'Кой ти е фокусът за следващата седмица?' },
  'today.weekly.placeholder': { en: 'Just write…', bg: 'Просто пиши…' },
  'today.weekly.save': { en: 'Save the week', bg: 'Запази седмицата' },
  'today.weekly.saved': { en: 'Saved for this week 💙', bg: 'Запазено за тази седмица 💙' },

  // ───── Today: quick log (Today-first home) ─────
  'today.quick.eyebrow': { en: 'Today', bg: 'Днес' },
  'today.quick.title': { en: 'Log today in a minute', bg: 'Запиши деня за минута' },
  'today.quick.duration.label': { en: 'How long did you train?', bg: 'Колко тренира?' },
  'today.quick.duration.placeholder': { en: '60', bg: '60' },
  'today.quick.duration.unit': { en: 'minutes', bg: 'минути' },
  'today.quick.type.label': { en: 'What kind of session?', bg: 'Какъв тип тренировка?' },
  'today.quick.type.onIce': { en: 'On-ice', bg: 'На лед' },
  'today.quick.type.offIce': { en: 'Off-ice', bg: 'Суха' },
  'today.quick.type.rest': { en: 'Rest day', bg: 'Почивен ден' },
  'today.quick.focus.label': { en: 'How was your focus?', bg: 'Как беше фокусът?' },
  'today.quick.focus.low': { en: 'Scattered', bg: 'Разпилян' },
  'today.quick.focus.high': { en: 'Locked in', bg: 'Изцяло вътре' },
  'today.quick.mood.label': { en: 'Energy & mood', bg: 'Енергия и настроение' },
  'today.quick.wentWell.label': { en: 'What worked?', bg: 'Кое се получи?' },
  'today.quick.wentWell.placeholder': { en: 'A small win, a moment, a feeling…', bg: 'Малка победа, момент, усещане…' },
  'today.quick.needsWork.label': { en: 'What needs work?', bg: 'Над какво има да се работи?' },
  'today.quick.needsWork.placeholder': { en: 'Something to come back to…', bg: 'Нещо, към което да се върнеш…' },
  'today.quick.oneLine.label': { en: 'One sentence about today', bg: 'Едно изречение за днес' },
  'today.quick.oneLine.placeholder': { en: 'In a few words — how was it?', bg: 'С няколко думи — как беше?' },
  'today.quick.save': { en: 'Save today', bg: 'Запази деня' },
  'today.quick.helper': { en: 'Fill in only what feels useful. Half is fine.', bg: 'Попълни само това, което ти е полезно. И половината е окей.' },
  'today.quick.saved.title': { en: 'Today is saved. Nice work.', bg: 'Денят е запазен. Браво.' },
  'today.quick.saved.subtitle': { en: 'Come back tomorrow — or open the full journal below.', bg: 'Върни се утре — или отвори пълния дневник по-долу.' },
  'today.deeper.title': { en: 'Want to go deeper?', bg: 'Искаш ли по-надълбоко?' },
  'today.deeper.open': { en: 'Open', bg: 'Отвори' },
  'today.deeper.close': { en: 'Hide', bg: 'Скрий' },

  // ───── Today: post-save summary card ─────
  'today.summary.eyebrow': { en: 'Today', bg: 'Днес' },
  'today.summary.title': { en: 'Nicely done.', bg: 'Браво.' },
  'today.summary.title.gentle': { en: 'Saved. Be easy on yourself today.', bg: 'Запазено. Днес се отнеси към себе си с разбиране.' },
  'today.summary.title.celebratory': { en: 'What a day. Hold on to this. ✨', bg: 'Какъв ден. Запази усещането. ✨' },
  // Three rotating gentle messages for hard days (low confidence/mood/energy)
  'today.summary.gentle.0': {
    en: 'Saved. Take a breath — recovery is part of the work.',
    bg: 'Запазено. Поеми дъх — възстановяването също е работа.',
  },
  'today.summary.gentle.1': {
    en: 'Not every session has to feel strong to count.',
    bg: 'Не всяка тренировка трябва да е силна, за да се брои.',
  },
  'today.summary.gentle.2': {
    en: 'A hard day still tells you something useful.',
    bg: 'Дори трудният ден ти казва нещо полезно.',
  },
  'today.summary.minutes': { en: 'minutes', bg: 'минути' },
  'today.summary.focus': { en: 'focus', bg: 'фокус' },
  'today.summary.mood': { en: 'mood', bg: 'настроение' },
  'today.summary.elements': { en: 'What you worked on', bg: 'Над какво работи' },
  'today.summary.prompt': { en: 'Add a sentence?', bg: 'Едно изречение отгоре?' },
  'today.summary.promptPlaceholder': { en: 'A thought, a feeling, a moment from today…', bg: 'Мисъл, усещане, момент от днес…' },
  'today.summary.promptSave': { en: 'Save it', bg: 'Запази' },
  'today.summary.promptThanks': { en: 'Saved. Get some rest tonight.', bg: 'Запазено. Сега почивай.' },

  // ───── Jump type labels ─────
  // ───── Jump log: experience-based quality input ─────
  'jumpLog.quality.label': { en: 'How did it feel?', bg: 'Как се усети?' },
  'jumpLog.quality.shaky': { en: 'Shaky', bg: 'Нестабилен' },
  'jumpLog.quality.okay': { en: 'Okay', bg: 'Окей' },
  'jumpLog.quality.good': { en: 'Good', bg: 'Добър' },
  'jumpLog.quality.best': { en: 'Best one yet', bg: 'Най-добрият досега' },

  'jump.toe-loop': { en: 'Toe Loop', bg: 'Тулуп' },
  'jump.salchow': { en: 'Salchow', bg: 'Салхов' },
  'jump.loop': { en: 'Loop', bg: 'Луп' },
  'jump.flip': { en: 'Flip', bg: 'Флип' },
  'jump.lutz': { en: 'Lutz', bg: 'Лутц' },
  'jump.axel': { en: 'Axel', bg: 'Аксел' },

  // ───── App-wide common ─────
  'app.tagline': { en: 'Reflect · Train · Perform', bg: 'Дишай · Тренирай · Излез на леда' },
  'app.loadingJourney': { en: 'Loading…', bg: 'Зареждаме…' },
  'app.focusNow': { en: 'What you’re focused on right now', bg: 'Какъв е фокусът ти сега' },
  'app.everySessionCounts': { en: 'Consistency over intensity.', bg: 'Постоянството бие интензивността.' },

  // ───── Header (in-app) ─────
  'header.dailyLog': { en: 'Daily Log', bg: 'Дневен запис' },
  'header.profile': { en: 'Profile', bg: 'Профил' },
  'header.settings': { en: 'Settings', bg: 'Настройки' },
  'header.logout': { en: 'Log out', bg: 'Изход' },
  'header.signOut': { en: 'Sign out', bg: 'Изход' },
  'header.signOut.confirm.title': { en: 'Sign out?', bg: 'Излизаш ли?' },
  'header.signOut.confirm.desc': { en: 'Your data stays safe. Come back whenever. 💙', bg: 'Данните ти остават на сигурно. Върни се, когато решиш. 💙' },
  'header.signOut.confirm.stay': { en: 'Stay signed in', bg: 'Остани' },
  'header.logoutConfirm': { en: 'Sure you want to log out? Your data stays saved.', bg: 'Сигурен(на) ли си, че искаш изход? Данните остават.' },
  'header.skaterSuffix': { en: 'Skater', bg: 'Фигурист' },
  'header.reminders': { en: 'Reminders', bg: 'Напомняния' },
  'header.adminDashboard': { en: 'Admin dashboard', bg: 'Админ панел' },
  'header.reminderSettings': { en: 'Reminder Settings', bg: 'Настройки за напомняния' },

  // ───── Dashboard tabs (5-tab structure) ─────
  'dash.tab.today': { en: 'Today', bg: 'Днес' },
  'dash.tab.train': { en: 'Train', bg: 'Тренировка' },
  'dash.tab.mind': { en: 'Mind', bg: 'Психика' },
  'dash.tab.goals': { en: 'Goals', bg: 'Цели' },
  'dash.tab.progress': { en: 'Progress', bg: 'Прогрес' },

  // ───── Bottom navigation (mobile shell) ─────
  'bottomNav.home': { en: 'Home', bg: 'Начало' },
  'bottomNav.goals': { en: 'Goals', bg: 'Цели' },
  'bottomNav.training': { en: 'Training', bg: 'Тренировки' },
  'bottomNav.mind': { en: 'Mind', bg: 'Подготовка' },
  'bottomNav.journal': { en: 'Journal', bg: 'Дневник' },
  'bottomNav.profile': { en: 'Profile', bg: 'Профил' },

  // Mind sub-pills
  'dash.mind.preskate': { en: 'Pre-Skate', bg: 'Преди лед' },
  'dash.mind.journal': { en: 'Mind Journal', bg: 'Ментален дневник' },
  'dash.mind.psych': { en: 'Sport Psych', bg: 'Психология' },
  'dash.mind.inspire': { en: 'Inspiration', bg: 'Вдъхновение' },
  'dash.mind.reflect': { en: 'Reflect', bg: 'Равносметка' },

  // Goals timeframe toggle
  'dash.goals.week': { en: 'Week', bg: 'Седмица' },
  'dash.goals.month': { en: 'Month', bg: 'Месец' },
  'dash.goals.season': { en: 'Season', bg: 'Сезон' },

  // Card titles & subtitles
  'dash.weeklyGoals.title': { en: 'This week’s goals', bg: 'Цели за седмицата' },
  'dash.weeklyGoals.subtitle': { en: 'What do you want to work on?', bg: 'Над какво искаш да работиш?' },
  'dash.skatingPlan.title': { en: 'Skating plan', bg: 'Планът ти' },
  'dash.skatingPlan.subtitle': { en: 'Week, month, season — your choice.', bg: 'Седмица, месец, сезон — ти избираш.' },
  'dash.mentalPrep.title': { en: 'Mental prep', bg: 'Ментална подготовка' },
  'dash.mentalPrep.subtitle': { en: 'Settle your head before you skate.', bg: 'Успокой мислите си, преди да излезеш на леда.' },
  'dash.sportPsych.title': { en: 'Sport psychology', bg: 'Спортна психология' },
  'dash.sportPsych.subtitle': { en: 'Train the mental side too.', bg: 'Главата също се тренира.' },
  'dash.inspiration.title': { en: 'Inspiration', bg: 'Вдъхновение' },
  'dash.inspiration.subtitle': { en: 'A few words to keep you going.', bg: 'Няколко думи, които те държат.' },
  'dash.todayTraining.title': { en: 'Today’s training', bg: 'Днешната тренировка' },
  'dash.todayTraining.subtitle': { en: 'On-ice and off-ice, in one place.', bg: 'На лед и суха тренировка — на едно място.' },
  'dash.sessionTimer.title': { en: 'Session timer', bg: 'Таймер за тренировка' },
  'dash.sessionTimer.subtitle': { en: 'Time your session, lap by lap.', bg: 'Засичай тренировката по обиколки.' },
  'dash.onIce.title': { en: 'On-ice', bg: 'На лед' },
  'dash.onIce.logged': { en: 'Saved ✨', bg: 'Запазено ✨' },
  'dash.onIce.activities': { en: 'Edges, spins, footwork, programs', bg: 'Ръбове, пируети, стъпки, програми' },
  'dash.offIce.title': { en: 'Off-ice', bg: 'Суха тренировка' },
  'dash.offIce.activities': { en: 'Strength, flexibility, conditioning', bg: 'Сила, гъвкавост, кондиция' },
  'dash.reflect.title': { en: 'Reflect', bg: 'Равносметка' },
  'dash.reflect.subtitle': { en: 'Deeper thoughts, when you need them.', bg: 'По-дълбоки мисли, когато имаш нужда.' },
  'dash.jumpTracker.title': { en: 'Jumps', bg: 'Скокове' },
  'dash.jumpTracker.subtitle': { en: 'Log them. See the pattern.', bg: 'Записвай ги. Виж модела.' },
  'dash.dailyJournal.title': { en: 'Daily journal', bg: 'Дневник' },
  'dash.dailyJournal.subtitle': { en: 'Today, in your own words.', bg: 'Днес — със собствените ти думи.' },
  'dash.progress.title': { en: 'Progress', bg: 'Прогрес' },
  'dash.progress.subtitle': { en: 'See how far you’ve come.', bg: 'Виж изминатия път.' },
  'dash.journey.title': { en: 'Your progress', bg: 'Твоят път' },
  'dash.journey.subtitle': { en: 'The bigger picture.', bg: 'По-голямата картина.' },

  // Today summary
  'dash.todaySummary.title': { en: 'Yesterday', bg: 'Вчера' },
  'dash.todaySummary.empty': { en: 'No training yesterday — rest is part of it too.', bg: 'Вчера не тренира — и почивката е част от това.' },
  'dash.todaySummary.cta': { en: 'Want to add a sentence?', bg: 'Искаш ли да добавиш едно изречение?' },

  // Back button (in-app)
  'dash.back': { en: '← Back', bg: '← Назад' },

  // ───── Onboarding ─────
  'onb.welcome.title': { en: 'Welcome to SkateGoals', bg: 'Здравей в SkateGoals' },
  'onb.welcome.subtitle': { en: 'Your space for the head, the training, and the days in between.', bg: 'Място за главата, за тренировките и за дните между тях.' },
  'onb.welcome.subtitle2': { en: 'Made for skaters who want to grow.', bg: 'За фигуристи, които искат да растат.' },
  'onb.welcome.nameLabel': { en: 'What should we call you?', bg: 'Как да ти казваме?' },
  'onb.welcome.namePh': { en: 'Your name', bg: 'Името ти' },
  'onb.continue': { en: 'Continue', bg: 'Продължи' },

  'onb.level.title': { en: 'How do you see yourself right now?', bg: 'Как се виждаш в момента?' },
  'onb.level.subtitle': { en: 'Not a grade — just where you are. You can change it anytime.', bg: 'Не е оценка — просто къде си сега. Можеш да го смениш по всяко време.' },

  'onb.goals.title': { en: 'What do you want to focus on?', bg: 'Върху какво искаш да се фокусираш?' },
  'onb.goals.subtitle': { en: 'This will change. That’s the point.', bg: 'Това ще се променя. Точно това е идеята.' },
  'onb.goals.mainLabel': { en: 'Main focus *', bg: 'Главен фокус *' },
  'onb.goals.mainPh': { en: 'My axel, more confidence, enjoying practice…', bg: 'Аксела, повече увереност, да ми е по-кеф на леда…' },
  'onb.goals.feelingLabel': { en: 'What would progress feel like? (optional)', bg: 'Как би изглеждал прогресът за теб? (по желание)' },
  'onb.goals.feelingPh': { en: 'Calmer on the ice, landing jumps more often…', bg: 'По-спокойно на леда, по-често приземявам скокове…' },

  'onb.details.title': { en: 'A bit about you', bg: 'Малко за теб' },
  'onb.details.subtitle': { en: 'Skip anything you want. Change it later.', bg: 'Пропусни каквото искаш. Сменяш по всяко време.' },
  'onb.details.age': { en: 'Age', bg: 'Възраст' },
  'onb.details.height': { en: 'Height (cm)', bg: 'Височина (см)' },
  'onb.details.weight': { en: 'Weight (kg)', bg: 'Тегло (кг)' },
  'onb.details.weight.label': { en: 'Weight', bg: 'Тегло' },
  'onb.details.weight.tender': { en: 'Only share if it actually helps you. You can hide this.', bg: 'Сподели само ако ти помага. Можеш да скриеш това поле.' },
  'onb.details.weight.skip': { en: 'Don’t ask me again', bg: 'Не ме питай отново' },
  'onb.details.weight.show': { en: 'Show weight field', bg: 'Покажи полето за тегло' },
  'onb.details.note': { en: 'Optional. Stored privately.', bg: 'По желание. Пази се лично.' },
  'onb.details.cta.start': { en: 'Let’s go', bg: 'Тръгваме' },
  'onb.details.cta.starting': { en: 'Setting up…', bg: 'Подготвяме…' },
  'onb.details.footer': { en: 'Progress, not perfection.', bg: 'Прогрес, не съвършенство.' },

  'onb.toast.welcome.title': { en: 'Welcome to SkateGoals 💙', bg: 'Здравей в SkateGoals 💙' },
  'onb.toast.welcome.desc': { en: 'Your story starts here. One session at a time.', bg: 'Историята ти започва тук. Тренировка по тренировка.' },
  'onb.toast.error.title': { en: 'Something didn’t work', bg: 'Нещо не се получи' },
  'onb.toast.error.desc': { en: 'Couldn’t save your profile. Try again?', bg: 'Профилът не се запази. Опитай пак?' },

  // Self-levels
  'level.foundations.label': { en: 'Building foundations', bg: 'Изграждам основите' },
  'level.foundations.desc': { en: 'Learning the basics, finding my balance.', bg: 'Уча базата, намирам баланса си.' },
  'level.consistency.label': { en: 'Working on consistency', bg: 'Работя върху постоянството' },
  'level.consistency.desc': { en: 'Making the skills more reliable.', bg: 'Правя елементите по-сигурни.' },
  'level.refining.label': { en: 'Polishing it', bg: 'Шлифовам' },
  'level.refining.desc': { en: 'Cleaning up technique and expression.', bg: 'Изчиствам техниката и изразяването.' },
  'level.competing.label': { en: 'Competing', bg: 'Състезавам се' },
  'level.competing.desc': { en: 'Training for or skating in competitions.', bg: 'Готвя се за състезания или вече се състезавам.' },

  // ───── 404 ─────
  'notFound.title': { en: 'Oops! Page not found', bg: 'Опа! Страницата я няма' },
  'notFound.return': { en: 'Return to Home', bg: 'Към началото' },

  // ───── Auth page ─────
  'auth.tagline': { en: 'Reflect. Train. Perform.', bg: 'Дишай. Тренирай. Излез на леда.' },
  'auth.welcome': { en: 'Welcome', bg: 'Здравей' },
  'auth.welcomeSubtitle': { en: 'Your skating, in one place.', bg: 'Цялото ти каране — на едно място.' },
  'auth.tab.login': { en: 'Log In', bg: 'Влез' },
  'auth.tab.signup': { en: 'Sign Up', bg: 'Регистрация' },
  'auth.field.email': { en: 'Email', bg: 'Имейл' },
  'auth.field.password': { en: 'Password', bg: 'Парола' },
  'auth.field.name': { en: 'Name', bg: 'Име' },
  'auth.field.confirmPassword': { en: 'Confirm Password', bg: 'Потвърди паролата' },
  'auth.placeholder.email': { en: 'you@example.com', bg: 'ime@example.com' },
  'auth.placeholder.password': { en: '••••••••', bg: '••••••••' },
  'auth.placeholder.name': { en: 'Your name', bg: 'Твоето име' },
  'auth.placeholder.passwordMin': { en: 'At least 6 characters', bg: 'Поне 6 символа' },
  'auth.placeholder.confirmPassword': { en: 'Confirm your password', bg: 'Потвърди паролата' },
  'auth.forgot.link': { en: 'Forgot password?', bg: 'Забравена парола?' },
  'auth.cta.login': { en: 'Log In', bg: 'Влез' },
  'auth.cta.loggingIn': { en: 'Logging in…', bg: 'Влизаме…' },
  'auth.cta.signup': { en: 'Create Account', bg: 'Направи профил' },
  'auth.cta.creating': { en: 'Creating account…', bg: 'Правим профила…' },
  'a11y.primaryNav': { en: 'Main navigation', bg: 'Основна навигация' },
  'a11y.close': { en: 'Close', bg: 'Затвори' },
  'a11y.settings': { en: 'Settings', bg: 'Настройки' },
  'a11y.language': { en: 'Change language', bg: 'Смени езика' },
  'auth.google': { en: 'Continue with Google', bg: 'Продължи с Google' },
  'auth.connecting': { en: 'Connecting…', bg: 'Свързване…' },
  'auth.orEmail': { en: 'or with email', bg: 'или с имейл' },
  'auth.private': { en: 'Your notes stay private. Always yours.', bg: 'Записките ти остават лични. Винаги твои.' },
  'seo.auth.title': { en: 'Sign In or Sign Up – SkateGoals', bg: 'Вход или регистрация – SkateGoals' },
  'seo.auth.desc': { en: 'Log in to SkateGoals or create a free account to log training, track elements and prepare mentally.', bg: 'Влез в SkateGoals или си направи безплатен профил, за да записваш тренировки, да следиш елементите си и да се подготвяш ментално.' },
  'seo.auth.reset.title': { en: 'Reset Password – SkateGoals', bg: 'Нова парола – SkateGoals' },
  'seo.auth.reset.desc': { en: 'Set a new password for your SkateGoals account.', bg: 'Задай нова парола за профила си в SkateGoals.' },
  'seo.auth.forgot.title': { en: 'Forgot Password – SkateGoals', bg: 'Забравена парола – SkateGoals' },
  'seo.auth.forgot.desc': { en: 'Recover access to your SkateGoals account with a secure email link.', bg: 'Възстанови достъпа до профила си в SkateGoals със защитен линк по имейл.' },
  'auth.backHome': { en: 'Back to home', bg: 'Към началото' },
  'auth.terms': { en: 'By continuing, you’re saying yes to journaling your skating with us.', bg: 'С продължаването казваш „да“ — да водиш дневник за карането си тук.' },
  'auth.forgot.title': { en: 'Forgot Password', bg: 'Забравена парола' },
  'auth.forgot.descAsk': { en: "Enter your email and we'll send you a reset link", bg: 'Въведи имейла си — ще ти пратим линк за нова парола' },
  'auth.forgot.descSent': { en: 'Check your email for the reset link', bg: 'Виж в пощата си за линка за нова парола' },
  'auth.forgot.heading': { en: 'Reset your password', bg: 'Нова парола' },
  'auth.forgot.send': { en: 'Send Reset Link', bg: 'Изпрати линка' },
  'auth.forgot.sending': { en: 'Sending…', bg: 'Изпращаме…' },
  'auth.forgot.sentTo': { en: "We've sent a password reset link to", bg: 'Изпратихме линк за нова парола на' },
  'auth.forgot.checkSpam': { en: "Didn't receive the email? Check your spam folder or try again.", bg: 'Не получаваш имейл? Виж в „Спам“ или опитай пак.' },
  'auth.forgot.tryAgain': { en: 'Try again', bg: 'Опитай пак' },
  'auth.forgot.back': { en: 'Back to login', bg: 'Назад към вход' },
  'auth.reset.heading': { en: 'Set your new password', bg: 'Задай нова парола' },
  'auth.reset.title': { en: 'New Password', bg: 'Нова парола' },
  'auth.reset.desc': { en: 'Choose a strong password for your account', bg: 'Избери силна парола за профила си' },
  'auth.reset.field.new': { en: 'New Password', bg: 'Нова парола' },
  'auth.reset.field.confirm': { en: 'Confirm Password', bg: 'Потвърди паролата' },
  'auth.reset.cta': { en: 'Update Password', bg: 'Запази паролата' },
  'auth.reset.updating': { en: 'Updating…', bg: 'Запазваме…' },
  'auth.toast.missingFields.title': { en: 'Missing fields', bg: 'Липсват полета' },
  'auth.toast.missingFields.desc': { en: 'Please enter your email and password', bg: 'Въведи имейл и парола' },
  'auth.toast.missingFieldsAll.desc': { en: 'Please fill in all required fields', bg: 'Попълни всички задължителни полета' },
  'auth.toast.loginFailed': { en: 'Login failed', bg: 'Входът не успя' },
  'auth.toast.tryAgain': { en: 'Please try again.', bg: 'Опитай отново.' },
  'auth.toast.welcomeBack.title': { en: 'Welcome back!', bg: 'Радваме се, че пак си тук!' },
  'auth.toast.welcomeBack.desc': { en: 'You’re in.', bg: 'Влезе.' },
  'auth.toast.signupFailed': { en: 'Signup failed', bg: 'Регистрацията не успя' },
  'auth.toast.created.title': { en: 'Account created.', bg: 'Профилът е готов.' },
  'auth.toast.created.desc': { en: 'Welcome to SkateGoals', bg: 'Здравей в SkateGoals' },
  'auth.toast.passMismatch.title': { en: "Passwords don't match", bg: 'Паролите не съвпадат' },
  'auth.toast.passMismatch.desc': { en: 'Please make sure your passwords match', bg: 'Двете пароли трябва да са еднакви' },
  'auth.toast.passShort.title': { en: 'Password too short', bg: 'Паролата е твърде къса' },
  'auth.toast.passShort.desc': { en: 'Password must be at least 6 characters', bg: 'Паролата трябва да е поне 6 символа' },
  'auth.toast.emailRequired.title': { en: 'Email required', bg: 'Имейлът е задължителен' },
  'auth.toast.emailRequired.desc': { en: 'Please enter your email address', bg: 'Въведи имейла си' },
  'auth.toast.error': { en: 'Error', bg: 'Грешка' },
  'auth.toast.emailSent.title': { en: 'Email sent!', bg: 'Имейлът е изпратен!' },
  'auth.toast.emailSent.desc': { en: 'Check your inbox for the password reset link', bg: 'Виж в пощата си за линка за нова парола' },
  'auth.toast.passRequired.title': { en: 'Password required', bg: 'Паролата е задължителна' },
  'auth.toast.passRequired.desc': { en: 'Please enter a new password', bg: 'Въведи нова парола' },
  'auth.toast.passUpdated.title': { en: 'Password updated!', bg: 'Паролата е сменена!' },
  'auth.toast.passUpdated.desc': { en: 'Your password has been successfully changed', bg: 'Паролата ти е сменена успешно' },

  // ───── Dashboard misc (extra) ─────
  'dash.focusNow': { en: '✨ What you’re focused on', bg: '✨ Фокусът ти в момента' },
  'dash.footer.encourage': { en: 'Consistency over intensity.', bg: 'Постоянството бие интензивността.' },
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
  'ach.inProgress': { en: 'In progress', bg: 'В процес' },
  'ach.locked': { en: 'Coming up', bg: 'Предстои' },
  'ach.streak3.title': { en: 'Getting started', bg: 'Първи стъпки' },
  'ach.streak3.desc': { en: '3 days journaled this month', bg: '3 дни с дневник този месец' },
  'ach.streak7.title': { en: 'A week of reflection', bg: 'Седмица с равносметка' },
  'ach.streak7.desc': { en: '7 days journaled this month', bg: '7 дни с дневник този месец' },
  'ach.streak30.title': { en: 'Steady presence', bg: 'Постоянно присъствие' },
  'ach.streak30.desc': { en: '30 days journaled this month', bg: '30 дни с дневник този месец' },
  'ach.jumps10.title': { en: 'First flight', bg: 'Първи полет' },
  'ach.jumps10.desc': { en: 'Logged 10 jump attempts', bg: '10 записани опита за скок' },
  'ach.jumps50.title': { en: 'Jump explorer', bg: 'Изследовател на скоковете' },
  'ach.jumps50.desc': { en: 'Logged 50 jump attempts', bg: '50 записани опита за скок' },
  'ach.jumps100.title': { en: 'Century club', bg: 'Стотицата' },
  'ach.jumps100.desc': { en: 'Logged 100 jump attempts', bg: '100 записани опита за скок' },
  'ach.landed25.title': { en: 'Clean landings', bg: 'Чисти приземявания' },
  'ach.landed25.desc': { en: '25 landed jumps', bg: '25 приземени скока' },
  'ach.triple5.title': { en: 'Triple moments', bg: 'Тройни моменти' },
  'ach.triple5.desc': { en: '5 landed triple jumps', bg: '5 приземени тройни скока' },
  'ach.logs10.title': { en: 'Quiet consistency', bg: 'Тиха постоянност' },
  'ach.logs10.desc': { en: '10 daily reflections', bg: '10 дневни равносметки' },
  'ach.goals1.title': { en: 'First goal reached', bg: 'Първа достигната цел' },
  'ach.goals1.desc': { en: 'Completed your first goal', bg: 'Завърши първата си цел' },
  'ach.goals5.title': { en: 'Goals in motion', bg: 'Цели в движение' },
  'ach.goals5.desc': { en: '5 goals completed', bg: '5 завършени цели' },
  'ach.tasks20.title': { en: 'Mindful doer', bg: 'Действай осъзнато' },
  'ach.tasks20.desc': { en: '20 tasks completed', bg: '20 завършени задачи' },
  'ach.unit.days': { en: 'days', bg: 'дни' },
  'ach.unit.jumps': { en: 'jumps', bg: 'скока' },
  'ach.unit.landings': { en: 'landings', bg: 'приземявания' },
  'ach.unit.triples': { en: 'triples', bg: 'тройни' },
  'ach.unit.logs': { en: 'reflections', bg: 'равносметки' },
  'ach.unit.goal': { en: 'goal', bg: 'цел' },
  'ach.unit.goals': { en: 'goals', bg: 'цели' },
  'ach.unit.tasks': { en: 'tasks', bg: 'задачи' },

  // ───── Progress · Insights ─────
  'progress.insights.title': { en: 'What we’re noticing', bg: 'Какво забелязваме' },
  'progress.insights.subtitle': { en: 'A few patterns from your last days.', bg: 'Няколко модела от последните дни.' },
  'progress.insights.empty': { en: 'Keep logging — patterns will show up here as we get to know your rhythm.', bg: 'Продължавай да записваш — моделите ще се появят, щом опознаем ритъма ти.' },

  'progress.section.frequency': { en: 'How often you trained', bg: 'Колко често тренира' },
  'progress.section.frequency.sub': { en: 'Sessions per day, last 14 days', bg: 'Тренировки на ден, последните 14 дни' },
  'progress.section.moodFocus': { en: 'Mood & focus', bg: 'Настроение и фокус' },
  'progress.section.moodFocus.sub': { en: 'How you’ve felt across recent entries', bg: 'Как си се чувствал през последните дни' },
  'progress.section.jumpConsistency': { en: 'Jumps over time', bg: 'Скоковете във времето' },
  'progress.section.jumpConsistency.sub': { en: 'Landing rate week by week', bg: 'Процент приземявания, седмица по седмица' },
  'progress.section.goals': { en: 'Goals', bg: 'Цели' },
  'progress.section.notes': { en: 'How much you wrote', bg: 'Колко пишеш' },
  'progress.section.notes.sub': { en: 'Reflections per week', bg: 'Равносметки на седмица' },

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
    bg: 'По-малко тренировки тази седмица. И почивката е работа.'
  },
  'progress.insight.focusAfterRest': {
    en: 'Your focus was sharper after rest days.',
    bg: 'Фокусът ти беше по-остър след почивни дни.'
  },
  'progress.insight.moodAfterRest': {
    en: 'You felt lighter after a break.',
    bg: 'Чувстваше се по-леко след почивка.'
  },
  'progress.insight.jumpUp': {
    en: 'Your {jump} got better than last week.',
    bg: 'Твоят {jump} върви по-добре от миналата седмица.'
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
    bg: 'Редовна равносметка. Малките бележки се натрупват.'
  },
  'progress.insight.bestDay': {
    en: 'Your sharpest day lately was {day}.',
    bg: 'Най-фокусираният ти ден напоследък беше {day}.'
  },
  'progress.insight.streak': {
    en: '{count} days in a row. That’s real consistency.',
    bg: '{count} дни подред. Това е истинско постоянство.'
  },

  // ───── Humanized Streak ─────
  'streak.region.label': { en: 'Your consistency', bg: 'Постоянството ти' },
  'streak.active.dayOne': { en: 'day of showing up', bg: 'ден на присъствие' },
  'streak.active.dayMany': { en: 'days of showing up', bg: 'дни на присъствие' },
  'streak.active.subtitle': {
    en: 'Rest is part of training too. Your worth isn’t measured by streaks.',
    bg: 'И почивката е тренировка. Стойността ти не се мери с поредици.',
  },
  'streak.resting.title': { en: 'You showed up today', bg: 'Днес беше тук' },
  'streak.resting.subtitle': {
    en: 'Small moments still count. One page is enough.',
    bg: 'Малките моменти също се броят. Една страница е достатъчно.',
  },
  'streak.returning.title': { en: 'Welcome back', bg: 'Радваме се, че се върна' },
  'streak.returning.subtitle': {
    en: 'One difficult stretch doesn’t erase your growth. We kept your seat warm.',
    bg: 'Един труден период не изтрива растежа ти. Пазихме ти мястото топло.',
  },
  'streak.fresh.title': { en: 'Today is a fresh page', bg: 'Днес е нова страница' },
  'streak.fresh.subtitle': {
    en: 'No pressure to be consistent yet. Just begin where you are.',
    bg: 'Без натиск за постоянство още. Просто започни оттам, където си.',
  },
  'streak.paused.title': { en: 'Your streak is resting', bg: 'Поредицата ти почива' },
  'streak.paused.subtitle': {
    en: 'Paused until {date}. We’ll be here when you come back.',
    bg: 'На пауза до {date}. Ще сме тук, когато се върнеш.',
  },
  'streak.paused.subtitleOpen': {
    en: 'Take the time you need. We’ll be here when you come back.',
    bg: 'Вземи си времето, от което имаш нужда. Ще сме тук, когато се върнеш.',
  },

  'streak.action.pause':  { en: 'Pause my streak',  bg: 'Постави на пауза' },
  'streak.action.resume': { en: 'I’m ready to return', bg: 'Връщам се' },

  'streak.pause.title': { en: 'A gentle pause', bg: 'Мека пауза' },
  'streak.pause.intro': {
    en: 'Rest, recovery, exams, travel — life happens. Pausing isn’t failing. Your progress stays safe.',
    bg: 'Почивка, възстановяване, изпити, пътуване — животът се случва. Паузата не е провал. Прогресът ти остава.',
  },
  'streak.pause.reasonLabel': { en: 'What’s happening?', bg: 'Какво се случва?' },
  'streak.pause.durationLabel': { en: 'For how long?', bg: 'За колко време?' },
  'streak.pause.days': { en: 'days', bg: 'дни' },
  'streak.pause.reassurance': {
    en: 'You can come back anytime — even sooner. This is just for you.',
    bg: 'Можеш да се върнеш по всяко време — и по-рано. Това е само за теб.',
  },
  'streak.pause.cancel':  { en: 'Not now', bg: 'Не сега' },
  'streak.pause.confirm': { en: 'Pause gently', bg: 'Да, направи пауза' },

  'streak.pause.reason.injury':  { en: 'Healing', bg: 'Възстановяване' },
  'streak.pause.reason.exams':   { en: 'Exams', bg: 'Изпити' },
  'streak.pause.reason.burnout': { en: 'Burned out', bg: 'Изтощение' },
  'streak.pause.reason.travel':  { en: 'Travel / comp', bg: 'Път / състезание' },
  'streak.pause.reason.other':   { en: 'Just need space', bg: 'Имам нужда от пауза' },

  // ───── Mindfulness Tools ─────
  'mt.heading': { en: 'Quick tools', bg: 'Бързи инструменти' },
  'mt.intro': {
    en: 'Paced breathing and visualization for training or competition.',
    bg: 'Ритмично дишане и визуализация преди тренировка или старт.',
  },

  // Tool cards
  'mt.breathing.title': { en: 'Paced breathing', bg: 'Ритмично дишане' },
  'mt.breathing.desc': { en: 'Optional slower exhale with a visual timer', bg: 'По желание: по-бавно издишване с визуален таймер' },
  'mt.viz.title': { en: 'Pre-performance visualization', bg: 'Визуализация преди изява' },
  'mt.viz.desc': { en: 'Rehearse the setting, routine, and response to mistakes', bg: 'Мислена репетиция на обстановката, рутината и реакцията след грешка' },
  'mt.gratitude.title': { en: 'What supported you', bg: 'Какво ти помогна' },
  'mt.gratitude.desc': { en: 'Notice up to three useful things from today', bg: 'Отбележи до три полезни неща от днес' },
  'mt.aff.title': { en: 'Process cues', bg: 'Кратки насоки' },
  'mt.aff.desc': { en: 'Realistic phrases that direct attention', bg: 'Реалистични фрази, които насочват вниманието' },

  // Breathing dialog
  'mt.breathing.subtitle': { en: 'Breathe in for 4 · breathe out for 6 · stop if uncomfortable', bg: 'Вдишай за 4 · издишай за 6 · спри при дискомфорт' },
  'mt.breathing.phase.inhale': { en: 'Breathe in', bg: 'Вдишай' },
  'mt.breathing.phase.hold': { en: 'Hold', bg: 'Задръж' },
  'mt.breathing.phase.exhale': { en: 'Breathe out slowly', bg: 'Издишай бавно' },
  'mt.breathing.cycle': { en: 'Cycle: {count}', bg: 'Цикъл: {count}' },
  'mt.breathing.cycleNote': { en: '{count} cycles', bg: '{count} цикъла' },
  'mt.breathing.start': { en: 'Start', bg: 'Старт' },
  'mt.breathing.pause': { en: 'Pause', bg: 'Пауза' },
  'mt.breathing.done': { en: 'Done', bg: 'Готово' },
  'mt.breathing.toast': { en: '{count} breathing cycles saved.', bg: 'Записани цикли на дишане: {count}.' },

  // Visualization dialog
  'mt.viz.step': { en: 'Step {current} of {total}', bg: 'Стъпка {current} от {total}' },
  'mt.viz.eventLabel': { en: 'What event are you preparing for? (optional)', bg: 'За какво състезание се готвиш? (по желание)' },
  'mt.viz.eventPlaceholder': { en: 'e.g. Nationals', bg: 'напр. Държавно първенство' },
  'mt.viz.complete': { en: 'Done', bg: 'Готово' },
  'mt.viz.completeNote': { en: 'Visualization complete', bg: 'Завършена визуализация' },
  'mt.viz.toast': { en: 'Visualization saved.', bg: 'Визуализацията е записана.' },
  'mt.viz.s1': { en: 'Choose a comfortable position. Let your breathing stay natural.', bg: 'Заеми удобна позиция. Остави дишането естествено.' },
  'mt.viz.s2': { en: 'Picture arriving at the rink. Notice the setting, sounds, and timing.', bg: 'Представи си пристигането на пързалката. Забележи обстановката, звуците и часовете.' },
  'mt.viz.s3': { en: 'Mentally run through your familiar warm-up and pre-start routine.', bg: 'Премини мислено през познатата загрявка и рутината преди старта.' },
  'mt.viz.s4': { en: 'Picture the opening of the program and one familiar process cue.', bg: 'Представи си началото на програмата и една позната кратка насока.' },
  'mt.viz.s5': { en: 'Include a small mistake. Rehearse noticing it, resetting, and continuing.', bg: 'Включи малка грешка. Репетирай как я забелязваш, рестартираш и продължаваш.' },
  'mt.viz.s6': { en: 'Picture the finish, then name what remains under your control.', bg: 'Представи си финала, после назови какво остава под твой контрол.' },

  // Gratitude dialog
  'mt.gr.subtitle': { en: 'What supported your training or recovery today?', bg: 'Какво помогна на тренировката или възстановяването ти днес?' },
  'mt.gr.label': { en: 'Useful today…', bg: 'Полезно днес…' },
  'mt.gr.placeholder': { en: 'e.g. clear feedback from my coach', bg: 'напр. ясна обратна връзка от треньора' },
  'mt.gr.empty': { en: 'Write at least one item.', bg: 'Напиши поне едно нещо.' },
  'mt.gr.save': { en: 'Save', bg: 'Запази' },
  'mt.gr.toast': { en: 'Note saved.', bg: 'Бележката е записана.' },

  // Affirmations dialog
  'mt.aff.subtitle': { en: 'Choose one short cue that feels realistic and useful.', bg: 'Избери една кратка насока, която е реалистична и полезна.' },
  'mt.aff.save': { en: 'Save this cue', bg: 'Запиши тази насока' },
  'mt.aff.toast': { en: 'Process cue saved.', bg: 'Насоката е записана.' },
  'mt.aff.1': { en: 'One element at a time.', bg: 'Един елемент наведнъж.' },
  'mt.aff.2': { en: 'Return to the cue, not the last mistake.', bg: 'Върни се към насоката, не към последната грешка.' },
  'mt.aff.3': { en: 'Notice. Reset. Continue.', bg: 'Забележи. Рестартирай. Продължи.' },
  'mt.aff.4': { en: 'Stay with my tempo.', bg: 'Оставам в моето темпо.' },
  'mt.aff.5': { en: 'A slower exhale, then the next task.', bg: 'По-бавно издишване, после следващата задача.' },
  'mt.aff.6': { en: 'Pressure can be present; attention stays on the task.', bg: 'Напрежението може да е тук; вниманието остава в задачата.' },
  'mt.aff.7': { en: 'Use the plan I know.', bg: 'Следвам познатия план.' },
  'mt.aff.8': { en: 'A mistake is information for the next action.', bg: 'Грешката е информация за следващото действие.' },
  'mt.aff.9': { en: 'My job is the next controllable action.', bg: 'Моята задача е следващото действие под мой контрол.' },
  'mt.aff.10': { en: 'Commit to the opening, then respond to what happens.', bg: 'Изпълнявам началото, после реагирам на случващото се.' },

  // ───── Dashboard hero + continue card ─────
  'dash.hero.kicker':     { en: 'Today on the ice',  bg: 'Днес на леда' },
  'dash.hero.poetic.a':   { en: 'Breathe. Glide.',   bg: 'Дишай. Плъзни се.' },
  'dash.hero.poetic.b':   { en: 'Trust your edges.', bg: 'Довери се на ръбовете си.' },
  'dash.continue.kicker': { en: 'Continue training', bg: 'Продължи' },
  'dash.continue.body':   { en: 'Jump back into',    bg: 'Върни се към' },

  // ───── Home sections + Quick actions ─────
  'home.section.now':         { en: 'Right now',                 bg: 'Сега' },
  'home.section.now.kicker':  { en: 'Pick one · 2 min',          bg: 'Избери едно · 2 мин' },
  'home.section.more':        { en: 'More for today',            bg: 'Още за днес' },
  'home.section.more.hint':   { en: 'Stats, history & inspiration', bg: 'Статистики, история и вдъхновение' },
  'quick.reflection.label':   { en: 'Reflection',                bg: 'Рефлексия' },
  'quick.reflection.micro':   { en: 'A soft check-in',           bg: 'Тих чек-ин' },
  'quick.training.label':     { en: 'Training',                  bg: 'Тренировка' },
  'quick.training.micro':     { en: 'Warm up & step on',         bg: 'Загрей и стъпи на леда' },
  'quick.journal.label':      { en: 'Journal',                   bg: 'Дневник' },
  'quick.journal.micro':      { en: 'Write the day down',        bg: 'Запиши деня' },
  'quick.goals.label':        { en: 'Goals',                     bg: 'Цели' },
  'quick.goals.micro':        { en: 'What you’re building',      bg: 'Към какво вървиш' },
  'quick.mind.label':         { en: 'Mental prep',               bg: 'Подготовка' },
  'quick.mind.micro':         { en: 'Calm the noise',            bg: 'Утиши шума' },



  // ───── Goals section ─────
  'goalsX.heading':         { en: 'Goals',                                  bg: 'Цели' },
  'goalsX.subheading':      { en: 'Set and track your skating objectives',  bg: 'Постави си цели и виж как се сбъдват' },
  'goalsX.new':             { en: 'New Goal',                               bg: 'Нова цел' },
  'goalsX.dialog.title':    { en: 'Create New Goal',                        bg: 'Нова цел' },
  'goalsX.dialog.desc':     { en: 'Set a new objective to work towards',    bg: 'Към какво искаш да вървиш?' },
  'goalsX.field.title':     { en: 'Goal Title',                             bg: 'Заглавие на целта' },
  'goalsX.field.titlePh':   { en: 'e.g., Land a double axel',               bg: 'напр. Чист двоен аксел' },
  'goalsX.field.desc':      { en: 'Description',                            bg: 'Описание' },
  'goalsX.field.descPh':    { en: 'Describe what you want to achieve...',   bg: 'Опиши какво искаш да постигнеш...' },
  'goalsX.field.category':  { en: 'Category',                               bg: 'Категория' },
  'goalsX.cat.onIce':       { en: 'On-Ice',                                 bg: 'На леда' },
  'goalsX.cat.offIce':      { en: 'Off-Ice',                                bg: 'Суха тренировка' },
  'goalsX.cat.mental':      { en: 'Mental',                                 bg: 'Ментална' },
  'goalsX.cat.general':     { en: 'General',                                bg: 'Обща' },
  'goalsX.field.target':    { en: 'Target Date',                            bg: 'Срок' },
  'goalsX.create':          { en: 'Create Goal',                            bg: 'Запази целта' },
  'goalsX.empty.title':     { en: 'No goals yet',                           bg: 'Още нямаш цели' },
  'goalsX.empty.body':      { en: 'Create your first goal to start tracking progress', bg: 'Сложи си първата цел и започни да я следваш' },
  'goalsX.progress':        { en: 'Progress',                               bg: 'Прогрес' },
  'goalsX.target':          { en: 'Target',                                 bg: 'Срок' },

  // ───── Journey view ─────
  'journeyX.empty.title':   { en: 'This is day one', bg: 'Това е ден едно' },
  'journeyX.empty.body':    { en: 'Start with today\'s reflection. Each entry becomes part of your story.', bg: 'Започни с днешната равносметка. Всеки запис става част от историята ти.' },
  'journeyX.heading':       { en: 'Your progress',           bg: 'Пътят ти' },
  'journeyX.daysReflected': { en: 'Days reflected',           bg: 'Дни с равносметка' },
  'journeyX.daysConnected': { en: 'Days connected',           bg: 'Дни наред' },
  'journeyX.returned.a':    { en: 'You returned',             bg: 'Върна се' },
  'journeyX.returned.time': { en: 'time',                     bg: 'път' },
  'journeyX.returned.times':{ en: 'times',                    bg: 'пъти' },
  'journeyX.returned.b':    { en: 'after a break',            bg: 'след пауза' },
  'journeyX.returned.sub':  { en: 'Returning is part of the journey.', bg: 'Връщането е част от пътя.' },
  'journeyX.stayed':        { en: 'You stayed connected to your process.', bg: 'Остана близо до процеса си.' },
  'journeyX.past':          { en: 'Past Reflections',         bg: 'Минали рефлексии' },
  'journeyX.workedOn':      { en: 'Worked on',                bg: 'Работих върху' },
  'journeyX.smallWin':      { en: 'Small win',                bg: 'Малка победа' },

  // ───── Progress summary cards ─────
  'progressX.thisWeek':     { en: 'This Week',          bg: 'Тази седмица' },
  'progressX.thisMonth':    { en: 'This Month',         bg: 'Този месец' },
  'progressX.onIce':        { en: 'On-Ice',             bg: 'На леда' },
  'progressX.offIce':       { en: 'Off-Ice',            bg: 'Суха тренировка' },
  'progressX.jumpSuccess':  { en: 'Jump Success',       bg: 'Чисти скокове' },
  'progressX.journal':      { en: 'Journal',            bg: 'Дневник' },
  'progressX.sessions':     { en: 'sessions',           bg: 'тренировки' },
  'progressX.entries':      { en: 'entries',            bg: 'записа' },
  'progressX.noChange':     { en: 'No change',          bg: 'Без промяна' },
  'progressX.up':           { en: 'vs last',            bg: 'спрямо миналата' },
  'progressX.down':         { en: 'vs last',            bg: 'спрямо миналата' },
  'progressX.same':         { en: 'Same as last',       bg: 'Като миналата' },
  'progressX.suffix.week':  { en: 'week',               bg: 'седмица' },
  'progressX.suffix.month': { en: 'month',              bg: 'месец' },

  // ───── Activity calendar ─────
  'calendarX.title':        { en: 'Activity Calendar', bg: 'Календар на активността' },
  'calendarX.today':        { en: 'Today',             bg: 'Днес' },
  'calendarX.legend.jumps': { en: 'Jumps',             bg: 'Скокове' },
  'calendarX.legend.journal': { en: 'Journal',         bg: 'Дневник' },
  'calendarX.noActivity':   { en: 'No activity recorded', bg: 'Няма активност за този ден' },
  'calendarX.min':          { en: 'min',               bg: 'мин' },
  'calendarX.jumps':        { en: 'jumps',             bg: 'скокa' },
  'calendarX.landed':       { en: 'landed',            bg: 'чисти' },
  'calendarX.journalLabel': { en: 'Journal',           bg: 'Дневник' },

  // ───── Guided tour (new user) ─────
  'tour.welcome.title':  { en: 'Welcome 👋',            bg: 'Здравей 👋' },
  'tour.welcome.body':   { en: "Let's take 30 seconds to set your focus.", bg: 'Нека отделим 30 секунди, за да зададем твоя фокус.' },
  'tour.goals.title':    { en: 'What are you here for?', bg: 'За какво си тук?' },
  'tour.goals.hint':     { en: 'Pick up to 3. You can change them anytime.', bg: 'Избери до 3. Можеш да ги смениш по всяко време.' },
  'tour.goals.custom':   { en: 'Or write your own focus…', bg: 'Или напиши свой фокус…' },
  'tour.today.title':    { en: 'Your daily to-do lives here', bg: 'Дневните ти задачи са тук' },
  'tour.today.body':     { en: "Mood check-in, quick notes, and today's focus — one tap away.", bg: 'Настроение, бързи бележки и днешен фокус — на един допир.' },
  'tour.today.cta':      { en: 'Show me Today',         bg: 'Покажи ми Днес' },
  'tour.train.title':    { en: 'Track your training',   bg: 'Проследи тренировките си' },
  'tour.train.body':     { en: 'Log sessions, jumps, and timed practices in the Train tab.', bg: 'Записвай тренировки, скокове и засечени упражнения в раздел Тренировка.' },
  'tour.cta.finish':     { en: 'Start training smart',  bg: 'Започни да тренираш умно' },
  'tour.cta.skip':       { en: 'Skip',                  bg: 'Пропусни' },

  // ───── Landing extras ─────
  'landing.hero.badge':  { en: 'Built for figure skaters · Gen Z', bg: 'Създадено за фигуристи · Gen Z' },
  'landing.hero.title1': { en: 'Train smart.',          bg: 'Тренирай умно.' },
  'landing.hero.title2': { en: 'Skate from within.',    bg: 'Карай отвътре.' },
  'landing.hero.scroll': { en: 'Scroll',                bg: 'Превърти' },

  // ───── Game Day ─────
  'gameDay.title':       { en: 'Competition prep',      bg: 'Подготовка за старт' },
  'gameDay.subtitle':    { en: 'Competition is not training with an audience. Prepare for the difference.', bg: 'Състезанието не е тренировка с публика. Подготви се за разликата.' },
  'gameDay.breathe':     { en: 'Breathe',               bg: 'Дишай' },
  'gameDay.visualize':   { en: 'Visualize',             bg: 'Визуализирай' },
  'gameDay.affirm':      { en: 'Your cue',               bg: 'Твоята дума' },
  'gameDay.centered':    { en: 'Centered ✨',           bg: 'Вече си тук ✨' },

  // ───── your AI Coach ─────
  'coach.openLabel':     { en: 'Open AI skating coach', bg: 'Отвори AI подкрепа' },
  'coach.title':         { en: 'Ask your AI Coach',        bg: 'Питай AI подкрепа' },
  'coach.subtitle':      { en: 'planning · priorities · accountability', bg: 'планиране · приоритети · отчетност' },
  'coach.placeholder':   { en: "What's going on?",  bg: 'Какво се случва?' },
  'coach.greeting':      { en: "Jumps, nerves, motivation — tell me what's going on. Even if it's just \"today was hard\".", bg: 'Скокове, нерви, мотивация — кажи какво се случва. Дори да е „днес беше тежко“.' },
  'coach.tryOne':        { en: 'Try one',               bg: 'Опитай едно' },
  'coach.starter.1':     { en: 'I keep falling on my Lutz — what do I do?', bg: 'Все падам на лутца — какво да правя?' },
  'coach.starter.2':     { en: "I'm nervous about the competition this weekend", bg: 'Притеснявам се за състезанието този уикенд' },
  'coach.starter.3':     { en: 'I lost my motivation. What now?', bg: 'Изгубих мотивация. Какво сега?' },
  'coach.starter.4':     { en: 'Hype me up before practice', bg: 'Дай ми енергия преди тренировка' },
  'coach.err.rate':      { en: 'Too many requests. Try again in a minute.', bg: 'Има твърде много заявки. Опитай отново след минута.' },
  'coach.err.credits':   { en: 'AI support is temporarily unavailable.', bg: 'AI подкрепата временно не е достъпна.' },
  'coach.err.generic':   { en: 'The response did not load. Try again.', bg: 'Отговорът не се зареди. Опитай отново.' },

  // ───── Guided tour extras ─────
  'tour.quickStart':     { en: 'Quick start',           bg: 'Бърз старт' },
  'tour.of':             { en: 'of',                    bg: 'от' },
  'tour.welcome.cta':    { en: "Let's go",              bg: 'Да започваме' },
  'tour.continue':       { en: 'Continue',              bg: 'Напред' },
  'tour.today.tab':      { en: 'Today tab',             bg: 'Раздел Днес' },
  'tour.today.detail':   { en: 'Start every day with a 10-second mood tap, then add a quick log of how skating felt.', bg: 'Започни деня с 10-секундна отметка за настроение, после запиши как мина карането.' },
  'tour.focus.label':    { en: 'Your starting focus',   bg: 'Твоят начален фокус' },
  'tour.ready':          { en: 'Set. One log at a time is enough to start.', bg: 'Готово. Един запис наведнъж е достатъчен за начало.' },
  'tour.done.title':     { en: "✨ You're all set",      bg: '✨ Всичко е готово' },
  'tour.done.body':      { en: "Your first focus is saved. Start with today's log.", bg: 'Първият ти фокус е записан. Започни със записа за днес.' },
  'tour.goal.consistency': { en: 'Show up consistently', bg: 'Да идвам постоянно' },
  'tour.goal.jumps':     { en: 'Land cleaner jumps',    bg: 'По-чисти скокове' },
  'tour.goal.confidence': { en: 'Build confidence',     bg: 'Повече увереност' },
  'tour.goal.nerves':    { en: 'Manage competition nerves', bg: 'Справяне с нервите' },
  'tour.goal.spins':     { en: 'Improve spins & edges', bg: 'По-добри пируети и ръбове' },
  'tour.goal.recovery':  { en: 'Rest & recover better', bg: 'По-добра почивка' },

  // ───── Game Day extras ─────
  'gameDay.close':       { en: 'Close',                 bg: 'Затвори' },
  'gameDay.step':        { en: 'Step',                  bg: 'Стъпка' },
  'gameDay.next':        { en: 'Next',                  bg: 'Напред' },
  'gameDay.breathHint':  { en: 'Breathe in for 4 · out for 6. Stop if uncomfortable.', bg: 'Вдишай за 4 · издишай за 6. Спри при дискомфорт.' },
  'gameDay.inhale':      { en: 'Inhale',                bg: 'Вдишвай' },
  'gameDay.hold':        { en: 'Hold',                  bg: 'Задръж' },
  'gameDay.exhale':      { en: 'Exhale',                bg: 'Издишвай' },
  'gameDay.sec':         { en: 's',                     bg: 'с' },
  'gameDay.visualizeText': { en: 'Eyes closed. Step on the ice in your head and run the program once. Where does it get shaky?', bg: 'Затвори очи. Стъпи на леда наум и изкарай програмата веднъж. Къде става несигурно?' },
  'gameDay.coachName':   { en: 'Sport Psychology',      bg: 'Спортна психология' },
  'gameDay.pepTalk':     { en: "One question before you go: what will you do first if something doesn't go to plan?", bg: 'Един въпрос преди да излезеш: какво ще направиш първо, ако нещо не тръгне по план?' },
  'gameDay.letsGo':      { en: "I'm ready",              bg: 'Готово, излизам' },
  'gameDay.cardSteps':   { en: 'Breathe · Run it in your head · Pick a cue · One question', bg: 'Дишай · Изкарай я наум · Избери дума · Един въпрос' },
  'gameDay.cuePrompt':   { en: 'One word or short cue you want in your head during the program.', bg: 'Една дума или кратка команда, която искаш в главата си по време на програмата.' },
  'gameDay.cuePlaceholder': { en: 'e.g. long edges', bg: 'напр. дълги ръбове' },
  'gameDay.cueExamples': { en: 'Some skaters use:', bg: 'Някои състезатели ползват:' },
  'gameDay.askKiki':     { en: 'Continue with Sport Psychology', bg: 'Продължи със спортна психология' },

  // ───── Profile sheet ─────
  'profile.back':        { en: 'Back',                  bg: 'Назад' },
  'profile.title':       { en: 'Profile',               bg: 'Профил' },
  'profile.home':        { en: 'Home',                  bg: 'Начало' },
  'profile.focus':       { en: 'Focus',                 bg: 'Фокус' },
  'profile.settings':    { en: 'Settings',              bg: 'Настройки' },
  'profile.displayName': { en: 'Display name',           bg: 'Име в профила' },
  'profile.nameSave':    { en: 'Save',                   bg: 'Запази' },
  'profile.nameSaving':  { en: 'Saving…',                bg: 'Запазване…' },
  'profile.nameSaved':   { en: 'Display name saved',     bg: 'Името е запазено' },
  'profile.nameError':   { en: 'Could not save the name', bg: 'Името не беше запазено' },
  'profile.reminders':   { en: 'Reminders',             bg: 'Напомняния' },
  'profile.remindersSub': { en: 'Training and review reminders', bg: 'Напомняния за тренировки и прегледи' },
  'profile.admin':       { en: 'Admin Dashboard',       bg: 'Админ панел' },
  'profile.adminSub':    { en: 'Manage users & content', bg: 'Управление на потребители и съдържание' },
  'profile.explore':     { en: 'Explore',               bg: 'Разгледай' },
  'profile.landing':     { en: 'Back to landing page',  bg: 'Към началната страница' },
  'profile.landingSub':  { en: 'Exit the app view',     bg: 'Излез от приложението' },
  'profile.logout':      { en: 'Log out',               bg: 'Изход' },
  ...PHASE1_DICT,
  ...PHASE2_DICT,
  ...PHASEA_DICT,
  ...PHASE3_DICT,
  ...PHASEB_DICT,
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
  // English is the default everywhere. Bulgarian only when the visitor picks it
  // from the language switcher (their choice is remembered).
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  return 'en';
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
