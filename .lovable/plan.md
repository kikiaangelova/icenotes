
# IceNotes — Warmth, Care & Clarity Pass

A focused three-part upgrade so the signed-in experience matches the warmth of the marketing site, supports skaters on hard days, and feels calm to navigate.

**No data is touched.** Existing journal entries, jumps, sessions, goals, roles, and the admin grant remain untouched.

---

## Part A — Finish Bulgarian inside the signed-in app

The marketing pages already speak warm, native Bulgarian. The moment a skater logs in, English creeps back. This pass closes that gap and softens gendered phrasing.

**Components to fully localize** (add `useLanguage`, replace hardcoded strings, add BG keys):

- `SimpleDashboard.tsx` — tab labels, all card titles & subtitles, dialog text
- `OnboardingFlow.tsx` — every step, placeholders, toasts, body-metrics prompt
- `JumpTracker.tsx` / `JumpLog.tsx` — labels, empty states, stat captions
- `DailyLogModal.tsx`, `DailyJournal.tsx` — fields, prompts, save buttons
- `MentalHealthHub.tsx`, `ReflectSpace.tsx`, `PreTrainingPrep.tsx`, `SessionTimer.tsx`
- `AchievementsSection.tsx`, `MotivationalQuote.tsx`, `QuotesCollection.tsx`
- `ProgressCharts.tsx`, `JourneyView.tsx`, `ActivityCalendar.tsx`, `ProgressOverview.tsx`, `ProgressSummaryCards.tsx`
- `Header.tsx` (verify all strings), `App.tsx` loading states
- `Admin.tsx` — for tone consistency (admin tools too)

**Bulgarian copy refinements (tone & gender):**

- Add `/на` gendered forms where missing: `Спокоен/на`, `Фокусиран/а`, `Готов/а`, `Добре дошъл/дошла`, `Благодарен/на`, etc. Or pick neutral nouns where it reads better (`Спокойствие`, `Фокус`).
- Use figure-skating-correct terms: `пирует` (not "пирети"), `Тренировка на лед` / `Тренировка извън лед` (natural word order).
- Rename `Психологически дневник` → **`Дневник на ума`** (warmer, matches "Mind Journal").
- Soften the welcome toast: replace *"Let's start building your competitive edge"* with *"Your skating story starts here. One session at a time."* (and BG equivalent: *"Твоята история на леда започва тук. Една тренировка наведнъж."*).

**Quality safeguards:**

- Add a dev-mode console warning in `LanguageContext.t()` when a key is missing — silent gaps stop being silent.
- Remove legacy `tr/de/ru/it/fr` keys from the dictionary (deferred cleanup, no behavior change).

---

## Part B — Tone-aware messaging + Post-Competition module

The app currently sounds equally upbeat whether the skater feels great or terrible. This part teaches it to read the room.

**B1. Adaptive copy on low-rating days**

When a journal entry is saved with `emotional_state ≤ 3` *or* `confidence_level ≤ 4`, replace the standard cheerful confirmation with gentle copy:

- EN: *"Hard days are part of the journey. Be gentle with yourself today — tomorrow is a fresh sheet of ice. 💙"*
- BG: *"Трудните дни също са част от пътя. Бъди мил/а със себе си днес — утре е нов лед. 💙"*

Same logic on the home greeting the next morning if the previous day was a low-rating day: a soft check-in instead of a cheer.

**B2. Pair every numeric rating with an optional one-liner**

Under each 1–10 slider in the daily journal (emotional state, confidence, focus), add an optional text field:

- EN: *"What was behind that today? (optional)"*
- BG: *"Какво стоеше зад това днес? (по желание)"*

Stored as a free-text addendum on the journal entry. No schema change required — appended into existing `personal_reflections` field with a labeled prefix, or adds three new optional text columns via a small additive migration (decide at build time, default = additive migration, three nullable text columns).

**B3. Soften the streak/achievement mechanic**

- Replace `7-day streak — don't lose it!` framing with `You've journaled 12 days this month` (count, not threat).
- Achievements stay, but never display a "streak broken" state. Missing days are simply not counted, never punished.

**B4. New Post-Competition module**

Add a sixth tab to the Mind Journal alongside `Reframe / Gratitude / Body Scan / Compassion / Pre-Comp`:

**Post-Comp** — three soft prompts:

1. *"What did you do well today, regardless of placement?"*
2. *"What surprised you — about your skating or yourself?"*
3. *"What will you carry from this competition into your next training week?"*

Stored in `mind_journal_entries` with `entry_type = 'postcomp'` and three new optional fields (`postcomp_did_well`, `postcomp_surprise`, `postcomp_carry_forward`). Additive migration, RLS unchanged.

**B5. Gentler body-metrics prompt in onboarding**

Separate weight from age/height. Wrap the weight field in its own block with copy:

- EN: *"Only share if it helps you. You can skip this and never see it again."*
- BG: *"Сподели само ако ти помага. Можеш да пропуснеш и да не виждаш това отново."*

Add a `dismissed_weight_prompt` flag in the profile so once skipped, it's never shown again.

---

## Part C — Consolidate dashboard from 8 tabs to 5

Today's `SimpleDashboard` has overlapping tabs (`Mind` vs `Psych`, `Goals` vs `My Skating Plan`, `Progress` vs `Journey`). Skaters get decision fatigue. Collapse to five tabs that map to how a skater actually thinks about their week:

```text
Today  ·  Train  ·  Mind  ·  Goals  ·  Growth
```

| New tab | Replaces | Contains |
|---|---|---|
| **Today** | (existing) | `TodayJourney` — daily greeting, today's-in-one-sentence summary, save-today's-reflection CTA |
| **Train** | Training + Jumps | Session Timer, On-Ice card, Off-Ice card, Jump Log, Reflect button |
| **Mind** | Mental Prep + Sport Psychology + Quotes | Sub-pills inside the tab: *Pre-Skate · Mind Journal · Sport Psych · Inspiration* |
| **Goals** | Weekly Goals + My Skating Plan | Top toggle: *Week · Month · Season* — single unified goals view |
| **Growth** | Progress + Journey | Progress summary cards, charts, activity calendar, journey timeline |

**New: "Today, in one sentence" home view** — at the top of the **Today** tab, show a single-line summary of yesterday's training when applicable: *"Yesterday you trained on-ice for 45 min, landed 3 of 5 loops, and felt 7/10 focused. Want to write one sentence about it?"* — links straight into the journal.

**Tab visuals:** Keep current module color coding (Goals lavender, Train mint, Mind pink, Growth blue, Today peach). Larger touch targets retained for rink usability.

---

## Technical notes (for Lovable, not the user)

- **Database (additive only):**
  - `journal_entries`: optional new columns `emotional_state_note`, `confidence_note`, `focus_note` (text, nullable).
  - `mind_journal_entries`: optional new columns `postcomp_did_well`, `postcomp_surprise`, `postcomp_carry_forward` (text, nullable).
  - `profiles`: optional new column `dismissed_weight_prompt` (boolean, default false).
  - All RLS policies inherit from existing per-user policies — no policy changes.
  - One migration, fully additive, zero risk to existing rows.
- **`LanguageContext.tsx`:** add ~120 new keys (dashboard, onboarding, journal, mind, jumps, progress, journey, achievements, admin, low-rating responses, post-comp prompts). Add dev-mode missing-key warning. Strip dead `tr/de/ru/it/fr` entries.
- **Tab consolidation:** purely a JSX restructure inside `SimpleDashboard.tsx`. Sub-pills inside `Mind` and toggle inside `Goals` use existing `Tabs` + `ToggleGroup` shadcn primitives.
- **Adaptive tone:** new helper `getToneForEntry(entry)` returns `'gentle' | 'neutral' | 'celebratory'`; consumed by save toasts and the Today greeting.
- **Achievements:** swap `streak` display from "X-day streak" to "X days journaled this month" — no DB or logic change, only label change in the achievements component.

---

## Out of scope (not touched)

- No changes to auth, roles, admin grant, RLS policies, or existing data.
- `Dashboard.tsx` (the unused Premium dashboard) is left alone — flagged for separate review.
- Visual identity, fonts, and color tokens unchanged.
- No changes to feedback system, email delivery, or analytics events.

---

## Suggested execution order

1. Database migration (additive columns) — single approval, minutes to run.
2. Bulgarian dictionary expansion + missing-key warning + dead-key cleanup.
3. Localize `SimpleDashboard`, `OnboardingFlow`, `Header`, then feature components in waves.
4. Tab consolidation in `SimpleDashboard` (5-tab structure).
5. Adaptive tone helper + low-rating responses + soften streak labels.
6. Post-Comp tab + onboarding weight-prompt softening.
7. QA pass: switch language EN ↔ BG on every screen, log a low-rating entry, log a Post-Comp entry, verify no key falls back to a raw key.

Approve this plan and I'll start with the migration, then move through the steps in order.
