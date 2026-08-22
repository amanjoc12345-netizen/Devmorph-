'use client';

import React, { useEffect, useState } from 'react';

export default function Fireflies({ count = 20 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    const generated = Array.from({ length: count }).map(() => ({
      left: `${(Math.random() * 100).toFixed(2)}%`,
      top: `${(Math.random() * 100).toFixed(2)}%`,
      delay: `${(Math.random() * 8).toFixed(2)}s`,
      duration: `${(10 + Math.random() * 10).toFixed(2)}s`,
    }));
    setParticles(generated);
    setMounted(true);
  }, [count]);

  if (!mounted) {
    return <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />;
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute firefly"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
