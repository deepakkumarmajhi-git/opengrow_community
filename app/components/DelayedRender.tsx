"use client";

import { useState, useEffect, ReactNode } from "react";

interface DelayedRenderProps {
  children: ReactNode;
  delay?: number;
}

/**
 * Only renders children after a specified delay.
 * Useful for preventing "flashing" of loading states for fast connections.
 */
export default function DelayedRender({ children, delay = 400 }: DelayedRenderProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldRender) return null;

  return <>{children}</>;
}
