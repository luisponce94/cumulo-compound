"use client";

import React, { useEffect, useRef, useState } from "react";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  currency?: boolean;
}

/**
 * NumberTicker (21st.dev signature)
 * Fluidly rolls numbers up and down with spring-like cubic Bézier easing.
 */
export function NumberTicker({
  value,
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    if (start === end) return;

    const duration = 650; // ms
    const startTime = performance.now();

    function easeOutCubic(x: number): number {
      return 1 - Math.pow(1 - x, 3);
    }

    let frameId: number;

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = start + (end - start) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(end);
        prevValue.current = end;
      }
    }

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [value]);

  const formatted = new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(displayValue);

  return (
    <span className={`inline-block tabular-nums tracking-tight ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
