import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage, Language } from '@/context/LanguageContext';
import { useProfile, useUpdateProfile } from '@/hooks/useSupabaseData';

const SUPPORTED: ReadonlyArray<Language> = ['en', 'bg', 'ru', 'it', 'fr'];

/**
 * Bridges the LanguageContext with the user's saved profile.language.
 *
 * Behaviour:
 * - When a logged-in user's profile loads, apply their saved language to the UI
 *   (silently, no DB write).
 * - When the user changes the language in the UI, persist it back to their profile
 *   so the preference follows them across devices.
 * - Signed-out users continue to use the localStorage-persisted preference handled
 *   by LanguageProvider itself.
 */
export const LanguageSync: React.FC = () => {
  const { user } = useAuth();
  const { language, setLanguageSilent } = useLanguage();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  // Track whether we have already applied the profile language for this user
  // so we don't fight the user every time the profile object reidentifies.
  const appliedForUserRef = useRef<string | null>(null);
  // Track the last value we wrote to avoid redundant writes.
  const lastSavedRef = useRef<Language | null>(null);

  // 1) On profile load → apply profile.language to UI (once per user session).
  useEffect(() => {
    if (!user || !profile) return;
    if (appliedForUserRef.current === user.id) return;

    const fromProfile = profile.language;
    const fromStorage = (() => {
      try {
        const v = localStorage.getItem('icenotes.language');
        return v && SUPPORTED.includes(v as Language) ? (v as Language) : null;
      } catch {
        return null;
      }
    })();

    if (fromProfile && SUPPORTED.includes(fromProfile)) {
      // Profile has an explicit saved preference → it wins (cross-device source of truth).
      setLanguageSilent(fromProfile);
      lastSavedRef.current = fromProfile;
    } else if (fromStorage) {
      // No profile preference yet — promote the local preference to the profile so
      // the choice follows the user across devices from now on.
      setLanguageSilent(fromStorage);
      lastSavedRef.current = fromStorage;
      updateProfile.mutate({ language: fromStorage });
    } else {
      // Nothing anywhere — seed with current UI language (likely browser default).
      lastSavedRef.current = language;
    }
    appliedForUserRef.current = user.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile, setLanguageSilent]);

  // Reset the "applied" guard when the user signs out / changes.
  useEffect(() => {
    if (!user) {
      appliedForUserRef.current = null;
      lastSavedRef.current = null;
    }
  }, [user]);

  // 2) On UI language change (after initial sync) → persist back to profile.
  useEffect(() => {
    if (!user || !profile) return;
    if (appliedForUserRef.current !== user.id) return;
    if (lastSavedRef.current === language) return;

    lastSavedRef.current = language;
    updateProfile.mutate({ language });
    // We intentionally exclude updateProfile from deps to avoid mutate() re-creating loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, user, profile]);

  return null;
};
