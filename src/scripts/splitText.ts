// Split words preserving inline children (spans inline kept as a single token).
// Each word becomes:  <span class="word"><span class="word__inner">…</span></span>
// Use CSS to animate `.word__inner` (translateY + opacity) with stagger.

import { prefersReducedMotion } from './motion-utils';

interface SplitOptions {
  selector?: string;
  staggerMs?: number;
  durationMs?: number;
  delayMs?: number;
}

export function splitAndReveal(opts: SplitOptions = {}): void {
  if (typeof window === 'undefined') return;
  const {
    selector = '[data-split-reveal]',
    staggerMs = 40,
    durationMs = 700,
    delayMs = 0,
  } = opts;

  const els = document.querySelectorAll<HTMLElement>(selector);
  if (!els.length) return;

  const reduced = prefersReducedMotion();

  els.forEach((el) => {
    if (el.dataset.splitDone === 'true') return;
    splitElement(el);
    el.dataset.splitDone = 'true';

    if (reduced) {
      el.classList.add('is-revealed');
      // En reduced-motion no hay transitionend, así que liberamos el clip
      // inmediatamente para evitar que descenders/underlines queden cortados.
      el.querySelectorAll<HTMLElement>('.word').forEach((w) => w.classList.add('is-shown'));
      return;
    }

    // Set CSS vars for animation timing
    el.style.setProperty('--reveal-stagger', `${staggerMs}ms`);
    el.style.setProperty('--reveal-duration', `${durationMs}ms`);
    el.style.setProperty('--reveal-delay', `${delayMs}ms`);

    // Reveal when in viewport
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-revealed');
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
  });
}

function splitElement(el: HTMLElement): void {
  const fragments: Node[] = [];
  let wordIndex = 0;

  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      const tokens = text.split(/(\s+)/); // keep whitespace
      tokens.forEach((tok) => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) {
          fragments.push(document.createTextNode(tok));
        } else {
          fragments.push(makeWord(tok, wordIndex++));
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Treat inline element as a single "word" — preserve markup (e.g. accent-italic span)
      const elNode = node as HTMLElement;
      if (elNode.tagName === 'BR') {
        fragments.push(document.createElement('br'));
      } else {
        fragments.push(makeWordFromElement(elNode, wordIndex++));
      }
    }
  });

  el.innerHTML = '';
  fragments.forEach((f) => el.appendChild(f));
}

// Liberar el clip de la palabra al terminar la animación. Esto deja visibles
// descenders, swashes serif y underlines accent que de otro modo quedan
// cortados por el `overflow: hidden` del `.word`.
function attachShownListener(word: HTMLSpanElement, inner: HTMLSpanElement): void {
  const onEnd = (e: TransitionEvent) => {
    if (e.propertyName !== 'transform') return;
    word.classList.add('is-shown');
    inner.removeEventListener('transitionend', onEnd);
  };
  inner.addEventListener('transitionend', onEnd);
}

function makeWord(text: string, index: number): HTMLSpanElement {
  const word = document.createElement('span');
  word.className = 'word';
  const inner = document.createElement('span');
  inner.className = 'word__inner';
  inner.style.setProperty('--word-index', String(index));
  inner.textContent = text;
  attachShownListener(word, inner);
  word.appendChild(inner);
  return word;
}

function makeWordFromElement(el: HTMLElement, index: number): HTMLSpanElement {
  const word = document.createElement('span');
  word.className = 'word';
  const inner = document.createElement('span');
  inner.className = 'word__inner';
  inner.style.setProperty('--word-index', String(index));
  // Move all children (and any class like accent-italic) into the inner wrapper
  inner.className = `word__inner ${el.className}`.trim();
  while (el.firstChild) inner.appendChild(el.firstChild);
  attachShownListener(word, inner);
  word.appendChild(inner);
  return word;
}
