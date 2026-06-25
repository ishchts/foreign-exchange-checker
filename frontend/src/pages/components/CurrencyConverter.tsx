export const CurrencyConverter = () => {
  return (
    <section aria-labelledby="converter-title">
      <h2
        id="converter-title"
        className="typography-preset-2 mb-200 text-neutral-0"
      >
        CHECK THE RATE
      </h2>

      <div className="rounded-20 bg-[#171717] h-[223px]">
        <div className="grid gap-150 p-200 md:grid-cols-[1fr_48px_1fr] md:items-end md:gap-150 md:p-250">
          <div className="min-w-0 rounded-12 border border-[#2a2a2a] bg-[#1f1f1f] p-250">
            <label
              htmlFor="send-amount"
              className="typography-preset-5-medium mb-150 block text-neutral-200"
            >
              SEND
            </label>

            <div className="flex min-h-600 min-w-0 items-center gap-200">
              <input
                id="send-amount"
                className="typography-preset-1 block min-w-0 flex-1 bg-transparent text-neutral-0 outline-none"
                defaultValue="1,000"
                inputMode="decimal"
                aria-label="Amount to send"
              />

              <button
                type="button"
                className="typography-preset-5-medium flex shrink-0 items-center gap-100 rounded-8 bg-[#2a2a2a] px-150 py-125 text-neutral-0"
                aria-label="Select send currency"
              >
                <img
                  src="/images/flags/us.webp"
                  alt=""
                  className="size-200 rounded-full"
                />
                USD
                <span aria-hidden="true">▾</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center pb-150">
            <button
              type="button"
              className="flex size-400 items-center justify-center rounded-10 border border-[#2a2a2a] bg-[#1f1f1f] text-neutral-0"
              aria-label="Swap currencies"
            >
              <img
                src="/images/icon-exchange.svg"
                alt=""
                className="size-200"
              />
            </button>
          </div>

          <div className="min-w-0 rounded-12 border border-[#2a2a2a] bg-[#1f1f1f] p-250">
            <label
              htmlFor="receive-amount"
              className="typography-preset-5-medium mb-150 block text-neutral-200"
            >
              RECEIVE
            </label>

            <div className="flex min-h-600 min-w-0 items-center gap-200">
              <output
                id="receive-amount"
                className="typography-preset-1 block min-w-0 flex-1 text-brand-lime"
              >
                853.02
              </output>

              <button
                type="button"
                className="typography-preset-5-medium flex shrink-0 items-center gap-100 rounded-8 bg-[#2a2a2a] px-150 py-125 text-neutral-0"
                aria-label="Select receive currency"
              >
                <img
                  src="/images/flags/eu.webp"
                  alt=""
                  className="size-200 rounded-full"
                />
                EUR
                <span aria-hidden="true">▾</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-[#2a2a2a] px-200 py-200 md:flex md:items-center md:justify-between md:px-250">
          <p className="typography-preset-5 text-neutral-0">
            1 USD = 0.8530 EUR
          </p>

          <div className="mt-200 flex flex-wrap gap-100 md:mt-0">
            <button
              type="button"
              className="typography-preset-5-medium flex h-400 w-[117px] items-center justify-center gap-100 rounded-6 bg-brand-lime text-black"
            >
              <img
                src="/images/icon-star-filled.svg"
                alt=""
                className="size-200"
              />
              FAVORITED
            </button>

            <button
              type="button"
              className="typography-preset-5-medium h-400 w-[132px] rounded-6 border"
            >
              LOG CONVERSION
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
