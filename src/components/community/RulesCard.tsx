import React from 'react';
import { ShieldCheck, ChevronDown } from 'lucide-react';
import { RULES, PARENT_RULES } from './communityCopy';

/** Always-visible short rules + privacy note at the top of each community space. */
export const RulesCard: React.FC<{ bg: boolean; space: 'skater' | 'parent' }> = ({ bg, space }) => {
  const rules = space === 'parent' ? PARENT_RULES : RULES;
  const privacy = space === 'parent'
    ? (bg ? 'Тук пишат само родители. Не споделяй имена, снимки или здравни данни на дете. Всяка публикация може да бъде сигнализирана с флагчето и се преглежда от модератор.' : 'Only parents post here. Do not share a child\'s name, photos or health details. Any post can be reported with the flag and a moderator reviews it.')
    : (bg ? 'Виждат те само с прякора и аватара. Не пиши телефон, адрес, училище или истинско име. Ако нещо не е наред, натисни флагчето. Модератор ще го прегледа.' : 'People see only your nickname and avatar. Never post your phone, address, school or real name. If something feels wrong, tap the flag. A moderator will review it.');
  return (
    <details className="rink-card group p-4">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-accent-ink" aria-hidden="true" />
        <span className="flex-1">
          <span className="block text-[15px] font-bold text-foreground">{bg ? 'Правила и поверителност' : 'Rules and privacy'}</span>
          <span className="block text-[13px] text-muted-foreground">{privacy}</span>
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <ol className="mt-3 list-decimal space-y-1.5 pl-9 text-[15px] text-foreground">
        {(bg ? rules.bg : rules.en).map((r) => <li key={r}>{r}</li>)}
      </ol>
    </details>
  );
};
