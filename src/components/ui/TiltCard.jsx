import React, { useRef } from 'react';

const canTilt = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Wraps content in a perspective container that tilts toward the pointer
 * and shows a soft moving glare. No effect on touch devices.
 */
export default function TiltCard({ children, className = '', max = 8, ...rest }) {
  const ref = useRef(null);
  const frame = useRef(0);

  const onMove = (e) => {
    if (!ref.current || !canTilt()) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty('--rx', `${(0.5 - py) * max}deg`);
      el.style.setProperty('--ry', `${(px - 0.5) * max}deg`);
      el.style.setProperty('--gx', `${px * 100}%`);
      el.style.setProperty('--gy', `${py * 100}%`);
      el.style.setProperty('--glare', '1');
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--glare', '0');
  };

  return (
    <div className="[perspective:1100px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        ref={ref}
        {...rest}
        className={`relative [transform-style:preserve-3d] transition-transform duration-200 ease-out ${className}`}
        style={{ transform: 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))' }}
      >
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-20"
          style={{
            opacity: 'var(--glare,0)',
            background: 'radial-gradient(500px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.28), transparent 45%)',
            mixBlendMode: 'soft-light',
          }}
        />
      </div>
    </div>
  );
}
