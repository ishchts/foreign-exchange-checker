import { Headline } from "./components/headline";
import { MarketTicker } from "./components/MarketTicker";

export const Home = () => {
  return (
    <div className="max-w-325 m-auto pt-15">
      <Headline />
      <MarketTicker />
    </div>
  );
};
