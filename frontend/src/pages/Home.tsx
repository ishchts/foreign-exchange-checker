import type { CurrencyPair } from "@/entities/currency-pair";
import { useState } from "react";

import { CurrencyConverter } from "./components/CurrencyConverter";
import { CurrencyInsights } from "./components/CurrencyInsights";
import { Headline } from "./components/Headline";
import { MarketTicker } from "./components/MarketTicker";

export const Home = () => {
  const [amount, setAmount] = useState("");
  const [pair, setPair] = useState<CurrencyPair>({
    base: "USD",
    quote: "EUR",
  });

  return (
    <div className="mx-auto max-w-360">
      <Headline />
      <MarketTicker />
      <main className="mx-auto max-w-275 px-200 pt-600 md:px-400">
        <CurrencyConverter
          amount={amount}
          onAmountChange={setAmount}
          pair={pair}
          onPairChange={setPair}
        />
        <CurrencyInsights
          amount={amount}
          pair={pair}
          onPairChange={setPair}
        />
      </main>
    </div>
  );
};
