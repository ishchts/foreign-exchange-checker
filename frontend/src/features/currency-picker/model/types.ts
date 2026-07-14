export type CurrencyOption = {
  code: string;
  flag: string;
  name: string;
};

export type CurrencyGroups = {
  other: CurrencyOption[];
  popular: CurrencyOption[];
};
