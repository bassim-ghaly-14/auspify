import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
}) {
  const previousActiveEl = useRef(null);
  const dialogRef = useRef(null);

  const titleId = useId() + '-title';
  const descId = useId() + '-description';

  // Focus management: move focus into the dialog on open and
  // restore focus to the previously focused element on close.
  useEffect(() => {
    if (!open) return;

    previousActiveEl.current = document.activeElement;

    const dialog = dialogRef.current;
    if (dialog) {
      dialog.setAttribute('tabIndex', '-1');
      dialog.focus();
    }

    return () => {
      const active = previousActiveEl.current;
      if (active && typeof active.focus === 'function') {
        active.focus();
      }
    };
  }, [open]);

  // Prevent background scrolling while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Focus trap: keep Tab/Shift+Tab within the dialog while open.
  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = Array.from(
      dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Close on Escape when enabled.
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  // Render nothing when closed.
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop — clicking it dismisses the dialog when enabled. */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className={`relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900 ${className}`}
        >
          <div className="flex-1 overflow-y-auto p-8">
            {title ? (
              <h2
                id={titleId}
                className="mb-2 text-lg font-bold text-slate-900 dark:text-white"
              >
                {title}
              </h2>
            ) : null}

            {description ? (
              <p
                id={descId}
                className="mb-6 leading-relaxed text-sm text-slate-600 dark:text-slate-400"
              >
                {description}
              </p>
            ) : null}

            <div className="mt-2">{children}</div>
          </div>

          {footer ? (
            <div className="shrink-0 border-t border-slate-200 p-4 dark:border-white/10 sm:p-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                {footer}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Dialog;
