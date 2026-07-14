import { useSyncExternalStore } from "react";

type StoreUpdater<T> = T | ((currentValue: T) => T);

type LocalStorageStoreOptions<T> = {
  fallbackValue: T;
  isValid: (value: unknown) => value is T;
  key: string;
};

export const createLocalStorageStore = <T>({
  fallbackValue,
  isValid,
  key,
}: LocalStorageStoreOptions<T>) => {
  const listeners = new Set<() => void>();
  let cachedRawValue: string | null | undefined;
  let cachedValue = fallbackValue;

  const read = (): T => {
    if (typeof window === "undefined") {
      return fallbackValue;
    }

    try {
      const rawValue = window.localStorage.getItem(key);

      if (rawValue === cachedRawValue) {
        return cachedValue;
      }

      cachedRawValue = rawValue;

      if (rawValue === null) {
        cachedValue = fallbackValue;
        return cachedValue;
      }

      const parsedValue: unknown = JSON.parse(rawValue);
      cachedValue = isValid(parsedValue) ? parsedValue : fallbackValue;
      return cachedValue;
    } catch {
      return cachedValue;
    }
  };

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const write = (updater: StoreUpdater<T>) => {
    const currentValue = read();
    const nextValue =
      typeof updater === "function"
        ? (updater as (value: T) => T)(currentValue)
        : updater;
    const serializedValue = JSON.stringify(nextValue);

    cachedRawValue = serializedValue;
    cachedValue = nextValue;

    try {
      window.localStorage.setItem(key, serializedValue);
    } catch {
      // Keep the in-memory value when storage is unavailable.
    }

    notify();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key) {
        return;
      }

      cachedRawValue = undefined;
      notify();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", handleStorage);
    };
  };

  const useValue = () =>
    useSyncExternalStore(subscribe, read, () => fallbackValue);

  return { useValue, write };
};
