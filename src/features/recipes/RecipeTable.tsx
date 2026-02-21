import type { Ingredient, RecipeIngredient } from "@/types";
import {
  calculatePercentages,
  totalWeight,
  totalPercentage,
} from "@/lib/baker-math";

interface RecipeTableProps {
  recipeIngredients: RecipeIngredient[];
  allIngredients: Ingredient[];
}

export function RecipeTable({ recipeIngredients, allIngredients }: RecipeTableProps) {
  const ingredientMap = new Map(allIngredients.map((i) => [i.id, i]));
  const withPct = calculatePercentages(recipeIngredients, allIngredients);
  const total = totalWeight(withPct);
  const totalPct = totalPercentage(withPct);

  return (
    <div className="overflow-hidden rounded-lg border border-wheat bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-wheat bg-cream-dark">
            <th className="px-4 py-2 text-left font-medium text-brown">Ingredient</th>
            <th className="px-4 py-2 text-right font-medium text-brown">Weight (g)</th>
            <th className="px-4 py-2 text-right font-medium text-brown">Baker's %</th>
          </tr>
        </thead>
        <tbody>
          {withPct.map((ri) => {
            const ingredient = ingredientMap.get(ri.ingredientId);
            return (
              <tr key={ri.ingredientId} className="border-b border-wheat/50">
                <td className="px-4 py-2 text-brown-dark">
                  {ingredient?.name ?? "Unknown"}
                  {ingredient?.isFlour && (
                    <span className="ml-2 text-xs text-crust">(flour)</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
                  {ri.weight}
                </td>
                <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
                  {(ri.percentage ?? 0).toFixed(1)}%
                </td>
              </tr>
            );
          })}
          <tr className="bg-cream-dark font-semibold">
            <td className="px-4 py-2 text-brown-dark">Total</td>
            <td className="px-4 py-2 text-right tabular-nums text-brown-dark">{total}</td>
            <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
              {totalPct.toFixed(1)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
