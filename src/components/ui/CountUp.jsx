import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/** Counts up to `to` the first time it scrolls into view. */
export default function CountUp({ to, decimals = 0, prefix = '', suffix = '', duration = 1.6, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return undefined;
    const c = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setVal });
    return () => c.stop();
  }, [inView, to, duration, reduce]);
  const shown = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString('en-IN');
  return <span ref={ref} className={`tabular-nums ${className}`}>{prefix}{shown}{suffix}</span>;
}
