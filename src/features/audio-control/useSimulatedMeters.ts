import { useEffect, useState } from 'react';

const REST_LEVEL = 20;

/**
 * Produces a gently drifting level per channel so the meters have something to
 * show without a DSP attached. Local presentation only — no device involved.
 */
export function useSimulatedMeters(channelCount: number, intervalMs = 220): number[] {
  const [levels, setLevels] = useState<number[]>(() =>
    Array.from({ length: channelCount }, () => REST_LEVEL),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setLevels((current) =>
        Array.from({ length: channelCount }, (_unused, index) => {
          const next = (current[index] ?? REST_LEVEL) + (Math.random() - 0.45) * 26;
          return Math.min(96, Math.max(4, next));
        }),
      );
    }, intervalMs);

    return () => clearInterval(timer);
  }, [channelCount, intervalMs]);

  // Derived, not stored: a channel-count change is reflected on the next render
  // without a second state update.
  return levels.length === channelCount
    ? levels
    : Array.from({ length: channelCount }, (_unused, index) => levels[index] ?? REST_LEVEL);
}
