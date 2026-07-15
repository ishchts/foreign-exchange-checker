import { createLocalStorageStore } from "@/shared/lib/createLocalStorageStore";
import { useCallback } from "react";

import type {
  ConversionLogEntry,
  NewConversionLogEntry,
} from "./types";

const STORAGE_KEY = "fx-checker:conversion-log:v1";
const EMPTY_CONVERSION_LOG: ConversionLogEntry[] = [];

const isConversionLogEntry = (value: unknown): value is ConversionLogEntry => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.id === "string" &&
    typeof entry.base === "string" &&
    typeof entry.quote === "string" &&
    typeof entry.inputAmount === "number" &&
    Number.isFinite(entry.inputAmount) &&
    typeof entry.outputAmount === "number" &&
    Number.isFinite(entry.outputAmount) &&
    typeof entry.rate === "number" &&
    Number.isFinite(entry.rate) &&
    typeof entry.createdAt === "string"
  );
};

const conversionLogStore = createLocalStorageStore<ConversionLogEntry[]>({
  fallbackValue: EMPTY_CONVERSION_LOG,
  isValid: (value): value is ConversionLogEntry[] =>
    Array.isArray(value) && value.every(isConversionLogEntry),
  key: STORAGE_KEY,
});

export const useConversionLog = () => {
  const entries = conversionLogStore.useValue();

  const addEntry = useCallback((entry: NewConversionLogEntry) => {
    const newEntry: ConversionLogEntry = {
      ...entry,
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
    };

    conversionLogStore.write((currentEntries) => [
      newEntry,
      ...currentEntries,
    ]);

    return newEntry;
  }, []);

  const removeEntry = useCallback((id: string) => {
    conversionLogStore.write((currentEntries) =>
      currentEntries.filter((entry) => entry.id !== id),
    );
  }, []);

  const clearEntries = useCallback(() => {
    conversionLogStore.write(EMPTY_CONVERSION_LOG);
  }, []);

  return { addEntry, clearEntries, entries, removeEntry };
};
