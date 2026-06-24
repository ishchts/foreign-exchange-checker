import { Headline } from "./components/Headline";
import { MarketTicker } from "./components/MarketTicker";

export const Home = () => {
  return (
    <div className="max-w-325 m-auto pt-15">
      <Headline />
      <MarketTicker />
    </div>
  );
};
