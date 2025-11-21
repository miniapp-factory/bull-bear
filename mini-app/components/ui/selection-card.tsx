"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface SelectionCardProps {
  asset: "BTC" | "ETH";
  onSelect: () => void;
  selected: boolean;
}

export function SelectionCard({
  asset,
  onSelect,
  selected,
}: SelectionCardProps) {
  return (
    <Button
      variant={selected ? "default" : "outline"}
      size="lg"
      className="flex flex-col items-center gap-2 w-32 h-32"
      onClick={onSelect}
    >
      <span className="text-4xl font-bold">{asset}</span>
      <span className="text-sm">{asset === "BTC" ? "Bear" : "Bull"}</span>
    </Button>
  );
}
