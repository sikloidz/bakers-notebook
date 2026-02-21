import { useState, useCallback } from "react";
import { getItem, setItem } from "@/lib/storage";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getItem(key, initialValue)
  );

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        setItem(key, next);
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue] as const;
}
