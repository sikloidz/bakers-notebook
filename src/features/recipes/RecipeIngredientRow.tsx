import { Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import type { Ingredient } from "@/types";

interface RecipeIngredientRowProps {
  ingredientId: string;
  weight: number;
  percentage: number;
  allIngredients: Ingredient[];
  percentageDisabled: boolean;
  onChangeIngredient: (id: string) => void;
  onChangeWeight: (weight: number) => void;
  onChangePercentage: (percentage: number) => void;
  onRemove: () => void;
}

export function RecipeIngredientRow({
  ingredientId,
  weight,
  percentage,
  allIngredients,
  percentageDisabled,
  onChangeIngredient,
  onChangeWeight,
  onChangePercentage,
  onRemove,
}: RecipeIngredientRowProps) {
  return (
    <div className="flex items-center gap-3">
      <select
        value={ingredientId}
        onChange={(e) => onChangeIngredient(e.target.value)}
        className="flex-1 rounded-md border border-wheat bg-white px-3 py-2 text-sm text-brown-dark focus:border-crust focus:ring-1 focus:ring-crust focus:outline-none"
      >
        <option value="">Select ingredient...</option>
        {allIngredients.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name} {i.isFlour ? "(flour)" : ""}
          </option>
        ))}
      </select>
      <input
        type="number"
        min={0}
        value={weight || ""}
        onChange={(e) => onChangeWeight(Number(e.target.value))}
        placeholder="grams"
        className="w-24 rounded-md border border-wheat bg-white px-3 py-2 text-sm text-right tabular-nums text-brown-dark focus:border-crust focus:ring-1 focus:ring-crust focus:outline-none"
      />
      <input
        type="number"
        min={0}
        step={0.1}
        value={percentage || ""}
        onChange={(e) => onChangePercentage(Number(e.target.value))}
        placeholder="%"
        disabled={percentageDisabled}
        className="w-24 rounded-md border border-wheat bg-white px-3 py-2 text-sm text-right tabular-nums text-brown-dark focus:border-crust focus:ring-1 focus:ring-crust focus:outline-none disabled:bg-parchment disabled:text-brown-light"
      />
      <Button variant="ghost" size="sm" onClick={onRemove} type="button">
        <Trash2 size={14} />
      </Button>
    </div>
  );
}
