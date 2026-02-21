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

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  createdAt: string;
  updatedAt: string;
}

export interface Scaling {
  id: string;
  recipeId: string;
  recipeName: string;
  desiredWeight: number;
  scaledIngredients: ScaledIngredient[];
  createdAt: string;
}

export interface ScaledIngredient {
  ingredientId: string;
  ingredientName: string;
  originalWeight: number;
  scaledWeight: number;
  percentage: number;
  isFlour: boolean;
}

export const STORAGE_KEYS = {
  INGREDIENTS: "bakers-notebook:ingredients",
  RECIPES: "bakers-notebook:recipes",
  SCALINGS: "bakers-notebook:scalings",
} as const;
