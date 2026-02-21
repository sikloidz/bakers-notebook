import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { generateId } from "@/lib/id";
import type { Ingredient } from "@/types";
import { STORAGE_KEYS } from "@/types";

export function useIngredients() {
  const [ingredients, setIngredients] = useLocalStorage<Ingredient[]>(
    STORAGE_KEYS.INGREDIENTS,
    []
  );

  const addIngredient = useCallback(
    (name: string, isFlour: boolean) => {
      const ingredient: Ingredient = { id: generateId(), name, isFlour };
      setIngredients((prev) => [...prev, ingredient]);
      return ingredient;
    },
    [setIngredients]
  );

  const updateIngredient = useCallback(
    (id: string, name: string, isFlour: boolean) => {
      setIngredients((prev) =>
        prev.map((i) => (i.id === id ? { ...i, name, isFlour } : i))
      );
    },
    [setIngredients]
  );

  const deleteIngredient = useCallback(
    (id: string) => {
      setIngredients((prev) => prev.filter((i) => i.id !== id));
    },
    [setIngredients]
  );

  return { ingredients, addIngredient, updateIngredient, deleteIngredient };
}
