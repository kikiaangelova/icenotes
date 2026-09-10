import { toast } from 'sonner';

/**
 * Small non-React helper so low-level mutation error toasts follow the
 * currently selected UI language. LanguageProvider persists the active
 * language to this key on every change, so it is always in sync.
 */
const STORAGE_KEY = 'icenotes.language';

type Lang = 'en' | 'bg';

const currentLanguage = (): Lang => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'bg' ? 'bg' : 'en';
  } catch {
    return 'en';
  }
};

const MESSAGES = {
  profile: {
    en: 'Could not save your profile. Please try again.',
    bg: 'Профилът не беше запазен. Опитай отново.',
  },
  journal: {
    en: 'Could not save your entry. Please try again.',
    bg: 'Записът не беше запазен. Опитай отново.',
  },
  training: {
    en: 'Could not save the session. Please try again.',
    bg: 'Тренировката не беше запазена. Опитай отново.',
  },
  jump: {
    en: 'Could not save the jump. Please try again.',
    bg: 'Скокът не беше запазен. Опитай отново.',
  },
  weeklyGoal: {
    en: 'Could not save the weekly goal. Please try again.',
    bg: 'Седмичната цел не беше запазена. Опитай отново.',
  },
  goalCreate: {
    en: 'Could not create the goal. Please try again.',
    bg: 'Целта не беше създадена. Опитай отново.',
  },
  goalUpdate: {
    en: 'Could not update the goal. Please try again.',
    bg: 'Целта не беше обновена. Опитай отново.',
  },
  goalDelete: {
    en: 'Could not delete the goal. Please try again.',
    bg: 'Целта не беше изтрита. Опитай отново.',
  },
} as const;

export type ErrorToastKey = keyof typeof MESSAGES;

export const toastError = (key: ErrorToastKey) => {
  toast.error(MESSAGES[key][currentLanguage()]);
};
