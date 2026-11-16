import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Heading, Text, Preview } from 'npm:@react-email/components@0.0.22';
import type { TemplateEntry } from './registry.ts';
import { PILOT_OWNER, pilotSubject } from '../pilot-notification.ts';

const fields = ['role', 'first_name', 'email', 'age_group', 'club', 'note', 'locale', 'created_at'];
function Email(data: Record<string, unknown>) {
  return <Html lang="en"><Head /><Preview>New SkateGoals pilot signup</Preview><Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}><Container style={{ padding: '24px', maxWidth: '560px' }}><Heading style={{ fontSize: '22px' }}>SkateGoals pilot signup</Heading>{fields.map((field) => <Text key={field} style={{ fontSize: '14px', lineHeight: '22px', whiteSpace: 'pre-wrap' }}><strong>{field.replaceAll('_', ' ')}:</strong> {String(data[field] || 'Not provided')}</Text>)}</Container></Body></Html>;
}
export const template = { component: Email, subject: pilotSubject, to: PILOT_OWNER, displayName: 'Pilot signup owner notification', previewData: { role: 'skater', first_name: 'Test', email: 'test@example.com', locale: 'en' } } satisfies TemplateEntry;