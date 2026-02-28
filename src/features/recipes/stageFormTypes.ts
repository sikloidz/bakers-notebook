// Form-level types for the stage editor — separate from the persisted RecipeStage type.

export interface FormStageIngredient {
  ingredientId: string;
  weight: number; // always grams (source of truth for storage)
  percentage: number; // for percentage-mode display/entry
  fromFormula: boolean; // auto-derived: true if ingredient is in the overall formula
  inputMode: "weight" | "percentage"; // which field was last edited by the baker
}

export interface FormStage {
  id: string;
  name: string;
  notes: string;
  percentageMode: boolean; // true = baker is entering amounts as percentages
  ingredients: FormStageIngredient[];
}
