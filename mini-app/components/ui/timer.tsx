"use client";

import { useEffect, useState } from "react";

export interface TimerProps {
  duration: number; // seconds
  onComplete: () => void;
}

export function Timer({ duration, onComplete }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(duration);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, onComplete]);

  return (
    <div className="text-2xl font-mono">
      {secondsLeft}s
    </div>
  );
}
