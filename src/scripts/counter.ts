// Count-up animation when element enters viewport.
// Markup:
//   <span data-counter="81" data-counter-format="money-m">0</span>
//   <span data-counter="2">0</span>
//   <span data-counter="1340" data-counter-format="thousand">0</span>

import { prefersReducedMotion } from './motion-utils';

type Format = 'money-m' | 'thousand' | 'plain';

const formatters: Record<Format, (n: number) => string> = {
  'money-m': (n) => `$${Math.round(n)}M`,
  'thousand': (n) => Math.round(n).toLocaleString('en-US'),
  'plain': (n) => String(Math.round(n)),
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function initCounters(selector = '[data-counter]'): void {
  if (typeof window === 'undefined') return;
  const nodes = document.querySelectorAll<HTMLElement>(selector);
  if (!nodes.length) return;

  const reduced = prefersReducedMotion();

  nodes.forEach((el) => {
    const target = parseFloat(el.dataset.counter ?? '0');
    const format = (el.dataset.counterFormat ?? 'plain') as Format;
    const fmt = formatters[format] ?? formatters.plain;
    const duration = parseInt(el.dataset.counterDuration ?? '1500', 10);

    if (reduced) {
      el.textContent = fmt(target);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(el, target, duration, fmt);
            io.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
  });
}

function animate(
  el: HTMLElement,
  target: number,
  duration: number,
  fmt: (n: number) => string
): void {
  const start = performance.now();

  function step(now: number) {
    const t = Math.min(1, (now - start) / duration);
    const v = easeOutExpo(t) * target;
    el.textContent = fmt(v);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = fmt(target);
  }

  requestAnimationFrame(step);
}
