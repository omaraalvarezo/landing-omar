import { isTouchDevice, lerp, prefersReducedMotion } from './motion-utils';

interface State {
  x: number;
  y: number;
  dotX: number;
  dotY: number;
  ringX: number;
  ringY: number;
  hoverEl: HTMLElement | null;
  visible: boolean;
}

const HOVER_SELECTOR = 'a, button, [role="button"], [data-cursor="hover"], input, textarea, label';

export function initCursor(): void {
  if (typeof window === 'undefined') return;
  if (isTouchDevice()) return;
  if (prefersReducedMotion()) return;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  document.documentElement.classList.add('cursor-active');

  const state: State = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    dotX: window.innerWidth / 2,
    dotY: window.innerHeight / 2,
    ringX: window.innerWidth / 2,
    ringY: window.innerHeight / 2,
    hoverEl: null,
    visible: false,
  };

  // Track real pointer
  window.addEventListener('pointermove', (e) => {
    state.x = e.clientX;
    state.y = e.clientY;
    if (!state.visible) {
      state.visible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }
  });

  window.addEventListener('pointerleave', () => {
    state.visible = false;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  // Hover state delegation
  document.addEventListener('pointerover', (e) => {
    const target = e.target as HTMLElement;
    const el = target.closest(HOVER_SELECTOR) as HTMLElement | null;
    if (el && el !== state.hoverEl) {
      state.hoverEl = el;
      ring.classList.add('cursor-ring--hover');
    }
  });

  document.addEventListener('pointerout', (e) => {
    const target = e.target as HTMLElement;
    const el = target.closest(HOVER_SELECTOR) as HTMLElement | null;
    if (!el) {
      state.hoverEl = null;
      ring.classList.remove('cursor-ring--hover');
    }
  });

  // RAF loop
  function tick() {
    state.dotX = lerp(state.dotX, state.x, 0.5);
    state.dotY = lerp(state.dotY, state.y, 0.5);
    state.ringX = lerp(state.ringX, state.x, 0.12);
    state.ringY = lerp(state.ringY, state.y, 0.12);

    dot!.style.transform = `translate3d(${state.dotX}px, ${state.dotY}px, 0) translate(-50%, -50%)`;
    ring!.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
