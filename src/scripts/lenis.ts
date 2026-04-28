import Lenis from 'lenis';
import { prefersReducedMotion } from './motion-utils';

let instance: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (typeof window === 'undefined') return null;
  if (prefersReducedMotion()) return null;
  if (instance) return instance;

  instance = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 1.5,
    wheelMultiplier: 1,
  });

  function raf(time: number) {
    instance?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Anchor links → smooth scroll
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    instance?.scrollTo(el as HTMLElement, { offset: -64 });
  });

  return instance;
}

export function getLenis(): Lenis | null {
  return instance;
}
