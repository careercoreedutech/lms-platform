import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useOverlay } from '../../hooks/useOverlay';

/**
 * Accessible modal shell:
 * - closes on Escape and on a click on the dimmed backdrop
 * - locks background scroll while open
 * - moves focus into the dialog and restores it on close
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  maxWidth = 'max-w-md',
  children,
  labelledBy = 'modal-title',
}) {
  const panelRef = useRef(null);
  const lastFocused = useRef(null);
  useOverlay(open, onClose);

  useEffect(() => {
    if (!open) return undefined;
    lastFocused.current = document.activeElement;
    const t = setTimeout(() => {
      const first = panelRef.current?.querySelector(
        'input:not([type=hidden]):not([disabled]), select, textarea, button[data-autofocus]'
      );
      (first || panelRef.current)?.focus({ preventScroll: true });
    }, 60);
    return () => {
      clearTimeout(t);
      if (lastFocused.current && typeof lastFocused.current.focus === 'function') {
        lastFocused.current.focus({ preventScroll: true });
      }
    };
  }, [open]);

  // Keep Tab focus inside the dialog
  const onKeyDown = (e) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const nodes = panelRef.current.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/60 backdrop-blur-sm overscroll-contain"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
          }}
          data-testid="modal-backdrop"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className={`relative w-full ${maxWidth} bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl ring-1 ring-slate-900/5 overflow-hidden max-h-[94dvh] sm:max-h-[90dvh] flex flex-col outline-none`}
          >
            <div className="h-1.5 bg-gradient-to-r from-brand-navy via-brand-teal to-brand-orange shrink-0" />

            {(title || subtitle) && (
              <div className="flex items-start justify-between gap-4 px-5 sm:px-7 pt-5 sm:pt-6 pb-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {icon && (
                    <div className="w-10 h-10 rounded-2xl bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0">
                      {icon}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 id={labelledBy} className="text-lg font-extrabold text-brand-navy leading-tight">
                      {title}
                    </h3>
                    {subtitle && <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5">{subtitle}</p>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="p-2 -mr-2 -mt-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="px-5 sm:px-7 py-5 sm:py-6 overflow-y-auto overscroll-contain flex-1">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Small labelled form field wrapper with required asterisk + error text */
export function Field({ label, required, error, hint, htmlFor, children, right }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={htmlFor} className="text-xs font-bold text-slate-700 flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-red-500" aria-hidden="true">*</span>}
        </label>
        {right}
      </div>
      {children}
      {error ? (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} role="alert" className="text-[11px] text-red-600 mt-1.5 font-semibold">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] text-slate-400 mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
}

export const inputClass = (hasError) =>
  `w-full py-2.5 rounded-xl border bg-white text-[13px] font-medium text-slate-800 placeholder:text-slate-400 transition-shadow focus:outline-none focus:ring-4 ${
    hasError
      ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
      : 'border-slate-200 hover:border-slate-300 focus:ring-brand-teal/15 focus:border-brand-teal'
  }`;
