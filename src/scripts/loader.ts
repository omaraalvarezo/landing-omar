import { prefersReducedMotion } from './motion-utils';

export function initLoader(): void {
  if (typeof window === 'undefined') return;

  const loader = document.getElementById('loader');
  if (!loader) return;

  // Mark loader as ready (avoid FOUC if JS is late)
  document.documentElement.classList.add('loader-ready');

  if (prefersReducedMotion()) {
    document.documentElement.classList.add('loader-skipped', 'loader-done');
    loader.remove();
    return;
  }

  // First paint waits a tick to ensure styles applied
  requestAnimationFrame(() => {
    loader.dataset.state = 'loading';
  });

  const FILL_MS = 900;
  const FADE_MS = 350;

  const finish = () => {
    loader.dataset.state = 'done';
    document.documentElement.classList.add('loader-done');
    setTimeout(() => loader.remove(), FADE_MS + 50);
  };

  // Wait for window.load OR FILL_MS (whichever happens last to ensure 1.2s max)
  const minTimer = new Promise<void>((res) => setTimeout(res, FILL_MS));
  const loadEvent = new Promise<void>((res) => {
    if (document.readyState === 'complete') return res();
    window.addEventListener('load', () => res(), { once: true });
  });

  Promise.all([minTimer, loadEvent]).then(finish);

  // Hard cap at 1.2s in case load never fires
  setTimeout(finish, 1200);
}
