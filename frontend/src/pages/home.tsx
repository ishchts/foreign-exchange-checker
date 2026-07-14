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
  const normalizedAmount = Number(amount.replace(",", "."));
  const hasValidAmount =
    amount.length > 0 &&
    Number.isFinite(normalizedAmount) &&
    normalizedAmount > 0;

  return (
    <div className="max-w-360 m-auto pt-15">
      <Headline />
      <MarketTicker />
      <div className="max-w-275 m-auto pt-600 px-400">
        <CurrencyConverter
          amount={amount}
          onAmountChange={setAmount}
          pair={pair}
          onPairChange={setPair}
        />
        <CurrencyInsights pair={pair} hasValidAmount={hasValidAmount} />
      </div>
    </div>
  );
};
