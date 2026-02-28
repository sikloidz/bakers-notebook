import type { Ingredient, RecipeIngredient, RecipeStage } from "@/types";

interface StageDetailCardProps {
  stage: RecipeStage;
  stageIndex: number;
  allIngredients: Ingredient[];
  formulaIngredients: RecipeIngredient[]; // for formula flour total and baker's %
  carryInWeight: number; // cumulative weight from all previous stages
}

export function StageDetailCard({
  stage,
  stageIndex,
  allIngredients,
  formulaIngredients,
  carryInWeight,
}: StageDetailCardProps) {
  const ingredientMap = new Map(allIngredients.map((i) => [i.id, i]));
  const flourMap = new Map(allIngredients.map((i) => [i.id, i.isFlour]));

  const formulaFlourTotal = formulaIngredients
    .filter((ri) => flourMap.get(ri.ingredientId))
    .reduce((sum, ri) => sum + ri.weight, 0);

  const stageFlourTotal = stage.ingredients
    .filter((si) => flourMap.get(si.ingredientId))
    .reduce((sum, si) => sum + si.weight, 0);

  const stageTotalWeight = stage.ingredients.reduce(
    (sum, si) => sum + si.weight,
    0
  );

  // For each ingredient, compute the display percentage:
  // - Flour rows: % of total formula flour (shows how big this pre-ferment is)
  // - Non-flour rows: % of stage flour (shows internal stage ratios)
  function getDisplayPct(ingredientId: string, weight: number): number | null {
    const isFlour = flourMap.get(ingredientId) ?? false;
    if (isFlour && formulaFlourTotal > 0) {
      return (weight / formulaFlourTotal) * 100;
    }
    if (!isFlour && stageFlourTotal > 0) {
      return (weight / stageFlourTotal) * 100;
    }
    return null;
  }

  const hasNonFormulaIngredients = stage.ingredients.some(
    (si) => !si.fromFormula
  );

  return (
    <div className="overflow-hidden rounded-lg border border-wheat bg-white">
      {/* Header */}
      <div className="bg-cream-dark px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-brown-light">
          Stage {stageIndex + 1}
        </p>
        <h3 className="font-serif text-base font-semibold text-brown">
          {stage.name || `Stage ${stageIndex + 1}`}
        </h3>
        {stage.notes && (
          <p className="mt-1 text-sm italic text-brown-light">{stage.notes}</p>
        )}
      </div>

      {stage.ingredients.length === 0 ? (
        <p className="px-4 py-3 text-sm italic text-brown-light">
          Process step — no new ingredients added at this stage.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-wheat">
              <th className="px-4 py-2 text-left font-medium text-brown">
                Ingredient
              </th>
              <th className="px-4 py-2 text-right font-medium text-brown">
                Weight (g)
              </th>
              <th className="px-4 py-2 text-right font-medium text-brown">
                %
              </th>
            </tr>
          </thead>
          <tbody>
            {stage.ingredients.map((si) => {
              const ingredient = ingredientMap.get(si.ingredientId);
              const isFlour = flourMap.get(si.ingredientId) ?? false;
              const pct = getDisplayPct(si.ingredientId, si.weight);
              return (
                <tr key={si.ingredientId} className="border-b border-wheat/50">
                  <td className="px-4 py-2 text-brown-dark">
                    <span>{ingredient?.name ?? "Unknown"}</span>
                    {isFlour && (
                      <span className="ml-2 text-xs text-crust">(flour)</span>
                    )}
                    {!si.fromFormula && (
                      <span className="ml-2 text-xs text-brown-light">
                        extra
                      </span>
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
            {carryInWeight > 0 ? (
              <>
                <tr className="border-b border-wheat/50">
                  <td className="px-4 py-2 text-brown-light">
                    New ingredients
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-brown-light">
                    {stageTotalWeight}
                  </td>
                  <td className="px-4 py-2" />
                </tr>
                <tr className="border-b border-wheat/50">
                  <td className="px-4 py-2 text-brown-light">
                    + Carry-in from previous stages
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-brown-light">
                    {carryInWeight}
                  </td>
                  <td className="px-4 py-2" />
                </tr>
                <tr className="bg-cream-dark font-semibold">
                  <td className="px-4 py-2 text-brown-dark">
                    Cumulative dough weight
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
                    {stageTotalWeight + carryInWeight}
                  </td>
                  <td className="px-4 py-2" />
                </tr>
              </>
            ) : (
              <tr className="bg-cream-dark font-semibold">
                <td className="px-4 py-2 text-brown-dark">Stage total</td>
                <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
                  {stageTotalWeight}
                </td>
                <td className="px-4 py-2" />
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* % legend */}
      {stage.ingredients.length > 0 && stageFlourTotal > 0 && (
        <p className="px-4 py-2 text-xs text-brown-light border-t border-wheat/50">
          Flour %: of total formula flour
          {hasNonFormulaIngredients ? " · " : " · "}
          Others %: of stage flour
          {hasNonFormulaIngredients && (
            <> · <span className="italic">extra</span> = not in overall formula</>
          )}
        </p>
      )}
    </div>
  );
}
