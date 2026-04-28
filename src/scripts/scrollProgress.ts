import { prefersReducedMotion } from './motion-utils';

export function initScrollProgress(): void {
  if (typeof window === 'undefined') return;

  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  let ticking = false;
  let target = 0;
  let current = 0;
  const reduced = prefersReducedMotion();

  function update() {
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    target = max > 0 ? scrollTop / max : 0;

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(loop);
    }
  }

  function loop() {
    current = reduced ? target : current + (target - current) * 0.18;
    bar!.style.transform = `scaleX(${current})`;
    if (Math.abs(target - current) > 0.001) {
      requestAnimationFrame(loop);
    } else {
      bar!.style.transform = `scaleX(${target})`;
      ticking = false;
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}
