export type ConversionLogEntry = {
  base: string;
  createdAt: string;
  id: string;
  inputAmount: number;
  outputAmount: number;
  quote: string;
  rate: number;
};

export type NewConversionLogEntry = Omit<
  ConversionLogEntry,
  "createdAt" | "id"
>;
