# SkateGoals — Product Architecture & UX Rebuild

Goal: turn a collection of tools into one causal loop — **plan → train → log → reflect → next focus → weekly review → adjust goal → prepare → train again**. Auth, database, existing user data and the secured AI backend stay untouched.

## Final information architecture

Bottom navigation, exactly five, no nested tab bars anywhere:

```text
Today      What am I working on / what to do now / what's next
Training   Log a session + history (elements & jumps as light context)
Goals      Season goal -> current focus -> next action
Support    Two explicit choices: AI Coach | Sport Psychology
Progress   Read-only trends from logs, reflections, reviews
```

Profile/settings stays in the header sheet. Competition Prep is **not** a nav item: it appears on Today and inside Support only when a competition date on the athlete profile is within ~14 days. Secondary tools (breathing, mindfulness, quotes, achievements, calendar, exports) move to a single "Library" entry inside Profile.

## Screen definitions

**Today** — greeting + current focus line; one primary button that changes by context (before training: "Start session"; after: "Log session"; if a session is logged and unreflected: "Reflect"; on review day: "Weekly review"); a next-focus/goal line; a compact competition banner when relevant. Nothing else above the fold. No quotes, no streak badge, no XP, no video strip, no feature directory, no "more" drawer.

**Training** — single screen: log form (on-ice / off-ice, duration, elements worked, how it went, note) targeted at 60–90 seconds, then session history below. Jump/element entry is folded into the log form as optional chips, not a separate tracker tab.

**Reflection** — not a nav destination. A short sheet that opens right after saving a session: what worked / what was hard / focus for next session. Saving writes the focus, which is what Today then shows.

**Goals** — one system. Season goal at top, current cycle focus under it, next action under that. Weekly goal entry is folded into the cycle focus.

**Support** — two clearly different cards with intent starters ("Plan my week", "I keep missing the same element" vs "Nervous before the start", "Bad session, need to reset"). Chat opens from a chosen intent, never blank.

**Progress** — derived only: sessions per week, focus follow-through, element trend, reflection sentiment over time, goal movement. No inputs.

**Weekly review** — one guided screen: what happened (auto-summary of the week's sessions and focuses) → how it went → one focus for next week, which writes into the goal cycle.

## Component map

KEEP (unchanged logic)
`AuthContext`, `SkaterContext`, `JournalContext`, `useSupabaseData`, `SkatingAssistant` (role-based, authenticated), `skating-coach` edge function, `OnboardingFlow`, `Seo`, `MobileBottomNav` (labels only), landing/public pages.

MERGE
- `WeeklyGoals` + `SkatingGoals` → one `GoalsScreen`. Season/cycle/next-action all read from the `goals` table via `timeframe`. `weekly_goals` rows stay in the database and are read-only legacy; nothing is deleted.
- `TrainingLog` + `JumpLog` + `JumpTracker` + `SessionTimer` → one `TrainingScreen` with a single log form and history.
- `MindJournal` + `DailyJournal` + `ReflectSpace` + `MindReflection` + `CoachIrisReflection` → one `ReflectionSheet` reusing the existing `journal_entries` write path.
- `MentalHealthHub` + `SportPsychology` component + `AiSupport` entry points → `SupportScreen`.
- `ProgressCharts` + `ProgressInsights` + `ProgressOverview` + `ProgressSummaryCards` + `JourneyView` + `ActivityCalendar` → one `ProgressScreen`.

HIDE (kept in repo, moved to Profile → Library, off the core loop)
`MotivationalQuote`, `QuotesCollection`, `AchievementsSection`, `ProgressionCard`, `StreakCard`, `MindfulnessTools`, `PreTrainingPrep` (surfaces only as the optional pre-training prep on Today), `FeatureMap`, `ExportButton`, `TodoSection`, `GuidedTour`.

REMOVE from the app shell
`Dashboard.tsx` and `premium/*` (unused legacy dashboard), `TrialBanner`, `TodayJourney`, `TodayHero`, `QuickActionsGrid`, `CoachNoticed`, `WelcomePage`, `SimpleDashboard`'s nested tab layer. Files are deleted only once nothing imports them.

REWRITE (copy + layout)
`SimpleDashboard` becomes a thin router between the five screens. `TrainingLog` and `WeeklyGoals` hardcoded English blocks move fully into the dictionaries. All new keys added to `dictPhase1`/`dictPhase2`, written natively in both languages.

## Copy direction

Bulgarian written by skating vocabulary, not translation: тренировка на лед, суха подготовка, елементи, програма, старт, фокус за следващата тренировка, кратък отчет. English concise and international. Banned: "every practice counts", "small wins", "unlock potential", "no pressure", "trust the process", therapy/wellness phrasing, emoji-led headings. Every screen has one primary action, and its microcopy says what happens after pressing it.

## Visual direction

Ice-white / graphite / deep navy / one steel-blue accent, already in `index.css` — no new palette. Fewer surfaces: sections separated by spacing and type scale, not by cards. One accent per screen, reserved for the primary action. Large tap targets, fast forms, no decorative gradients or illustrations in the core loop.

## Technical and data notes

- `goals` table already carries `timeframe` (weekly/monthly/season) — the single goal system needs no schema change. `weekly_goals` stays for historical reads.
- Next focus and weekly review need storage. Preference: reuse `journal_entries` with a type/tag field rather than new tables; if a new `weekly_reviews` table is required it gets `GRANT`s and per-user RLS in the same migration. This is the one place the plan may touch the database — nothing existing is altered.
- Competition Prep triggers off the existing `next_competition` / `next_competition_date` profile fields from Phase 2.
- The AI contract (bearer token, server-side `coach`/`psych` prompts) is not modified; only entry points and starter intents change.
- Language storage key stays the legacy `icenotes.language`.
- Risk: `SimpleDashboard` is 735 lines and holds deep-link `?action=` handling — the deep links must be re-mapped to the new screens or they break existing CTAs.
- Risk: removing components while `JournalContext` still exposes their hooks; contexts stay untouched to avoid data regressions.

## Build sequence

**Phase A — architecture and loop**
Five-screen shell, Today rebuilt, merged Training screen, reflection sheet after save, deep-link re-map. Old screens still reachable via Library so nothing is lost.

**Phase B — goals, review, support, competition**
One goal system, weekly review screen, Support surface with intents, contextual competition banner, Progress made read-only.

**Phase C — copy and visual pass**
Full EN/BG rewrite of the new surfaces, dictionary cleanup, removal of dead components, hierarchy/whitespace pass, mobile QA at 390px and desktop, build + typecheck.

## Not in scope

No parent or coach accounts, payments, social features, video analytics, new gamification, or database redesign.
