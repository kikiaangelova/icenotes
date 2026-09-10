# Authenticated Product Copy + Sport-Psychology Content Pass

## Outcome
Rewrite only currently reachable signed-in SkateGoals content in natural English and Bulgarian for competitive figure skaters aged 14–18. Preserve the hardened product loop, authentication, existing data, storage identifiers, secured AI behavior, and current visual structure.

## Copy surfaces
- Rewrite active onboarding, Today, Training, post-training Reflection, Goals, Weekly Review, Progress, and all related save/error/empty states.
- Clarify AI Coach as planning, priorities, and accountability around the athlete’s existing coach-led plan; remove technical and training-load invitations.
- Keep Sport Psychology focused on pressure, attention, confidence evidence, familiar routines, realistic self-talk, and resets after mistakes.
- Rewrite Competition Prep with controllables, practical logistics, optional breathing, short focus cues, and no training prescriptions.
- Use concise, neutral, gender-free Bulgarian written natively rather than mirroring English sentence structure.

## Mental-performance content
- Replace the old Sport Psychology exercise copy while keeping its current component structure.
- Rework Pre-Training Prep into an optional athlete-led check, remove physical-readiness verification and body-memory claims, and use optional 4-in/6-out breathing without a hold.
- Convert reachable MindfulnessTools from 4-7-8 breathing and affirmations to paced breathing, realistic process imagery, and task-focused cue statements.
- Keep existing internal usage types such as `breathing_478` and `affirmations` for stored-data compatibility; change only visible labels and instructions.
- Make only behavior changes required for content safety: breathing remains user-started, pausable/skippable, and non-mandatory.

## Technical scope
Primary edits will be limited to the active dictionaries and reachable signed-in components, including `dictPhase1`, `dictPhase2`, `dictPhaseA`, `dictPhaseB`, `LanguageContext`, `PreTrainingPrep`, `SportPsychology`, `MindfulnessTools`, and Competition Prep copy.

No schema migration, authentication change, AI edge-function change, storage semantic change, data deletion, public-site redesign, or publishing.

## QA
- Search active surfaces for gendered slash forms, banned motivational/overclaiming language, 4-7-8 and breath holds, and technical/load-prescriptive AI Coach starters.
- Run the project typecheck and production build.
- Test signed-in English and Bulgarian at 390px and desktop across onboarding, core loop screens, both AI drawers, Competition Prep, Progress, Pre-Training Prep, Sport Psychology, and MindfulnessTools.
- Confirm no horizontal overflow and record any remaining risk that cannot be safely simulated.
