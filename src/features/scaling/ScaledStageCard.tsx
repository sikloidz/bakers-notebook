import type { ScaledStage } from "@/types";

interface ScaledStageCardProps {
  scaledStage: ScaledStage;
  stageIndex: number;
  carryInWeight: number; // cumulative scaled weight from all previous stages
}

export function ScaledStageCard({
  scaledStage,
  stageIndex,
  carryInWeight,
}: ScaledStageCardProps) {
  const newWeight = scaledStage.ingredients.reduce(
    (sum, si) => sum + si.scaledWeight,
    0
  );

  return (
    <div className="overflow-hidden rounded-lg border border-wheat bg-white">
      <div className="bg-cream-dark px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-brown-light">
          Stage {stageIndex + 1}
        </p>
        <h3 className="font-serif text-base font-semibold text-brown">
          {scaledStage.stageName || `Stage ${stageIndex + 1}`}
        </h3>
      </div>

      {scaledStage.ingredients.length === 0 ? (
        <p className="px-4 py-3 text-sm italic text-brown-light">
          Process step — no ingredients at this stage.
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
            </tr>
          </thead>
          <tbody>
            {scaledStage.ingredients.map((si) => (
              <tr key={si.ingredientId} className="border-b border-wheat/50">
                <td className="px-4 py-2 text-brown-dark">
                  {si.ingredientName}
                  {!si.fromFormula && (
                    <span className="ml-2 text-xs text-brown-light">extra</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right tabular-nums font-semibold text-brown-dark">
                  {si.scaledWeight}
                </td>
              </tr>
            ))}
            {carryInWeight > 0 ? (
              <>
                <tr className="border-b border-wheat/50">
                  <td className="px-4 py-2 text-brown-light">New ingredients</td>
                  <td className="px-4 py-2 text-right tabular-nums text-brown-light">
                    {newWeight}
                  </td>
                </tr>
                <tr className="border-b border-wheat/50">
                  <td className="px-4 py-2 text-brown-light">
                    + Carry-in from previous stages
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-brown-light">
                    {carryInWeight}
                  </td>
                </tr>
                <tr className="bg-cream-dark font-semibold">
                  <td className="px-4 py-2 text-brown-dark">
                    Cumulative dough weight
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
                    {newWeight + carryInWeight}
                  </td>
                </tr>
              </>
            ) : (
              <tr className="bg-cream-dark font-semibold">
                <td className="px-4 py-2 text-brown-dark">Stage total</td>
                <td className="px-4 py-2 text-right tabular-nums text-brown-dark">
                  {newWeight}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
