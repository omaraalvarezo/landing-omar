// Magnetic effect — element translates slightly toward the cursor when nearby.
// Markup: <a data-magnetic data-magnetic-strength="0.3">…</a>
// Disabled on touch + reduced-motion.

import { isTouchDevice, lerp, prefersReducedMotion } from './motion-utils';

export function initMagnetic(selector = '[data-magnetic]'): void {
  if (typeof window === 'undefined') return;
  if (isTouchDevice()) return;
  if (prefersReducedMotion()) return;

  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    const strength = parseFloat(el.dataset.magneticStrength ?? '0.25');
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let active = false;

    function loop() {
      cx = lerp(cx, tx, 0.18);
      cy = lerp(cy, ty, 0.18);
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05 || active) {
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      tx = dx * strength;
      ty = dy * strength;
      active = true;
      if (!raf) raf = requestAnimationFrame(loop);
    });

    el.addEventListener('pointerleave', () => {
      tx = 0;
      ty = 0;
      active = false;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  });
}
