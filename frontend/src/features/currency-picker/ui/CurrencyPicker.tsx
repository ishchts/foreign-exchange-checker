import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

import { FLAG_BY_CURRENCY } from "../model/constants";
import type { CurrencyOption } from "../model/types";
import {
  EMPTY_CURRENCY_GROUPS,
  useCurrencies,
} from "../model/useCurrencies";

type CurrencyPickerProps = {
  label: string;
  onChange: (currency: string) => void;
  value: string;
};

const CurrencyFlag = ({ code, flag }: { code: string; flag?: string }) => {
  const flagCode = flag ?? FLAG_BY_CURRENCY[code];

  if (!flagCode) {
    return (
      <span
        aria-hidden="true"
        className="flex size-200 shrink-0 items-center justify-center rounded-full bg-[#3a3a3a] text-[8px] text-neutral-0"
      >
        {code.slice(0, 1)}
      </span>
    );
  }

  return (
    <img
      src={`/images/flags/${flagCode}.webp`}
      alt=""
      className="size-200 shrink-0 rounded-full object-cover"
    />
  );
};

const GroupHeading = ({
  count,
  children,
}: {
  children: string;
  count: number;
}) => (
  <>
    <span>{children}</span>
    <span>{count}</span>
  </>
);

export const CurrencyPicker = ({
  label,
  onChange,
  value,
}: CurrencyPickerProps) => {
  const [open, setOpen] = useState(false);
  const {
    data: currencyGroups = EMPTY_CURRENCY_GROUPS,
    isError,
    isPending,
  } = useCurrencies();

  const selectCurrency = (currency: string) => {
    onChange(currency);
    setOpen(false);
  };

  const renderCurrency = (currency: CurrencyOption) => {
    const isSelected = currency.code === value;

    return (
      <CommandItem
        key={currency.code}
        value={`${currency.code} ${currency.name}`}
        onSelect={() => selectCurrency(currency.code)}
      >
        <CurrencyFlag code={currency.code} flag={currency.flag} />
        <span className="w-[28px] shrink-0 text-neutral-0">
          {currency.code}
        </span>
        <span className="min-w-0 flex-1 truncate text-neutral-200">
          {currency.name}
        </span>
        {isSelected && (
          <Check aria-hidden="true" className="size-200 shrink-0 text-neutral-0" />
        )}
      </CommandItem>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          className="typography-preset-5-medium flex h-500 min-w-[88px] shrink-0 cursor-pointer items-center justify-center gap-100 rounded-8 border border-transparent bg-[#2a2a2a] px-150 text-neutral-0 outline-none transition-colors hover:bg-[#333] focus-visible:border-brand-lime"
        >
          <CurrencyFlag code={value} />
          <span>{value}</span>
          <ChevronDown aria-hidden="true" className="size-150 text-neutral-200" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        collisionPadding={16}
        className="w-[348px] max-w-[calc(100vw-32px)] rounded-8 border border-[#333] bg-[#1f1f1f] shadow-[0_16px_32px_rgba(0,0,0,0.35)]"
      >
        <Command>
          <CommandInput placeholder="Search currencies..." />
          <CommandList>
            {isPending && (
              <p className="typography-preset-5 px-200 py-400 text-center text-neutral-200">
                Loading currencies...
              </p>
            )}
            {isError && (
              <p className="typography-preset-5 px-200 py-400 text-center text-neutral-200">
                Could not load currencies.
              </p>
            )}
            {!isPending && !isError && (
              <>
                <CommandEmpty>No currencies found.</CommandEmpty>
                <CommandGroup
                  heading={
                    <GroupHeading count={currencyGroups.popular.length}>
                      POPULAR
                    </GroupHeading>
                  }
                >
                  {currencyGroups.popular.map(renderCurrency)}
                </CommandGroup>
                <CommandGroup
                  heading={
                    <GroupHeading count={currencyGroups.other.length}>
                      OTHER CURRENCIES
                    </GroupHeading>
                  }
                >
                  {currencyGroups.other.map(renderCurrency)}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
