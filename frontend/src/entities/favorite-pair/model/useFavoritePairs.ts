import { createLocalStorageStore } from "@/shared/lib/createLocalStorageStore";
import { useCallback } from "react";

import type { FavoritePair } from "./types";

const STORAGE_KEY = "fx-checker:favorite-pairs:v1";
const EMPTY_FAVORITE_PAIRS: FavoritePair[] = [];

const isFavoritePair = (value: unknown): value is FavoritePair => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const pair = value as Record<string, unknown>;

  return (
    typeof pair.base === "string" &&
    typeof pair.quote === "string" &&
    typeof pair.createdAt === "string"
  );
};

const favoritePairsStore = createLocalStorageStore<FavoritePair[]>({
  fallbackValue: EMPTY_FAVORITE_PAIRS,
  isValid: (value): value is FavoritePair[] =>
    Array.isArray(value) && value.every(isFavoritePair),
  key: STORAGE_KEY,
});

export const useFavoritePairs = () => {
  const favoritePairs = favoritePairsStore.useValue();

  const isFavorite = useCallback(
    (base: string, quote: string) =>
      favoritePairs.some(
        (pair) => pair.base === base && pair.quote === quote,
      ),
    [favoritePairs],
  );

  const toggleFavorite = useCallback((base: string, quote: string) => {
    let isNowFavorite = false;

    favoritePairsStore.write((currentPairs) => {
      const pairExists = currentPairs.some(
        (pair) => pair.base === base && pair.quote === quote,
      );

      if (pairExists) {
        return currentPairs.filter(
          (pair) => pair.base !== base || pair.quote !== quote,
        );
      }

      isNowFavorite = true;

      return [
        ...currentPairs,
        { base, quote, createdAt: new Date().toISOString() },
      ];
    });

    return isNowFavorite;
  }, []);

  return { favoritePairs, isFavorite, toggleFavorite };
};
