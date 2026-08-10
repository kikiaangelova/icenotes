/**
 * Tiny dependency-free celebration burst.
 * Used after a skater saves a reflection, a session, or finishes Game Day prep.
 * Respects prefers-reduced-motion — no motion for skaters who opted out.
 */

const COLORS = ['#C6FF3D', '#7C3AED', '#A78BFA', '#FDE68A', '#F472B6', '#67E8F9'];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

let styleInjected = false;
const injectStyle = () => {
  if (styleInjected || typeof document === 'undefined') return;
  styleInjected = true;
  const style = document.createElement('style');
  style.textContent = `
@keyframes icenotes-confetti-fall {
  0%   { transform: translate3d(0,0,0) rotate(0deg); opacity: 1; }
  100% { transform: translate3d(var(--dx), var(--dy), 0) rotate(var(--rot)); opacity: 0; }
}
.icenotes-confetti-piece {
  position: fixed;
  top: 0; left: 0;
  pointer-events: none;
  z-index: 9999;
  will-change: transform, opacity;
  animation: icenotes-confetti-fall var(--dur) cubic-bezier(.2,.7,.4,1) forwards;
}`;
  document.head.appendChild(style);
};

export type CelebrateOptions = {
  /** Burst origin. Defaults to just above the centre of the viewport. */
  x?: number;
  y?: number;
  /** Number of pieces. Default 26. */
  count?: number;
};

export const celebrate = (options: CelebrateOptions = {}) => {
  if (typeof document === 'undefined') return;
  if (prefersReducedMotion()) return;
  injectStyle();

  const x = options.x ?? window.innerWidth / 2;
  const y = options.y ?? window.innerHeight * 0.38;
  const count = options.count ?? 26;

  const pieces: HTMLElement[] = [];
  for (let i = 0; i < count; i += 1) {
    const el = document.createElement('span');
    el.className = 'icenotes-confetti-piece';

    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 90 + Math.random() * 150;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance + 120 + Math.random() * 80;
    const size = 6 + Math.random() * 6;
    const duration = 900 + Math.random() * 700;
    const round = Math.random() > 0.5;

    el.style.setProperty('--dx', `${dx.toFixed(1)}px`);
    el.style.setProperty('--dy', `${dy.toFixed(1)}px`);
    el.style.setProperty('--rot', `${(Math.random() * 720 - 360).toFixed(0)}deg`);
    el.style.setProperty('--dur', `${duration}ms`);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size * (round ? 1 : 1.8)}px`;
    el.style.borderRadius = round ? '9999px' : '2px';
    el.style.background = COLORS[i % COLORS.length];
    el.style.opacity = '0.95';

    document.body.appendChild(el);
    pieces.push(el);
  }

  window.setTimeout(() => pieces.forEach((p) => p.remove()), 1800);
};

/** Celebrate centred on the element that was just interacted with. */
export const celebrateFrom = (el: HTMLElement | null, options: CelebrateOptions = {}) => {
  if (!el) return celebrate(options);
  const rect = el.getBoundingClientRect();
  return celebrate({
    ...options,
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  });
};
