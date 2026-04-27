import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Language = 'en' | 'bg';

export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'bg', label: 'Bulgarian', nativeLabel: 'Български' },
];

// Each entry must have `en`. Other languages are optional and fall back to EN.
type Entry = { en: string } & Partial<Record<Language, string>>;
type Dict = Record<string, Entry>;

const dict: Dict = {
  // Navbar
  'nav.home': { en: 'Home', bg: 'Начало', tr: 'Ana Sayfa', de: 'Start' },
  'nav.about': { en: 'About', bg: 'За нас', tr: 'Hakkımızda', de: 'Über uns' },
  'nav.features': { en: 'Features', bg: 'Функции', tr: 'Özellikler', de: 'Funktionen' },
  'nav.howItWorks': { en: 'How It Works', bg: 'Как работи', tr: 'Nasıl Çalışır', de: 'So funktioniert es' },
  'nav.psychology': { en: 'Psychology', bg: 'Спортна психология', tr: 'Psikoloji', de: 'Psychologie' },
  'nav.coach': { en: 'Coach', bg: 'Треньор', tr: 'Antrenör', de: 'Trainer' },
  'nav.contact': { en: 'Contact', bg: 'Контакт', tr: 'İletişim', de: 'Kontakt' },
  'nav.login': { en: 'Log In', bg: 'Вход', tr: 'Giriş Yap', de: 'Anmelden' },
  'nav.getStarted': { en: 'Get Started', bg: 'Започни', tr: 'Başla', de: 'Loslegen' },

  // Hero
  'hero.badge': { en: 'Made for figure skaters, by a figure skater', bg: 'Създадено за фигуристи, от фигуристка', tr: 'Bir artistik patenci tarafından, artistik patenciler için', de: 'Von einer Eiskunstläuferin, für Eiskunstläufer' },
  'hero.title.line1': { en: 'Your skating journey', bg: 'Твоят път в пързалянето', tr: 'Patenciliğindeki yolculuk', de: 'Deine Reise auf dem Eis' },
  'hero.title.line2.prefix': { en: 'deserves to be', bg: 'заслужава да бъде', tr: 'hatırlanmayı', de: 'verdient es,' },
  'hero.title.highlight': { en: 'remembered', bg: 'запомнен', tr: 'hak ediyor', de: 'in Erinnerung zu bleiben' },
  'hero.subtitle': {
    en: 'A cozy space to reflect, track your progress, and grow as an athlete — one session at a time.',
    bg: 'Уютно място за рефлексия, проследяване на прогреса и растеж като спортист — една тренировка наведнъж.',
    tr: 'Düşünmek, gelişimini takip etmek ve sporcu olarak büyümek için sıcak bir alan — antrenman antrenman.',
    de: 'Ein gemütlicher Ort, um zu reflektieren, deinen Fortschritt zu verfolgen und als Sportlerin zu wachsen — Training für Training.',
  },
  'hero.attribution': { en: 'Created by a young figure skater and her mom 💙', bg: 'Създадено от млада фигуристка и нейната майка 💙', tr: 'Genç bir artistik patenci ve annesi tarafından yaratıldı 💙', de: 'Erstellt von einer jungen Eiskunstläuferin und ihrer Mama 💙' },
  'hero.cta': { en: 'Start Your Journey', bg: 'Започни своя път', tr: 'Yolculuğuna Başla', de: 'Starte deine Reise' },
  'hero.disclaimer': { en: '100% free · Always private · No credit card needed', bg: '100% безплатно · Винаги поверително · Без банкова карта', tr: '%100 ücretsiz · Her zaman özel · Kredi kartı gerekmez', de: '100% kostenlos · Immer privat · Keine Kreditkarte nötig' },
  'hero.joinPrefix': { en: 'Join', bg: 'Присъедини се към', tr: 'Katıl —', de: 'Schließ dich' },
  'hero.joinSuffix.one': { en: 'skater already here', bg: 'фигурист, който вече е тук', tr: 'patenci şimdiden burada', de: 'Skater ist schon hier' },
  'hero.joinSuffix.many': { en: 'skaters already here', bg: 'фигуристи, които вече са тук', tr: 'patenci şimdiden burada', de: 'Skatern an, die schon hier sind' },

  // Benefits
  'benefit.mind.title': { en: 'Strengthen Your Mind', bg: 'Укрепи ума си', tr: 'Zihnini Güçlendir', de: 'Stärke deinen Kopf' },
  'benefit.mind.text': { en: 'Build confidence and mental resilience through structured reflection.', bg: 'Изгради увереност и психическа издръжливост чрез структурирана рефлексия.', tr: 'Düzenli iç gözlemle özgüven ve zihinsel dayanıklılık geliştir.', de: 'Baue Selbstvertrauen und mentale Stärke durch strukturierte Reflexion auf.' },
  'benefit.training.title': { en: 'Track Your Training', bg: 'Проследявай тренировките', tr: 'Antrenmanını Takip Et', de: 'Verfolge dein Training' },
  'benefit.training.text': { en: 'Log sessions, jumps, and goals. Train with clear intention.', bg: 'Записвай тренировки, скокове и цели. Тренирай с ясно намерение.', tr: 'Antrenmanlarını, sıçramalarını ve hedeflerini kaydet. Net bir niyetle çalış.', de: 'Halte Einheiten, Sprünge und Ziele fest. Trainiere mit klarer Absicht.' },
  'benefit.growth.title': { en: 'See Your Growth', bg: 'Виж своя растеж', tr: 'Gelişimini Gör', de: 'Sieh dein Wachstum' },
  'benefit.growth.text': { en: 'Spot patterns and celebrate wins over weeks and months.', bg: 'Забелязвай тенденции и празнувай победи в седмиците и месеците.', tr: 'Haftalar ve aylar içinde örüntüleri fark et, kazanımlarını kutla.', de: 'Erkenne Muster und feiere Erfolge über Wochen und Monate.' },

  // Social proof + steps + final CTA
  'social.text': { en: 'Skaters are already reflecting, training smarter, and growing with IceNotes every day ⛸️', bg: 'Фигуристи вече рефлектират, тренират по-умно и растат с IceNotes всеки ден ⛸️', tr: 'Patenciler her gün IceNotes ile düşünüyor, daha akıllı çalışıyor ve gelişiyor ⛸️', de: 'Skater reflektieren, trainieren klüger und wachsen jeden Tag mit IceNotes ⛸️' },
  'social.cta': { en: 'Join IceNotes', bg: 'Присъедини се към IceNotes', tr: "IceNotes'a Katıl", de: 'IceNotes beitreten' },
  'steps.heading': { en: 'Simple as 1-2-3 ✨', bg: 'Просто като 1-2-3 ✨', tr: '1-2-3 kadar basit ✨', de: 'So einfach wie 1-2-3 ✨' },
  'steps.train.title': { en: 'Train', bg: 'Тренирай', tr: 'Çalış', de: 'Trainieren' },
  'steps.train.text': { en: 'Practice as usual — on or off ice.', bg: 'Тренирай както обикновено — на лед или извън него.', tr: 'Her zamanki gibi çalış — buzda ya da buz dışında.', de: 'Trainiere wie gewohnt — auf oder neben dem Eis.' },
  'steps.reflect.title': { en: 'Reflect', bg: 'Рефлектирай', tr: 'Düşün', de: 'Reflektieren' },
  'steps.reflect.text': { en: '5 quiet minutes to write it down.', bg: '5 спокойни минути, за да го запишеш.', tr: 'Yazmak için 5 sakin dakika.', de: '5 ruhige Minuten zum Aufschreiben.' },
  'steps.grow.title': { en: 'Grow', bg: 'Развивай се', tr: 'Geliş', de: 'Wachsen' },
  'steps.grow.text': { en: 'Watch your confidence bloom.', bg: 'Виж как увереността ти разцъфтява.', tr: 'Özgüveninin çiçeklendiğini gör.', de: 'Beobachte, wie dein Selbstvertrauen wächst.' },
  'finalCta.heading': { en: 'Ready to grow as a skater?', bg: 'Готов/а ли си да израснеш като фигурист?', tr: 'Bir patenci olarak gelişmeye hazır mısın?', de: 'Bereit, als Skater zu wachsen?' },
  'finalCta.subtitle.before': { en: 'Free, private, and built with', bg: 'Безплатно, поверително и създадено с', tr: 'Ücretsiz, özel ve şu sevgiyle yapıldı:', de: 'Kostenlos, privat und gebaut mit' },
  'finalCta.subtitle.after': { en: 'for this beautiful sport.', bg: 'за този прекрасен спорт.', tr: 'bu güzel spor için.', de: 'für diesen wunderschönen Sport.' },
  'finalCta.welcomeBack': { en: 'Welcome Back', bg: 'Добре дошъл обратно', tr: 'Tekrar Hoş Geldin', de: 'Willkommen zurück' },

  // Feeling options (journal mood selector)
  'feeling.calm': { en: 'Calm', bg: 'Спокоен', tr: 'Sakin', de: 'Ruhig' },
  'feeling.focused': { en: 'Focused', bg: 'Фокусиран', tr: 'Odaklı', de: 'Fokussiert' },
  'feeling.challenging': { en: 'Challenging', bg: 'Предизвикателен', tr: 'Zorlu', de: 'Herausfordernd' },
  'feeling.heavy': { en: 'Heavy', bg: 'Тежък', tr: 'Ağır', de: 'Schwer' },
  'feeling.energizing': { en: 'Energizing', bg: 'Енергичен', tr: 'Enerjik', de: 'Belebend' },

  // Journal — partial input / supportive microcopy
  'journal.helper': {
    en: 'Write as much or as little as you want.',
    bg: 'Напиши толкова, колкото искаш.',
    ru: 'Пиши столько, сколько хочешь.',
    it: 'Scrivi quanto vuoi, anche poco.',
    fr: "Écris autant ou aussi peu que tu veux.",
    tr: 'İstediğin kadar yaz — az ya da çok.',
    de: 'Schreib so viel oder so wenig du möchtest.',
  },
  'journal.enoughForToday': {
    en: "That's enough for today.",
    bg: 'Това е достатъчно за днес.',
    ru: 'На сегодня этого достаточно.',
    it: 'Per oggi è abbastanza.',
    fr: "C'est assez pour aujourd'hui.",
    tr: 'Bugün için bu kadarı yeterli.',
    de: 'Für heute ist das genug.',
  },
  'journal.saveReflection': {
    en: "Save today's reflection",
    bg: 'Запази днешната рефлексия',
    ru: 'Сохранить сегодняшнюю рефлексию',
    it: 'Salva la riflessione di oggi',
    fr: "Enregistrer la réflexion d'aujourd'hui",
    tr: 'Bugünün notunu kaydet',
    de: 'Heutige Reflexion speichern',
  },
  'journal.captured': {
    en: "Today's reflection captured",
    bg: 'Днешната рефлексия е запазена',
    ru: 'Сегодняшняя рефлексия записана',
    it: 'Riflessione di oggi salvata',
    fr: "Réflexion d'aujourd'hui enregistrée",
    tr: 'Bugünün notu kaydedildi',
    de: 'Heutige Reflexion gespeichert',
  },

  // Mind Journal (psychologist-informed)
  'mind.heading': { en: 'Mind Journal', bg: 'Психологически дневник' },
  'mind.subheading': { en: 'Tools to support your mental training', bg: 'Инструменти за подкрепа на психичната тренировка' },
  'mind.tab.cbt': { en: 'Reframe', bg: 'Пренастрой' },
  'mind.tab.gratitude': { en: 'Gratitude', bg: 'Благодарност' },
  'mind.tab.body': { en: 'Body Scan', bg: 'Скан на тялото' },
  'mind.tab.compassion': { en: 'Compassion', bg: 'Съчувствие' },
  'mind.tab.precomp': { en: 'Pre-Comp', bg: 'Преди старт' },
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
  'mind.body.title': { en: 'Body scan & emotion check-in', bg: 'Скан на тялото и емоции' },
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
  'body.hips': { en: 'Hips', bg: 'Ханш' },
  'body.legs': { en: 'Legs', bg: 'Крака' },
  'body.feet': { en: 'Feet', bg: 'Стъпала' },

  // Self-compassion
  'mind.compassion.title': { en: 'Speak to yourself like a friend', bg: 'Говори си като на приятел' },
  'mind.compassion.desc': { en: 'When the inner critic gets loud, kindness creates space.', bg: 'Когато вътрешният критик се обажда, добротата създава пространство.' },
  'mind.compassion.situation': { en: 'What are you struggling with?', bg: 'С какво се бориш?' },
  'mind.compassion.friend': { en: 'What would you say to a friend in this situation?', bg: 'Какво би казал/а на приятел в тази ситуация?' },
  'mind.compassion.kind': { en: 'A kind message to yourself', bg: 'Мило послание към себе си' },

  // Pre-competition
  'mind.precomp.title': { en: 'Pre-competition mental routine', bg: 'Психологична настройка преди състезание' },
  'mind.precomp.desc': { en: 'Visualize success, breathe, and set your intention.', bg: 'Визуализирай успех, дишай и задай намерение.' },
  'mind.precomp.event': { en: 'Event name', bg: 'Име на състезанието' },
  'mind.precomp.eventDate': { en: 'Event date', bg: 'Дата на състезанието' },
  'mind.precomp.visualization': { en: 'Visualize your best skate — describe it', bg: 'Визуализирай най-доброто си пързаляне — опиши го' },
  'mind.precomp.anchor': { en: 'Confidence anchor (a phrase, image, or memory)', bg: 'Котва на увереността (фраза, образ или спомен)' },
  'mind.precomp.breathing': { en: 'I completed a breathing exercise', bg: 'Направих дихателно упражнение' },
  'mind.precomp.intention': { en: 'My intention today is…', bg: 'Моето намерение днес е…' },

  // Common
  'common.optional': { en: 'optional', bg: 'по желание' },
  'common.add': { en: 'Add', bg: 'Добави' },
  'common.remove': { en: 'Remove', bg: 'Премахни' },
  // Training section
  'training.heading': { en: 'Daily Practice', bg: 'Ежедневна тренировка' },
  'training.subheading': { en: 'Track your training across all disciplines', bg: 'Проследявай тренировките си във всички дисциплини' },
  'training.onIce.title': { en: 'On-Ice Training', bg: 'На лед — Тренировка' },
  'training.onIce.desc': { en: 'Jumps, spins, footwork, and programs', bg: 'Скокове, пирети, стъпки и програми' },
  'training.offIce.title': { en: 'Off-Ice Training', bg: 'Извън лед — Тренировка' },
  'training.offIce.desc': { en: 'Strength, flexibility, and conditioning', bg: 'Сила, гъвкавост и кондиция' },
  'training.mental.title': { en: 'Mental Preparation', bg: 'Психологична подготовка' },
  'training.mental.desc': { en: 'Visualization, focus, and mindset', bg: 'Визуализация, фокус и нагласа' },

  // On-ice activities
  'training.onIce.edges': { en: 'Edge work & stroking', bg: 'Кантове и свободно' },
  'training.onIce.spins': { en: 'Spins practice', bg: 'Пирети' },
  'training.onIce.jumps': { en: 'Jump technique', bg: 'Техника на скоковете' },
  'training.onIce.program': { en: 'Program run-through', bg: 'Прогон на програма' },
  'training.onIce.choreo': { en: 'Choreography', bg: 'Хореография' },
  'training.onIce.moves': { en: 'Moves in the Field', bg: 'Движения в полето' },
  'training.onIce.free': { en: 'Free Skate', bg: 'Свободно пързаляне' },

  // Off-ice activities
  'training.offIce.warmup': { en: 'Warm-up & stretching', bg: 'Загряване и разтягане' },
  'training.offIce.core': { en: 'Core strengthening', bg: 'Сила на корпуса' },
  'training.offIce.jumpSim': { en: 'Jump simulation', bg: 'Симулация на скокове' },
  'training.offIce.ballet': { en: 'Ballet & dance', bg: 'Балет и танци' },
  'training.offIce.cardio': { en: 'Cardio conditioning', bg: 'Кардио кондиция' },
  'training.offIce.strength': { en: 'Strength', bg: 'Сила' },

  // Mental activities
  'training.mental.visualization': { en: 'Program visualization', bg: 'Визуализация на програма' },
  'training.mental.breathing': { en: 'Breathing exercises', bg: 'Дихателни упражнения' },
  'training.mental.goalReview': { en: 'Goal review', bg: 'Преглед на целите' },
  'training.mental.competition': { en: 'Competition simulation', bg: 'Симулация на състезание' },
  'training.mental.affirmations': { en: 'Positive affirmations', bg: 'Позитивни утвърждения' },

  // Common training labels
  'training.onIceShort': { en: 'On-Ice', bg: 'На лед' },
  'training.offIceShort': { en: 'Off-Ice', bg: 'Извън лед' },

  // Footer
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

  // ── About page ──
  'about.eyebrow': { en: 'About', bg: 'За нас' },
  'about.title': { en: 'Built by skaters, for skaters.', bg: 'Създадено от фигуристи. За фигуристи.' },
  'about.subtitle': {
    en: 'A private space to reflect, train intentionally, and grow — on and off the ice.',
    bg: 'Лично пространство, в което рефлектираш, тренираш с цел и растеш — на леда и извън него.',
  },
  'about.story.title': { en: 'Our Story', bg: 'Нашата история' },
  'about.story.lead': {
    en: 'Created by a young figure skater and her mom who saw a gap: skaters often struggle not from lack of talent, but lack of tools.',
    bg: 'Създадохме IceNotes заедно — млада фигуристка и нейната майка. Видяхме нещо просто, но важно: на повечето състезатели не им липсва талант, а инструменти, с които да го развиват спокойно и последователно.',
  },
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
  'about.cta.subtitle': {
    en: 'Free forever. Private by default. Made with love for skating.',
    bg: 'Безплатно завинаги. Поверително по подразбиране. Създадено с обич към фигурното пързаляне.',
  },
  'about.cta.button': { en: 'Get Started Free', bg: 'Започни безплатно' },
  'about.coach.desc': { en: 'Meet the coaches behind IceNotes', bg: 'Запознай се с треньорите зад IceNotes' },

  // ── How It Works page ──
  'how.eyebrow': { en: 'How It Works', bg: 'Как работи' },
  'how.title': { en: 'Five steps to smarter training.', bg: 'Пет стъпки към по-осъзната тренировка.' },
  'how.subtitle': {
    en: "IceNotes is designed to fit naturally into your skating routine. Here's how it works.",
    bg: 'IceNotes се вписва естествено в твоето ежедневие на леда. Ето как:',
  },
  'how.step1.title': { en: 'Create Your Free Account', bg: 'Създай безплатен профил' },
  'how.step1.desc': {
    en: 'Sign up in under two minutes. Tell us your name, how you see yourself as a skater, and what you want to focus on. No credit card required.',
    bg: 'Регистрацията отнема под две минути. Сподели как се виждаш като фигурист и върху какво искаш да работиш. Без банкова карта.',
  },
  'how.step2.title': { en: 'Reflect After Every Session', bg: 'Рефлектирай след всяка тренировка' },
  'how.step2.desc': {
    en: 'Use the daily journal to capture what you worked on, how you felt, and your small wins. Structured prompts help you build the habit of self-reflection.',
    bg: 'В дневника записваш върху какво работи, как се чувстваше и кои бяха малките победи. Подредените въпроси ти помагат да изградиш навика да се вслушваш в себе си.',
  },
  'how.step3.title': { en: 'Track Your Training & Jumps', bg: 'Проследявай тренировки и скокове' },
  'how.step3.desc': {
    en: 'Log on-ice and off-ice sessions with detail. Track jump attempts, landing rates, and technical progress. Set weekly goals to keep your training intentional.',
    bg: 'Записвай тренировките на лед и извън него с подробности. Следи опитите за скокове, успешните приземявания и техническия напредък. Поставяй седмични цели, за да тренираш с фокус.',
  },
  'how.step4.title': { en: 'Develop Your Mental Game', bg: 'Развивай психичната си игра' },
  'how.step4.desc': {
    en: 'Use pre-skate breathing exercises, guided visualizations, and daily affirmations. Build the emotional resilience that separates good skaters from great ones.',
    bg: 'Използвай дихателни упражнения преди тренировка, водени визуализации и ежедневни утвърждения. Това е емоционалната устойчивост, която отличава добрите фигуристи от великите.',
  },
  'how.step5.title': { en: 'See Your Growth Over Time', bg: 'Виж как растеш с времето' },
  'how.step5.desc': {
    en: "Activity calendars, progress summaries, and consistency analytics help you identify patterns and celebrate how far you've come.",
    bg: 'Календар на активността, обобщения и анализ на постоянството ти показват тенденциите и колко път вече си изминал/а.',
  },
  'how.cta.title': { en: 'Ready to start?', bg: 'Готов/а да започнеш?' },
  'how.cta.subtitle': {
    en: 'Create your free account and start journaling after your next session.',
    bg: 'Създай безплатен профил и започни да водиш дневник още след следващата си тренировка.',
  },
  'how.cta.button': { en: 'Create Your Free Account', bg: 'Създай безплатен профил' },

  // ── Features page ──
  'features.eyebrow': { en: 'Features', bg: 'Функции' },
  'features.title': { en: 'Everything you need to train with intention.', bg: 'Всичко, от което имаш нужда, за да тренираш с цел.' },
  'features.subtitle': {
    en: 'Purpose-built tools for structured reflection, tracking, and growth.',
    bg: 'Инструменти, създадени специално за подредена рефлексия, проследяване и растеж.',
  },
  'features.cat.reflection': { en: 'Reflection', bg: 'Рефлексия' },
  'features.cat.mindset': { en: 'Mindset', bg: 'Нагласа' },
  'features.cat.performance': { en: 'Performance', bg: 'Изпълнение' },
  'features.cat.training': { en: 'Training', bg: 'Тренировка' },
  'features.cat.planning': { en: 'Planning', bg: 'Планиране' },
  'features.cat.insights': { en: 'Insights', bg: 'Прозрения' },
  'features.cat.tools': { en: 'Tools', bg: 'Инструменти' },
  'features.f1.title': { en: 'Daily Journal', bg: 'Ежедневен дневник' },
  'features.f1.desc': {
    en: 'Capture what you worked on, how you felt, and your small wins after every session. Structured prompts make reflection easy and consistent.',
    bg: 'Записвай върху какво работи, как се чувстваше и кои бяха малките победи след всяка тренировка. Подредени въпроси правят рефлексията лесна и постоянна.',
  },
  'features.f2.title': { en: 'Reflection Space', bg: 'Пространство за рефлексия' },
  'features.f2.desc': {
    en: 'A private, free-form space for deeper thoughts about your skating journey. Process emotions, set intentions, and grow through self-awareness.',
    bg: 'Лично, свободно пространство за по-дълбоки мисли по пътя ти в пързалянето. Прехвърляй емоции, задавай намерения и растеш чрез себепознание.',
  },
  'features.f3.title': { en: 'Mental Preparation', bg: 'Психична подготовка' },
  'features.f3.desc': {
    en: 'Pre-skate breathing exercises (Box, 4-7-8, Energizing), guided visualizations for programs and confidence, and daily affirmations.',
    bg: 'Дихателни упражнения преди лед (Кутия, 4-7-8, Енергизиращо), водени визуализации за програми и увереност, и ежедневни утвърждения.',
  },
  'features.f4.title': { en: 'Jump Tracker', bg: 'Дневник на скоковете' },
  'features.f4.desc': {
    en: 'Log every jump attempt with type, level, quality, and landing success. Track your consistency and see technical progress over time.',
    bg: 'Записвай всеки опит за скок — вид, ниво, качество и приземяване. Виж постоянството си и техническия напредък във времето.',
  },
  'features.f5.title': { en: 'On-Ice Training Log', bg: 'Дневник на тренировките на лед' },
  'features.f5.desc': {
    en: 'Detailed session logging for edges, spins, footwork, and programs. Track duration, activities, and how each session felt.',
    bg: 'Подробен запис на тренировки — кантове, пирети, стъпки и програми. Проследявай продължителност, активности и усещане от всяка сесия.',
  },
  'features.f6.title': { en: 'Off-Ice Training Log', bg: 'Дневник на тренировките извън лед' },
  'features.f6.desc': {
    en: 'Log strength, flexibility, and conditioning work. Keep your off-ice preparation as structured as your time on the ice.',
    bg: 'Записвай силова, гъвкавост и кондиционна работа. Подготовката извън лед е също толкова важна, колкото времето на леда.',
  },
  'features.f7.title': { en: 'Weekly Goals', bg: 'Седмични цели' },
  'features.f7.desc': {
    en: 'Set targets for on-ice hours, off-ice sessions, and specific jump attempts each week. Stay intentional about your development.',
    bg: 'Задавай цели за часове на лед, тренировки извън лед и конкретни скокове всяка седмица. Развивай се с яснота.',
  },
  'features.f8.title': { en: 'Session Timer', bg: 'Таймер за тренировка' },
  'features.f8.desc': {
    en: 'Time your practice sessions with lap tracking. Stay accountable and build awareness of how you spend your ice time.',
    bg: 'Засичай тренировките си с отделни обиколки. Бъди наясно как използваш времето си на леда.',
  },
  'features.f9.title': { en: 'Progress Analytics', bg: 'Анализ на прогреса' },
  'features.f9.desc': {
    en: 'Activity calendars, training volume summaries, and consistency tracking. See patterns and celebrate your growth at a glance.',
    bg: 'Календар на активността, обобщение на обема и проследяване на постоянството. Виждаш тенденциите и празнуваш растежа с един поглед.',
  },
  'features.f10.title': { en: 'Journey View', bg: 'Изглед на пътя' },
  'features.f10.desc': {
    en: "A complete timeline of your skating development. Look back at your entries, sessions, and milestones to see how far you've come.",
    bg: 'Цялостна времева линия на твоето развитие. Връщаш се към записите, тренировките и важните моменти и виждаш колко път си изминал/а.',
  },
  'features.f11.title': { en: 'Motivational Quotes', bg: 'Мотивиращи цитати' },
  'features.f11.desc': {
    en: 'A curated collection of quotes for athletes. Save your favorites and get daily inspiration before you step on the ice.',
    bg: 'Подбрана колекция от цитати за спортисти. Запази любимите си и получавай ежедневно вдъхновение преди да стъпиш на леда.',
  },
  'features.f12.title': { en: 'PDF Export', bg: 'Експорт в PDF' },
  'features.f12.desc': {
    en: 'Export your training data and journal entries as a PDF. Share progress with coaches or keep a personal archive of your journey.',
    bg: 'Изнеси тренировките и записите си в PDF. Сподели прогреса с треньора или си запази личен архив на пътя.',
  },
  'features.cta.title': { en: 'Start using these tools today.', bg: 'Започни да използваш тези инструменти още днес.' },
  'features.cta.subtitle': { en: 'All features are free. No credit card needed.', bg: 'Всички функции са безплатни. Без банкова карта.' },
  'features.cta.button': { en: 'Create Your Free Account', bg: 'Създай безплатен профил' },

  // ── Contact page ──
  'contact.eyebrow': { en: 'Contact', bg: 'Контакт' },
  'contact.title': { en: 'Get in touch.', bg: 'Свържи се с нас.' },
  'contact.subtitle': {
    en: "Have a question, suggestion, or feedback? We'd love to hear from you.",
    bg: 'Имаш въпрос, идея или обратна връзка? С удоволствие ще те чуем.',
  },
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
  'contact.feedback.desc': {
    en: 'IceNotes is built for skaters, by people who care about skating. Your feedback directly shapes the product.',
    bg: 'IceNotes е създаден за фигуристите от хора, на които пързалянето им е на сърцето. Твоето мнение пряко оформя продукта.',
  },
  'contact.coach.text': {
    en: "Are you a coach? We're exploring features for coaches and their athletes. Let us know what would be most useful for your team.",
    bg: 'Треньор ли си? Разработваме нови функции за треньори и техните състезатели. Сподели какво би ти било най-полезно.',
  },
  'contact.coach.bold': { en: 'Are you a coach?', bg: 'Треньор ли си?' },

  // ── Sport Psychology page ──
  'psy.eyebrow': { en: 'Sport Psychology', bg: 'Спортна психология' },
  'psy.title': { en: 'Train your mind like your body.', bg: 'Тренирай ума така, както тренираш тялото.' },
  'psy.subtitle': { en: 'Build mental strength alongside physical skill.', bg: 'Изгради психична сила паралелно с техническото умение.' },
  'psy.t1.title': { en: 'Mental Preparation', bg: 'Психична подготовка' },
  'psy.t1.desc': {
    en: 'Box breathing, 4-7-8 technique, and energizing breathwork before every session.',
    bg: 'Дишане по квадрат, техника 4-7-8 и енергизиращо дишане преди всяка тренировка.',
  },
  'psy.t2.title': { en: 'Visualization', bg: 'Визуализация' },
  'psy.t2.desc': {
    en: 'Mentally rehearse programs, jumps, and competition scenarios.',
    bg: 'Мислено повтаряй програми, скокове и състезателни сценарии.',
  },
  'psy.t3.title': { en: 'Building Confidence', bg: 'Изграждане на увереност' },
  'psy.t3.desc': {
    en: 'Daily affirmations, small-win tracking, and structured reflection.',
    bg: 'Ежедневни утвърждения, проследяване на малките победи и подредена рефлексия.',
  },
  'psy.t4.title': { en: 'Competition Mindset', bg: 'Състезателна нагласа' },
  'psy.t4.desc': {
    en: 'Manage nerves, stay focused, and turn anxiety into energy.',
    bg: 'Управлявай вълнението, остани фокусиран/а и превърни тревогата в енергия.',
  },
  'psy.t5.title': { en: 'Emotional Resilience', bg: 'Емоционална устойчивост' },
  'psy.t5.desc': {
    en: 'Process frustration, bounce back from falls, and stay motivated.',
    bg: 'Преработвай разочарованието, ставай след падане и пази мотивацията си жива.',
  },
  'psy.t6.title': { en: 'Focus & Flow State', bg: 'Фокус и състояние на поток' },
  'psy.t6.desc': {
    en: 'Eliminate distractions and maintain deep concentration.',
    bg: 'Премахни разсейването и задръж дълбока концентрация.',
  },
  'psy.cta.title': { en: 'Start building your mental game.', bg: 'Започни да изграждаш психичната си игра.' },
  'psy.cta.subtitle': { en: 'All mental training tools are included free.', bg: 'Всички инструменти за психична тренировка са безплатни.' },
  'psy.cta.button': { en: 'Get Started Free', bg: 'Започни безплатно' },

  // Today / Guided Journey
  'today.tab': { en: 'Today', bg: 'Днес' },
  'today.title': { en: "Today's Journey", bg: 'Дневен ритуал' },
  'today.subtitle': {
    en: 'A calm, guided path through your training day.',
    bg: 'Спокоен, направляван път през тренировъчния ти ден.',
  },
  'today.progress': { en: 'Step {current} of {total}', bg: 'Стъпка {current} от {total}' },
  'today.next': { en: 'Continue', bg: 'Продължи' },
  'today.back': { en: 'Back', bg: 'Назад' },
  'today.skip': { en: 'Skip for today', bg: 'Пропусни за днес' },
  'today.done.title': { en: 'You showed up today.', bg: 'Беше тук днес.' },
  'today.done.subtitle': {
    en: 'That is what builds a skater. Rest well.',
    bg: 'Точно това гради фигурист. Почивай добре.',
  },
  'today.restart': { en: 'Start again', bg: 'Започни отново' },

  'today.stage.pre.label': { en: 'Pre-training', bg: 'Преди тренировка' },
  'today.stage.pre.title': { en: 'Arrive in your body', bg: 'Влез в тялото си' },
  'today.stage.pre.desc': {
    en: 'Breathe, visualize, and set an intention before you step on the ice.',
    bg: 'Поеми въздух, визуализирай и постави намерение, преди да стъпиш на леда.',
  },

  'today.stage.training.label': { en: 'Training', bg: 'Тренировка' },
  'today.stage.training.title': { en: 'Train with focus', bg: 'Тренирай с фокус' },
  'today.stage.training.desc': {
    en: 'Use the timer, log your session, and track your jumps when you are ready.',
    bg: 'Използвай таймера, запиши сесията и отбележи скоковете си, когато си готов/а.',
  },

  'today.stage.post.label': { en: 'Post-training', bg: 'След тренировка' },
  'today.stage.post.title': { en: 'Reflect with kindness', bg: 'Рефлектирай с добрина' },
  'today.stage.post.desc': {
    en: 'What went well, what was hard, what you learned — then a softer view of yourself.',
    bg: 'Какво се получи, какво беше трудно, какво научи — и след това по-меко отношение към себе си.',
  },

  'today.stage.grounding.label': { en: 'Daily grounding', bg: 'Заземяване' },
  'today.stage.grounding.title': { en: 'Land back into yourself', bg: 'Върни се към себе си' },
  'today.stage.grounding.desc': {
    en: 'Gratitude, a body scan, and a quiet check-in with how you really feel.',
    bg: 'Благодарност, скан на тялото и тих разговор с това как наистина се чувстваш.',
  },

  'today.stage.weekly.label': { en: 'Weekly review', bg: 'Седмичен преглед' },
  'today.stage.weekly.title': { en: 'Look back, look ahead', bg: 'Поглед назад и напред' },
  'today.stage.weekly.desc': {
    en: 'Notice the patterns of the week and choose your focus for the next one.',
    bg: 'Забележи моделите от седмицата и избери своя фокус за следващата.',
  },
  'today.weekly.improved': { en: 'What improved this week?', bg: 'Какво се подобри тази седмица?' },
  'today.weekly.patterns': { en: 'What patterns do you notice?', bg: 'Какви модели забелязваш?' },
  'today.weekly.next': { en: 'What will you focus on next?', bg: 'Върху какво ще се фокусираш след това?' },
  'today.weekly.placeholder': { en: 'Write freely…', bg: 'Пиши свободно…' },
  'today.weekly.save': { en: 'Save weekly review', bg: 'Запази прегледа' },
  'today.weekly.saved': { en: 'Saved for this week 💙', bg: 'Запазено за тази седмица 💙' },
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
const SUPPORTED: ReadonlyArray<Language> = ['en', 'bg', 'ru', 'it', 'fr', 'tr', 'de'];

const isLanguage = (val: unknown): val is Language =>
  typeof val === 'string' && (SUPPORTED as ReadonlyArray<string>).includes(val);

const detectInitialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(saved)) return saved;
    const browser = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
    if (browser.startsWith('bg')) return 'bg';
    if (browser.startsWith('ru')) return 'ru';
    if (browser.startsWith('it')) return 'it';
    if (browser.startsWith('fr')) return 'fr';
    if (browser.startsWith('tr')) return 'tr';
    if (browser.startsWith('de')) return 'de';
    return 'en';
  } catch {
    return 'en';
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
      if (!entry) return key;
      // Fallback chain: requested language → English → key
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
