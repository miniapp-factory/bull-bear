"use client";

export interface PointsDisplayProps {
  points: number;
}

export function PointsDisplay({ points }: PointsDisplayProps) {
  return (
    <div className="absolute top-4 right-4 text-white text-xl font-semibold">
      Score: {points}
    </div>
  );
}
