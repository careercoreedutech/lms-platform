import { useEffect } from 'react';

// Ref-counted page scroll lock so several overlays (menu, modal) can stack safely.
let lockCount = 0;
let savedScrollbarPad = '';

function lock() {
  if (lockCount === 0) {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    savedScrollbarPad = document.body.style.paddingRight;
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    document.documentElement.classList.add('overlay-open');
  }
  lockCount += 1;
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.paddingRight = savedScrollbarPad;
    document.documentElement.classList.remove('overlay-open');
  }
}

/**
 * Locks background scroll while `open`, and calls `onClose` on Escape.
 */
export function useOverlay(open, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    lock();
    const onKey = (e) => {
      if (e.key === 'Escape' && onClose) {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      unlock();
    };
  }, [open, onClose]);
}
