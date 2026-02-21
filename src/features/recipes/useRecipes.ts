import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { generateId } from "@/lib/id";
import type { Recipe, RecipeIngredient } from "@/types";
import { STORAGE_KEYS } from "@/types";

export function useRecipes() {
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>(
    STORAGE_KEYS.RECIPES,
    []
  );

  const addRecipe = useCallback(
    (name: string, description: string, ingredients: RecipeIngredient[]) => {
      const now = new Date().toISOString();
      const recipe: Recipe = {
        id: generateId(),
        name,
        description,
        ingredients,
        createdAt: now,
        updatedAt: now,
      };
      setRecipes((prev) => [...prev, recipe]);
      return recipe;
    },
    [setRecipes]
  );

  const updateRecipe = useCallback(
    (
      id: string,
      name: string,
      description: string,
      ingredients: RecipeIngredient[]
    ) => {
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, name, description, ingredients, updatedAt: new Date().toISOString() }
            : r
        )
      );
    },
    [setRecipes]
  );

  const deleteRecipe = useCallback(
    (id: string) => {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    },
    [setRecipes]
  );

  const getRecipe = useCallback(
    (id: string) => recipes.find((r) => r.id === id),
    [recipes]
  );

  return { recipes, addRecipe, updateRecipe, deleteRecipe, getRecipe };
}
