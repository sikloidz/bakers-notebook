import type { ScaledIngredient } from "@/types";
import { Button } from "@/components/Button";
import { Save } from "lucide-react";

interface ScalingResultProps {
  scaledIngredients: ScaledIngredient[];
  desiredWeight: number;
  onSave: () => void;
  saved: boolean;
}

export function ScalingResult({
  scaledIngredients,
  desiredWeight,
  onSave,
  saved,
}: ScalingResultProps) {
  const actualTotal = scaledIngredients.reduce(
    (sum, si) => sum + si.scaledWeight,
    0
  );

  return (
    <div className="rounded-lg border border-wheat bg-white overflow-hidden">
      <div className="bg-cream-dark px-4 py-3 flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-brown">
          Scaled to {desiredWeight}g
        </h2>
        <Button variant="secondary" size="sm" onClick={onSave} disabled={saved}>
          <Save size={14} />
          {saved ? "Saved" : "Save"}
        </Button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-wheat">
            <th className="px-4 py-2 text-left font-medium text-brown">Ingredient</th>
            <th className="px-4 py-2 text-right font-medium text-brown">Baker's %</th>
            <th className="px-4 py-2 text-right font-medium text-brown">Weight (g)</th>
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
  );
}
