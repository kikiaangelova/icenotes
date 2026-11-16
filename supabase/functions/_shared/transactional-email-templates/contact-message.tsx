import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Heading, Text, Preview } from 'npm:@react-email/components@0.0.22';
import type { TemplateEntry } from './registry.ts';
import { CONTACT_OWNER, contactSubject } from '../contact-notification.ts';

function Email(data: Record<string, unknown>) {
  return <Html lang="en"><Head /><Preview>New SkateGoals contact message</Preview><Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}><Container style={{ padding: '24px', maxWidth: '560px' }}><Heading style={{ fontSize: '22px' }}>SkateGoals contact message</Heading>{['name', 'email', 'message', 'locale', 'created_at'].map(field => <Text key={field} style={{ fontSize: '14px', lineHeight: '22px', whiteSpace: 'pre-wrap' }}><strong>{field.replaceAll('_', ' ')}:</strong> {String(data[field] || 'Not provided')}</Text>)}</Container></Body></Html>;
}
export const template = { component: Email, subject: contactSubject, to: CONTACT_OWNER, displayName: 'Contact owner notification' } satisfies TemplateEntry;