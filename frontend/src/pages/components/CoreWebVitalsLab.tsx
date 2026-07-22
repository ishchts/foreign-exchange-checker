import { useState } from "react";

import { getAssetUrl } from "@/shared/lib/getAssetUrl";

export const CoreWebVitalsLab = () => {
  const [result, setResult] = useState("Interaction not tested");

  const simulateSlowInteraction = () => {
    const startedAt = performance.now();
    let calculations = 0;

    while (performance.now() - startedAt < 600) {
      calculations += Math.sqrt(Math.random());
    }

    setResult(`Main thread blocked for 600 ms (${Math.round(calculations)} ops)`);
  };

  return (
    <section
      aria-labelledby="cwv-lab-title"
      className="mx-auto max-w-275 px-200 pt-600 md:px-400"
    >
      <div className="mb-300 flex flex-col gap-200 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="typography-preset-5 mb-100 text-brand-lime">
            PERFORMANCE LAB
          </p>
          <h1 id="cwv-lab-title" className="typography-preset-1-tablet">
            Global markets, intentionally slow
          </h1>
        </div>

        <button
          type="button"
          onClick={simulateSlowInteraction}
          className="typography-preset-5-medium rounded-8 border border-brand-lime px-200 py-150 text-brand-lime hover:bg-brand-lime hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-lime"
        >
          BLOCK MAIN THREAD
        </button>
      </div>

      {/* Deliberately unoptimized: low priority and no reserved dimensions create LCP/CLS issues. */}
      <img
        src={getAssetUrl("images/cwv-lab-hero.png")}
        alt="A glowing world map and globe surrounded by foreign-exchange market charts"
        fetchPriority="low"
        decoding="sync"
        className="w-full rounded-12 border border-white/10 object-cover"
      />

      <p aria-live="polite" className="typography-preset-6 mt-150 text-neutral-200">
        {result}
      </p>
    </section>
  );
};
