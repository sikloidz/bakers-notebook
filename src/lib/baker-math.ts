import type {
  Ingredient,
  RecipeIngredient,
  RecipeStage,
  ScaledIngredient,
  StageIngredient,
} from "@/types";

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

// Returns a map from ingredientId -> total grams allocated from the formula across all stages.
export function calculateStageAllocations(
  stages: RecipeStage[]
): Map<string, number> {
  const allocations = new Map<string, number>();
  for (const stage of stages) {
    for (const si of stage.ingredients) {
      if (si.fromFormula) {
        allocations.set(
          si.ingredientId,
          (allocations.get(si.ingredientId) ?? 0) + si.weight
        );
      }
    }
  }
  return allocations;
}

// Returns the implicit final mix: formula ingredients not fully allocated to named stages.
export function calculateFinalMix(
  stages: RecipeStage[],
  formulaIngredients: RecipeIngredient[]
): StageIngredient[] {
  const allocations = calculateStageAllocations(stages);
  return formulaIngredients
    .map((ri) => ({
      ingredientId: ri.ingredientId,
      weight: ri.weight - (allocations.get(ri.ingredientId) ?? 0),
      fromFormula: true as const,
    }))
    .filter((si) => si.weight > 0);
}

// Sum of all flour weights within a set of stage ingredients.
export function stageFlourWeight(
  stageIngredients: StageIngredient[],
  allIngredients: Ingredient[]
): number {
  const flourMap = new Map(allIngredients.map((i) => [i.id, i.isFlour]));
  return stageIngredients
    .filter((si) => flourMap.get(si.ingredientId))
    .reduce((sum, si) => sum + si.weight, 0);
}

// Total weight of all ingredients in a stage (including stage-only extras).
export function stageTotalWeight(stageIngredients: StageIngredient[]): number {
  return stageIngredients.reduce((sum, si) => sum + si.weight, 0);
}

// Scales stage ingredient weights by a linear factor.
export function scaleStages(
  stages: RecipeStage[],
  scaleFactor: number
): RecipeStage[] {
  return stages.map((stage) => ({
    ...stage,
    ingredients: stage.ingredients.map((si) => ({
      ...si,
      weight: Math.round(si.weight * scaleFactor),
    })),
  }));
}
