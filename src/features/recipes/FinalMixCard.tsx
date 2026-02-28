import type { Ingredient, RecipeIngredient, RecipeStage } from "@/types";
import { calculateFinalMix } from "@/lib/baker-math";

interface FinalMixCardProps {
  stages: RecipeStage[];
  formulaIngredients: RecipeIngredient[];
  allIngredients: Ingredient[];
  carryInWeight: number; // cumulative weight from all named stages
  lastStageName: string; // label for the carry-in row
}

export function FinalMixCard({
  stages,
  formulaIngredients,
  allIngredients,
  carryInWeight,
  lastStageName,
}: FinalMixCardProps) {
  const ingredientMap = new Map(allIngredients.map((i) => [i.id, i]));
  const flourMap = new Map(allIngredients.map((i) => [i.id, i.isFlour]));

  const finalMix = calculateFinalMix(stages, formulaIngredients);

  // Always render when there is a carry-in, even if no formula remainder
  if (finalMix.length === 0 && carryInWeight === 0) return null;

  const formulaFlourTotal = formulaIngredients
    .filter((ri) => flourMap.get(ri.ingredientId))
    .reduce((sum, ri) => sum + ri.weight, 0);

  const finalMixFlourTotal = finalMix
    .filter((si) => flourMap.get(si.ingredientId))
    .reduce((sum, si) => sum + si.weight, 0);

  const remainingWeight = finalMix.reduce((sum, si) => sum + si.weight, 0);
  const totalDoughWeight = carryInWeight + remainingWeight;

  function getDisplayPct(ingredientId: string, weight: number): number | null {
    const isFlour = flourMap.get(ingredientId) ?? false;
    if (isFlour && formulaFlourTotal > 0) {
      return (weight / formulaFlourTotal) * 100;
    }
    if (!isFlour && finalMixFlourTotal > 0) {
      return (weight / finalMixFlourTotal) * 100;
    }
    return null;
  }

  const carryInLabel = lastStageName
    ? `${lastStageName} (carry-in)`
    : "Carry-in from previous stages";

  return (
    <div className="overflow-hidden rounded-lg border border-wheat bg-white">
      <div className="bg-cream-dark px-4 py-3">
        <h3 className="font-serif text-base font-semibold text-brown">
          Final Mix
        </h3>
        <p className="mt-0.5 text-xs text-brown-light">
          Combine carry-in with remaining ingredients
        </p>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-wheat">
            <th className="px-4 py-2 text-left font-medium text-brown">
              Ingredient
            </th>
            <th className="px-4 py-2 text-right font-medium text-brown">
              Weight (g)
            </th>
            <th className="px-4 py-2 text-right font-medium text-brown">%</th>
          </tr>
        </thead>
        <tbody>
          {/* Carry-in row — the dough from all previous stages */}
          {carryInWeight > 0 && (
            <tr className="border-b border-wheat/50 bg-parchment">
              <td className="px-4 py-2 font-medium text-brown">
                {carryInLabel}
              </td>
              <td className="px-4 py-2 text-right tabular-nums font-semibold text-brown-dark">
                {carryInWeight}
              </td>
              <td className="px-4 py-2 text-right tabular-nums text-brown-light">
                —
              </td>
            </tr>
          )}

          {/* Remaining formula ingredients */}
          {finalMix.map((si) => {
            const ingredient = ingredientMap.get(si.ingredientId);
            const isFlour = flourMap.get(si.ingredientId) ?? false;
            const pct = getDisplayPct(si.ingredientId, si.weight);
            return (
              <tr key={si.ingredientId} className="border-b border-wheat/50">
                <td className="px-4 py-2 text-brown-dark">
                  {ingredient?.name ?? "Unknown"}
                  {isFlour && (
                    <span className="ml-2 text-xs text-crust">(flour)</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
                  {si.weight}
                </td>
                <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
                  {pct != null ? `${pct.toFixed(1)}%` : "—"}
                </td>
              </tr>
            );
          })}

          <tr className="bg-cream-dark font-semibold">
            <td className="px-4 py-2 text-brown-dark">Total dough weight</td>
            <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
              {totalDoughWeight}
            </td>
            <td className="px-4 py-2" />
          </tr>
        </tbody>
      </table>

      {finalMixFlourTotal > 0 && (
        <p className="px-4 py-2 text-xs text-brown-light border-t border-wheat/50">
          Flour %: of total formula flour · Others %: of final mix flour
        </p>
      )}
    </div>
  );
}
