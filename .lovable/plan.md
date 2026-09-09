# Phase 2.1 QA Fix Pass

## Goal
Apply only the requested QA corrections while preserving authentication, athlete data, existing migrations, training, journals, goals, jumps, progress, and both secured AI roles.

## Changes

### 1. Correct privacy and AI-history copy
- Replace onboarding’s absolute sharing promise with “private by default” wording and a Privacy reference in English and Bulgarian.
- Correct the AI Support limits text: chats are not a professional record, current chat history may not be available later, and important actions should be saved to Goals or Journal.
- Replace remaining public-facing absolutes such as “always private,” “only you can see,” and “nobody else sees it” with accurate private-by-default language.

### 2. Tighten onboarding requirements
- Require a preferred name and valid numeric age before leaving Step 1.
- Require a category and valid years-in-skating value before leaving Step 2.
- Remove “Optional” from those two fields without applying new restrictions to saved legacy profiles.
- Limit category choices to Advanced Novice, Junior, Senior, and Other, with the agreed Bulgarian labels.
- Preserve the existing internal `selfLevel` compatibility mapping and all existing profile rows.

### 3. Correct pilot positioning
- Update Landing and About in both languages to say SkateGoals is being prepared for pilot testing, without claiming current skaters or coaches are already participating.

### 4. Remove legacy community/footer content
- Remove the personal Instagram link, social heading, community links, and “made with love” footer line.
- Replace the old community column with real Product links: Features, Sport Psychology, and AI Support.
- Redirect `/share-experience` to `/about`, remove its public navigation entry, and delete the unused page/import when confirmed safe.
- Remove the remaining profile-menu link to the old community page.

### 5. Apply the Ice Performance palette
- Replace the active `theme-neon` warm beige/terracotta tokens and forced paper gradients with cool ice-white, white/cool-neutral surfaces, graphite/deep navy text, deep navy primary, restrained steel blue, and cool grey borders.
- Update dark tokens to graphite/deep navy and keep existing typography, structure, and component behavior.
- Limit this to global tokens and surface overrides; no component redesign.

### 6. Focused cleanup and verification
- Remove misleading user-facing Coach Kiki references while retaining compatibility event names and saved-data keys.
- Confirm height/weight inputs remain absent and AI request/auth code is unchanged.
- Run typecheck/build and focused searches for privacy absolutes, persisted-chat claims, pilot claims, personal Instagram, `/share-experience`, warm-theme terms, and legacy persona copy.
- Test Landing, About, AI Support, redirect behavior, and onboarding at 390px and desktop; verify English/Bulgarian category labels, required-step behavior, no horizontal overflow, and capture screenshots.

## Technical notes
- No database migration or backend function change is planned.
- “Valid age” will mean a filled numeric value within the existing input bounds; this does not retroactively block legacy ages outside 14–18.
- Years in skating will accept zero as valid for a new skater and retain the existing upper input bound.