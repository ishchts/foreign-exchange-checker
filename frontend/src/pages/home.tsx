import { CurrencyConverter } from "./components/CurrencyConverter";
import { Headline } from "./components/Headline";
import { MarketTicker } from "./components/MarketTicker";

export const Home = () => {
  return (
    <div className="max-w-360 m-auto pt-15">
      <Headline />
      <MarketTicker />
      <div className="max-w-275 m-auto pt-600 px-400">
        <CurrencyConverter />
      </div>
    </div>
  );
};
