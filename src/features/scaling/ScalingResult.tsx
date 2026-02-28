import type { ScaledIngredient, ScaledStage } from "@/types";
import { Button } from "@/components/Button";
import { Save } from "lucide-react";
import { ScaledStageCard } from "./ScaledStageCard";

interface ScalingResultProps {
  scaledIngredients: ScaledIngredient[];
  scaledStages?: ScaledStage[];
  desiredWeight: number;
  onSave: () => void;
  saved: boolean;
}

export function ScalingResult({
  scaledIngredients,
  scaledStages,
  desiredWeight,
  onSave,
  saved,
}: ScalingResultProps) {
  const actualTotal = scaledIngredients.reduce(
    (sum, si) => sum + si.scaledWeight,
    0
  );

  const hasStages = scaledStages && scaledStages.length > 0;

  // Compute cumulative carry-in weights for each stage
  const scaledCarryIns: number[] = [];
  let scaledCumulative = 0;
  if (hasStages) {
    for (const stage of scaledStages!) {
      scaledCarryIns.push(scaledCumulative);
      scaledCumulative += stage.ingredients
        .filter((si) => si.fromFormula)
        .reduce((sum, si) => sum + si.scaledWeight, 0);
    }
  }
  // scaledCumulative now = total weight of all stages → carry-in for Final Mix

  // Compute scaled final mix: formula ingredients minus stage allocations
  const stageAllocations = new Map<string, number>();
  if (hasStages) {
    for (const stage of scaledStages!) {
      for (const si of stage.ingredients) {
        if (si.fromFormula) {
          stageAllocations.set(
            si.ingredientId,
            (stageAllocations.get(si.ingredientId) ?? 0) + si.scaledWeight
          );
        }
      }
    }
  }

  const scaledFinalMix = hasStages
    ? scaledIngredients
        .map((si) => ({
          ...si,
          remaining: si.scaledWeight - (stageAllocations.get(si.ingredientId) ?? 0),
        }))
        .filter((si) => si.remaining > 0)
    : [];

  const finalMixRemainingTotal = scaledFinalMix.reduce(
    (sum, si) => sum + si.remaining,
    0
  );
  const finalMixTotal = scaledCumulative + finalMixRemainingTotal;

  const lastStageName =
    hasStages ? scaledStages![scaledStages!.length - 1].stageName : "";
  const carryInLabel = lastStageName
    ? `${lastStageName} (carry-in)`
    : "Carry-in from previous stages";

  return (
    <div className="space-y-4">
      {/* Overall Formula */}
      <div className="rounded-lg border border-wheat bg-white overflow-hidden">
        <div className="bg-cream-dark px-4 py-3 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-brown">
            {hasStages ? "Overall Formula" : `Scaled to ${desiredWeight}g`}
          </h2>
          <Button variant="secondary" size="sm" onClick={onSave} disabled={saved}>
            <Save size={14} />
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-wheat">
              <th className="px-4 py-2 text-left font-medium text-brown">
                Ingredient
              </th>
              <th className="px-4 py-2 text-right font-medium text-brown">
                Baker's %
              </th>
              <th className="px-4 py-2 text-right font-medium text-brown">
                Weight (g)
              </th>
            </tr>
          </thead>
          <tbody>
            {scaledIngredients.map((si) => (
              <tr key={si.ingredientId} className="border-b border-wheat/50">
                <td className="px-4 py-2 text-brown-dark">
                  {si.ingredientName}
                  {si.isFlour && (
                    <span className="ml-2 text-xs text-crust">(flour)</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
                  {si.percentage.toFixed(1)}%
                </td>
                <td className="px-4 py-2 text-right tabular-nums font-semibold text-brown-dark">
                  {si.scaledWeight}
                </td>
              </tr>
            ))}
            <tr className="bg-cream-dark font-semibold">
              <td className="px-4 py-2 text-brown-dark">Total</td>
              <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
                {scaledIngredients
                  .reduce((sum, si) => sum + si.percentage, 0)
                  .toFixed(1)}
                %
              </td>
              <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
                {actualTotal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Stage breakdown */}
      {hasStages && (
        <div>
          <h3 className="mb-3 font-serif text-base font-semibold text-brown">
            Stage Breakdown
          </h3>
          <div className="space-y-3">
            {scaledStages!.map((stage, i) => (
              <ScaledStageCard
                key={stage.stageId}
                scaledStage={stage}
                stageIndex={i}
                carryInWeight={scaledCarryIns[i]}
              />
            ))}

            {/* Scaled Final Mix */}
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
                  </tr>
                </thead>
                <tbody>
                  {scaledCumulative > 0 && (
                    <tr className="border-b border-wheat/50 bg-parchment">
                      <td className="px-4 py-2 font-medium text-brown">
                        {carryInLabel}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums font-semibold text-brown-dark">
                        {scaledCumulative}
                      </td>
                    </tr>
                  )}
                  {scaledFinalMix.length === 0 ? (
                    <tr className="border-b border-wheat/50">
                      <td
                        colSpan={2}
                        className="px-4 py-2 text-sm italic text-brown-light"
                      >
                        All formula ingredients are allocated across stages.
                      </td>
                    </tr>
                  ) : (
                    scaledFinalMix.map((si) => (
                      <tr
                        key={si.ingredientId}
                        className="border-b border-wheat/50"
                      >
                        <td className="px-4 py-2 text-brown-dark">
                          {si.ingredientName}
                          {si.isFlour && (
                            <span className="ml-2 text-xs text-crust">
                              (flour)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
                          {si.remaining}
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-cream-dark font-semibold">
                    <td className="px-4 py-2 text-brown-dark">
                      Total dough weight
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
                      {finalMixTotal}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
