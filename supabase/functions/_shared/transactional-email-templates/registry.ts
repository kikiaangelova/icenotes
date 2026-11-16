import type * as React from 'npm:react@18.3.1';
import { template as pilotSignup } from './pilot-signup.tsx';
export interface TemplateEntry {
  component: React.ComponentType<any>;
  subject: string | ((data: Record<string, unknown>) => string);
  to?: string;
  displayName?: string;
  previewData?: Record<string, unknown>;
}
export const TEMPLATES: Record<string, TemplateEntry> = { 'pilot-signup': pilotSignup };