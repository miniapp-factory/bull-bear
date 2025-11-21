"use client";

import { useEffect, useState } from "react";
import { SelectionCard } from "@/components/ui/selection-card";
import { Timer } from "@/components/ui/timer";
import { useMiniAppContext } from "@/components/context/miniapp-provider";
import { usePrivy } from "@privy-io/react-auth";
import { TwitterShareButton } from "react-share";
import { Chart } from "@/components/ui/chart";
import { PointsDisplay } from "@/components/ui/points-display";
import { Feedback } from "@/components/ui/feedback";

export function CryptoBattle() {
  const { sdk, isInMiniApp } = useMiniAppContext();
  const { ready: privyReady, user } = usePrivy();
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [ratioHistory, setRatioHistory] = useState<{ time: string; ratio: number }[]>([]);
  const [selected, setSelected] = useState<"BTC" | "ETH" | null>(null);
  const [points, setPoints] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Fetch prices every 5 seconds
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
        );
        const data = await res.json();
        setBtcPrice(data.bitcoin.usd);
        setEthPrice(data.ethereum.usd);
        const ratio = data.bitcoin.usd / data.ethereum.usd;
        setRatioHistory((prev) => [
          ...prev,
          { time: new Date().toLocaleTimeString(), ratio },
        ]);
      } catch (e) {
        console.error(e);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (asset: "BTC" | "ETH") => {
    setSelected(asset);
  };

  const evaluate = () => {
    if (btcPrice === null || ethPrice === null || !selected) return;
    const winner = btcPrice > ethPrice ? "BTC" : "ETH";
    if (winner === selected) {
      setPoints((p) => p + 10);
    }
    setGameOver(true);
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">BTC vs ETH Battle</h2>
      <div className="flex gap-4">
        <SelectionCard
          asset="BTC"
          selected={selected === "BTC"}
          onSelect={() => handleSelect("BTC")}
        />
        <SelectionCard
          asset="ETH"
          selected={selected === "ETH"}
          onSelect={() => handleSelect("ETH")}
        />
      </div>
      <Timer duration={20} onComplete={evaluate} />
      <Chart data={ratioHistory} />
      {gameOver && (
        <Feedback
          message={
            selected === (btcPrice! > ethPrice! ? "BTC" : "ETH")
              ? "WIN! +10 Points"
              : "LOSE! No points."
          }
          type={selected === (btcPrice! > ethPrice! ? "BTC" : "ETH") ? "win" : "lose"}
        />
      )}
      <div className="text-lg">Points: {points}</div>
      {privyReady && user && (
        <TwitterShareButton
          url={process.env.NEXT_PUBLIC_URL ?? ""}
          title={`I scored ${points} points in BTC vs ETH Battle!`}
        >
          Share on Twitter
        </TwitterShareButton>
      )}
    </div>
  );
}
