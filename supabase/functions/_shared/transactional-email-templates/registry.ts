import type * as React from 'npm:react@18.3.1';
import { template as pilotSignup } from './pilot-signup.tsx';
import { template as contactMessage } from './contact-message.tsx';
export interface TemplateEntry {
  component: React.ComponentType<any>;
  subject: string | ((data: Record<string, unknown>) => string);
  to?: string;
  displayName?: string;
  previewData?: Record<string, unknown>;
}
export const TEMPLATES: Record<string, TemplateEntry> = { 'pilot-signup': pilotSignup, 'contact-message': contactMessage };