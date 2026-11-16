import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Heading, Text, Button, Preview, Hr } from 'npm:@react-email/components@0.0.22';
import type { TemplateEntry } from './registry.ts';

interface Props { nickname?: string; link?: string; underAge?: boolean; locale?: string }

function Email({ nickname, link, underAge, locale }: Props) {
  const bg = locale !== 'en';
  const name = nickname || (bg ? 'Твоето дете' : 'Your child');
  return (
    <Html lang={bg ? 'bg' : 'en'}><Head />
      <Preview>{bg ? `${name} те кани в SkateGoals` : `${name} invited you to SkateGoals`}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', color: '#0B1F3A' }}>
        <Container style={{ padding: '28px 24px', maxWidth: '560px' }}>
          <Text style={{ fontSize: '14px', fontWeight: 700, color: '#3BB3D9', margin: '0 0 8px' }}>SkateGoals</Text>
          <Heading style={{ fontSize: '22px', lineHeight: '28px', margin: '0 0 16px' }}>
            {bg ? `${name} иска да свърже профила си с теб` : `${name} wants to link their profile with you`}
          </Heading>
          <Text style={{ fontSize: '15px', lineHeight: '24px' }}>
            {underAge
              ? (bg ? 'Детето ти е под 14 години. За да влезе в общността на фигуристите, трябва твоето съгласие. Общността е модерирана, без лични съобщения, снимки и класации.' : 'Your child is under 14. To join the skater community, they need your consent. The community is moderated, with no private messages, photos or rankings.')
              : (bg ? 'Ако потвърдиш, профилите ви ще се свържат.' : 'If you confirm, your profiles will be linked.')}
          </Text>
          <Text style={{ fontSize: '15px', lineHeight: '24px' }}>
            {bg ? 'Ще виждаш само това, което детето реши да сподели, например серия от тренировки и постижения. Никога няма да виждаш разговорите с AI асистента, записите и бележките от тренировките.' : 'You will only see what your child chooses to share, such as a training streak and achievements. You will never see AI conversations, training entries or notes.'}
          </Text>
          <Button href={link} style={{ backgroundColor: '#0B1F3A', color: '#ffffff', borderRadius: '14px', padding: '14px 22px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
            {bg ? 'Потвърди като родител' : 'Confirm as a parent'}
          </Button>
          <Text style={{ fontSize: '13px', lineHeight: '20px', color: '#4A5B70', marginTop: '20px' }}>
            {bg ? 'Влез или се регистрирай със същия имейл, на който получи това писмо. Линкът е валиден 7 дни. Ако не познаваш този фигурист, просто игнорирай писмото.' : 'Sign in or sign up with the same email this message was sent to. The link is valid for 7 days. If you do not know this skater, just ignore this email.'}
          </Text>
          <Hr style={{ borderColor: '#E3ECF5' }} />
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: Email,
  subject: (d: Record<string, unknown>) => d.locale === 'en' ? 'Confirm your link to a skater on SkateGoals' : 'Потвърди връзката с фигурист в SkateGoals',
  displayName: 'Parent consent request',
  previewData: { nickname: 'IceStar', link: 'https://skategoals.com/parent-confirm?token=preview', underAge: true, locale: 'bg' },
} satisfies TemplateEntry;
