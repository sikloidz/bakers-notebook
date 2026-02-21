import type { Ingredient, RecipeIngredient, ScaledIngredient } from "@/types";

export function calculatePercentages(
  recipeIngredients: RecipeIngredient[],
  allIngredients: Ingredient[]
): RecipeIngredient[] {
  const flourMap = new Map(allIngredients.map((i) => [i.id, i.isFlour]));
  const totalFlour = recipeIngredients
    .filter((ri) => flourMap.get(ri.ingredientId))
    .reduce((sum, ri) => sum + ri.weight, 0);

  if (totalFlour === 0) return recipeIngredients;

  return recipeIngredients.map((ri) => ({
    ...ri,
    percentage: (ri.weight / totalFlour) * 100,
  }));
}

export function totalWeight(recipeIngredients: RecipeIngredient[]): number {
  return recipeIngredients.reduce((sum, ri) => sum + ri.weight, 0);
}

export function totalPercentage(recipeIngredients: RecipeIngredient[]): number {
  return recipeIngredients.reduce((sum, ri) => sum + (ri.percentage ?? 0), 0);
}

export function scaleRecipe(
  recipeIngredients: RecipeIngredient[],
  desiredWeight: number,
  allIngredients: Ingredient[]
): ScaledIngredient[] {
  const withPct = calculatePercentages(recipeIngredients, allIngredients);
  const totalPct = totalPercentage(withPct);
  if (totalPct === 0) return [];

  const ingredientMap = new Map(allIngredients.map((i) => [i.id, i]));
  const flourWeight = Math.ceil((desiredWeight / totalPct) * 100);

  return withPct.map((ri) => {
    const ingredient = ingredientMap.get(ri.ingredientId);
    return {
      ingredientId: ri.ingredientId,
      ingredientName: ingredient?.name ?? "Unknown",
      originalWeight: ri.weight,
      scaledWeight: Math.round((flourWeight * (ri.percentage ?? 0)) / 100),
      percentage: ri.percentage ?? 0,
      isFlour: ingredient?.isFlour ?? false,
    };
  });
}
