"use client";

import { useEffect, useState } from "react";
import { SelectionCard } from "@/components/ui/selection-card";
import { Timer } from "@/components/ui/timer";
import { useMiniAppContext } from "@/components/context/miniapp-provider";
import { usePrivy } from "@privy-io/react-auth";
import { TwitterShareButton } from "react-share";

export function CryptoBattle() {
  const { sdk, isInMiniApp } = useMiniAppContext();
  const { ready: privyReady, user } = usePrivy();
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
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
      setPoints((p) => p + 1);
    }
    setGameOver(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
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
      {gameOver && (
        <div className="text-lg">
          {selected === (btcPrice! > ethPrice! ? "BTC" : "ETH")
            ? "Correct! +1 point."
            : "Wrong! No points."}
        </div>
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
