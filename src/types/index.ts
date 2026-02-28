export interface Ingredient {
  id: string;
  name: string;
  isFlour: boolean;
}

export interface RecipeIngredient {
  ingredientId: string;
  weight: number; // grams
  percentage?: number; // baker's percentage (computed)
}

export interface StageIngredient {
  ingredientId: string;
  weight: number; // grams allocated to this stage
  fromFormula: boolean; // false = extra ingredient not in the overall formula (e.g. starter)
}

export interface RecipeStage {
  id: string;
  name: string;
  notes?: string;
  percentageMode: boolean; // true = stage was authored using stage-relative % entry
  ingredients: StageIngredient[];
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  stages?: RecipeStage[]; // absent/empty = single-stage recipe
  createdAt: string;
  updatedAt: string;
}

export interface ScaledIngredient {
  ingredientId: string;
  ingredientName: string;
  originalWeight: number;
  scaledWeight: number;
  percentage: number;
  isFlour: boolean;
}

export interface ScaledStageIngredient {
  ingredientId: string;
  ingredientName: string;
  scaledWeight: number;
  fromFormula: boolean;
}

export interface ScaledStage {
  stageId: string;
  stageName: string;
  ingredients: ScaledStageIngredient[];
}

export interface Scaling {
  id: string;
  recipeId: string;
  recipeName: string;
  desiredWeight: number;
  scaledIngredients: ScaledIngredient[];
  scaledStages?: ScaledStage[];
  createdAt: string;
}

export const STORAGE_KEYS = {
  INGREDIENTS: "bakers-notebook:ingredients",
  RECIPES: "bakers-notebook:recipes",
  SCALINGS: "bakers-notebook:scalings",
} as const;
