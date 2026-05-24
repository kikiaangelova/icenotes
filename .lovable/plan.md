
# Dashboard Redesign — "Today" as Emotional Center

Goal: a 12–16 y/o skater opens IceNotes and instantly knows **where they are**, **what to do next**, and **why this app exists**. Calm, premium, mobile-first. Inspired by Headspace + Nike Run Club.

---

## 1. Information architecture (what changes)

Today the home screen mixes equal-weight cards: hero video, StreakCard, GameDayCard, MotivationalQuote, focus reminder, breadcrumb, 5-tab block. Everything competes. We collapse it into **three clear layers**.

```text
┌──────────────────────────────────────────┐
│  HEADER  avatar · greeting · settings    │  (slimmer, calmer)
├──────────────────────────────────────────┤
│  TODAY HERO                              │  PRIMARY — emotional center
│  · mood-aware greeting + micro-line      │
│  · ONE big primary CTA (adaptive):       │
│      Reflect · Train · Coach · Rest      │
│  · 2 soft secondaries below              │
├──────────────────────────────────────────┤
│  CONTINUE / GAME DAY (conditional)       │  PRIMARY — only if relevant
├──────────────────────────────────────────┤
│  QUICK ACTIONS — 4 calm tiles            │  PRIMARY shortcuts
│  Reflection · Training · Journal · Goals │
│  + Mental prep tile                      │
├──────────────────────────────────────────┤
│  COACH IRIS NOTICED (if signal)          │  SUPPORT
├──────────────────────────────────────────┤
│  ── soft divider ──                      │
│  SECONDARY (collapsed by default)        │
│  · Today's stats (streak, sessions)      │
│  · Daily quote                           │
│  · History / Activity calendar           │
│  · Progress summary                      │
└──────────────────────────────────────────┘
            BottomNav (already redone)
```

The 5 top tabs (`Today / Train / Mind / Goals / Progress`) are **removed from the Today view**. Navigation lives only in the bottom nav now → one nav system, no duplication. The legacy `activeTab` state still drives non-Today tabs but is hidden behind the bottom nav and the quick-action tiles.

---

## 2. Visual hierarchy + typography

- **H1 greeting**: `text-3xl sm:text-4xl font-black font-serif` (currently `text-base`)
- **Hero headline**: `text-2xl sm:text-3xl` already in `TodayHero` — keep, but increase line-height + breathing room
- **Body**: bump from `text-xs/sm` to `text-sm/base` minimum on all primary content
- **Tap targets**: every actionable card ≥ 64px tall (rink-glove friendly, matches the Core memory rule)
- **Contrast**: replace `text-muted-foreground` on critical labels with `text-foreground/75`
- **Spacing**: vertical rhythm of `space-y-5` between primary blocks, `space-y-3` inside blocks
- **Cards**: rounded-3xl, soft shadow, no harsh borders; one accent color per module (lavender/mint/rose/sky/grape — matches Module Colors memory)

---

## 3. Quick Actions tile grid (new component)

Replaces the dense tab strip on Home. Five tiles, 2-column mobile / 5-column desktop:

| Tile         | Color    | Icon       | Action                              |
|--------------|----------|------------|-------------------------------------|
| Reflection   | rose     | Feather    | open Reflect view                   |
| Training     | mint     | Snowflake  | start pre-training prep             |
| Journal      | sky      | BookHeart  | open Daily Journal                  |
| Goals        | lavender | Target     | jump to Goals tab                   |
| Mental prep  | grape    | Brain      | open Mind / Coach Iris drawer       |

Each tile = large icon + bold label + one-line micro-copy ("Кратко · 2 мин"). Full localization via `LanguageContext` (new keys `quick.reflection.label`, `.micro`, etc.).

---

## 4. Secondary section ("More for today")

Stats, calendar, quote, progress cards get demoted into a `<details>` block with a calm "Виж повече за днес / See more for today" trigger. Reduces cognitive load on first paint; power users still one tap away.

`StreakCard`, `MotivationalQuote`, `ActivityCalendar`, `ProgressSummaryCards` move here.

---

## 5. Files touched

- `src/components/SimpleDashboard.tsx` — restructure Home view (remove top Tabs from Today, add QuickActions, move secondary into collapsible)
- `src/components/QuickActionTile.tsx` *(new)* — single reusable tile
- `src/components/QuickActionsGrid.tsx` *(new)* — the 5-tile grid
- `src/components/TodayHero.tsx` — typography pass (h1 bigger, more spacing); no logic changes
- `src/context/LanguageContext.tsx` — add `quick.*`, `secondary.title`, `home.section.now`, `home.section.more` keys (BG + EN)

No backend, no schema, no auth changes.

---

## 6. Out of scope for this pass

- Train / Mind / Goals / Progress internal tabs (already redesigned in prior passes)
- Animation overhaul beyond existing `motion-*` utilities
- New illustrations / video assets

---

## 7. Success check (post-build)

1. Mobile preview (390×844): hero + quick actions visible above the fold, no horizontal scroll
2. BG language switch — zero English strings on Home
3. Tap targets ≥ 60px on all tiles + bottom nav (already done)
4. Lighthouse contrast: no AA failures on primary text
