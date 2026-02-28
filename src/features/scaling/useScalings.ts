import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { generateId } from "@/lib/id";
import type { Scaling, ScaledIngredient, ScaledStage } from "@/types";
import { STORAGE_KEYS } from "@/types";

export function useScalings() {
  const [scalings, setScalings] = useLocalStorage<Scaling[]>(
    STORAGE_KEYS.SCALINGS,
    []
  );

  const addScaling = useCallback(
    (
      recipeId: string,
      recipeName: string,
      desiredWeight: number,
      scaledIngredients: ScaledIngredient[],
      scaledStages?: ScaledStage[]
    ) => {
      const scaling: Scaling = {
        id: generateId(),
        recipeId,
        recipeName,
        desiredWeight,
        scaledIngredients,
        scaledStages:
          scaledStages && scaledStages.length > 0 ? scaledStages : undefined,
        createdAt: new Date().toISOString(),
      };
      setScalings((prev) => [scaling, ...prev]);
      return scaling;
    },
    [setScalings]
  );

  const deleteScaling = useCallback(
    (id: string) => {
      setScalings((prev) => prev.filter((s) => s.id !== id));
    },
    [setScalings]
  );

  const getScalingsForRecipe = useCallback(
    (recipeId: string) => scalings.filter((s) => s.recipeId === recipeId),
    [scalings]
  );

  return { scalings, addScaling, deleteScaling, getScalingsForRecipe };
}
