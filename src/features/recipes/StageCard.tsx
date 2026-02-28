import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Toggle } from "@/components/Toggle";
import type { Ingredient } from "@/types";
import type { FormStage, FormStageIngredient } from "./stageFormTypes";

interface StageCardProps {
  stage: FormStage;
  stageIndex: number;
  totalStages: number;
  allIngredients: Ingredient[];
  formulaIngredientIds: Set<string>;
  formulaWeights: Map<string, number>; // ingredientId -> formula total weight
  formulaFlourTotal: number;
  otherAllocations: Map<string, number>; // sum of fromFormula allocations in OTHER stages
  carryInWeight: number; // cumulative weight from all previous stages
  onChange: (updated: FormStage) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export function StageCard({
  stage,
  stageIndex,
  totalStages,
  allIngredients,
  formulaIngredientIds,
  formulaWeights,
  formulaFlourTotal,
  otherAllocations,
  carryInWeight,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: StageCardProps) {
  const flourMap = new Map(allIngredients.map((i) => [i.id, i.isFlour]));

  const stageFlourTotal = stage.ingredients
    .filter((si) => flourMap.get(si.ingredientId))
    .reduce((sum, si) => sum + si.weight, 0);

  const totalStageWeight = stage.ingredients.reduce(
    (sum, si) => sum + si.weight,
    0
  );

  // Available = formula weight - other stages allocation - this stage weight
  function getAvailable(si: FormStageIngredient): number | null {
    if (!si.ingredientId || !si.fromFormula) return null;
    const formulaW = formulaWeights.get(si.ingredientId) ?? 0;
    const otherAlloc = otherAllocations.get(si.ingredientId) ?? 0;
    return formulaW - otherAlloc - si.weight;
  }

  // When flour weight changes in percentageMode, cascade to non-flour rows with inputMode="percentage"
  function cascadeFlourChange(
    ings: FormStageIngredient[],
    newFlour: number,
    skipIndex: number
  ): FormStageIngredient[] {
    if (!stage.percentageMode || newFlour <= 0) return ings;
    return ings.map((si, i) => {
      if (i === skipIndex) return si;
      if (flourMap.get(si.ingredientId)) return si; // other flour rows: no cascade
      if (si.inputMode === "percentage" && si.percentage > 0) {
        return { ...si, weight: Math.round((si.percentage / 100) * newFlour) };
      }
      // weight mode: keep grams, just update display percentage
      return {
        ...si,
        percentage: newFlour > 0 ? (si.weight / newFlour) * 100 : 0,
      };
    });
  }

  function handleWeightChange(index: number, weight: number) {
    const isFlour = flourMap.get(stage.ingredients[index]?.ingredientId) ?? false;

    let updated = stage.ingredients.map((si, i) => {
      if (i !== index) return si;
      const base = isFlour ? formulaFlourTotal : stageFlourTotal;
      const percentage = base > 0 ? (weight / base) * 100 : si.percentage;
      return { ...si, weight, percentage, inputMode: "weight" as const };
    });

    if (isFlour) {
      const newFlour = updated
        .filter((si) => flourMap.get(si.ingredientId))
        .reduce((sum, si) => sum + si.weight, 0);
      updated = cascadeFlourChange(updated, newFlour, index);
    }

    onChange({ ...stage, ingredients: updated });
  }

  function handlePercentageChange(index: number, percentage: number) {
    const si = stage.ingredients[index];
    if (!si) return;
    const isFlour = flourMap.get(si.ingredientId) ?? false;
    // Flour % is relative to formula flour; all others relative to stage flour
    const base = isFlour ? formulaFlourTotal : stageFlourTotal;
    const weight = base > 0 ? Math.round((percentage / 100) * base) : 0;

    let updated = stage.ingredients.map((s, i) =>
      i === index
        ? { ...s, weight, percentage, inputMode: "percentage" as const }
        : s
    );

    if (isFlour) {
      const newFlour = updated
        .filter((s) => flourMap.get(s.ingredientId))
        .reduce((sum, s) => sum + s.weight, 0);
      updated = cascadeFlourChange(updated, newFlour, index);
    }

    onChange({ ...stage, ingredients: updated });
  }

  function handleIngredientChange(index: number, ingredientId: string) {
    const fromFormula = formulaIngredientIds.has(ingredientId);
    onChange({
      ...stage,
      ingredients: stage.ingredients.map((si, i) =>
        i === index
          ? {
              ingredientId,
              weight: 0,
              percentage: 0,
              fromFormula,
              inputMode: "weight" as const,
            }
          : si
      ),
    });
  }

  function addRow() {
    onChange({
      ...stage,
      ingredients: [
        ...stage.ingredients,
        {
          ingredientId: "",
          weight: 0,
          percentage: 0,
          fromFormula: true,
          inputMode: "weight" as const,
        },
      ],
    });
  }

  function removeRow(index: number) {
    onChange({
      ...stage,
      ingredients: stage.ingredients.filter((_, i) => i !== index),
    });
  }

  const usedIds = new Set(
    stage.ingredients.map((si) => si.ingredientId).filter(Boolean)
  );
  const formulaIngredients = allIngredients.filter((i) =>
    formulaIngredientIds.has(i.id)
  );
  const extraIngredients = allIngredients.filter(
    (i) => !formulaIngredientIds.has(i.id)
  );

  return (
    <div className="rounded-lg border border-wheat bg-white overflow-hidden">
      {/* Card header */}
      <div className="bg-cream-dark px-4 py-3 flex items-center justify-between gap-2">
        <span className="font-serif font-semibold text-brown">
          Stage {stageIndex + 1}
        </span>
        <div className="flex items-center gap-1 ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={stageIndex === 0}
          >
            <ChevronUp size={14} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={stageIndex === totalStages - 1}
          >
            <ChevronDown size={14} />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-brown">
            Stage Name
          </label>
          <input
            type="text"
            value={stage.name}
            onChange={(e) => onChange({ ...stage, name: e.target.value })}
            placeholder="e.g. Levain, Poolish, First Dough, Autolyse"
            className="w-full rounded-md border border-wheat bg-white px-3 py-2 text-sm text-brown-dark placeholder:text-brown-light/50 focus:border-crust focus:ring-1 focus:ring-crust focus:outline-none"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1 block text-sm font-medium text-brown">
            Notes
          </label>
          <textarea
            value={stage.notes}
            onChange={(e) => onChange({ ...stage, notes: e.target.value })}
            placeholder="Fermentation time, temperature, techniques (stretch and fold, shaping)..."
            rows={2}
            className="w-full rounded-md border border-wheat bg-white px-3 py-2 text-sm text-brown-dark placeholder:text-brown-light/50 focus:border-crust focus:ring-1 focus:ring-crust focus:outline-none resize-none"
          />
        </div>

        {/* Percentage mode toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          <Toggle
            id={`stage-${stageIndex}-pct-mode`}
            label="Enter by percentage"
            checked={stage.percentageMode}
            onChange={(v) => onChange({ ...stage, percentageMode: v })}
          />
          {stage.percentageMode && stageFlourTotal === 0 && (
            <span className="text-xs text-red">
              Add a flour ingredient to enable % entry
            </span>
          )}
          {stage.percentageMode && stageFlourTotal > 0 && (
            <span className="text-xs text-brown-light">
              Flour: % of formula flour · Others: % of stage flour
            </span>
          )}
        </div>

        {/* Ingredient rows */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-brown">Ingredients</span>
            <Button type="button" variant="secondary" size="sm" onClick={addRow}>
              <Plus size={14} />
              Add
            </Button>
          </div>

          {stage.ingredients.length === 0 ? (
            <p className="text-xs italic text-brown-light">
              No ingredients yet — add some, or leave empty to describe a
              process-only step (folding, shaping, etc).
            </p>
          ) : (
            <div className="space-y-2">
              {/* Column headers */}
              <div className="flex items-center gap-2 text-xs font-medium text-brown-light">
                <span className="flex-1">Ingredient</span>
                {stage.percentageMode && (
                  <span className="w-16 text-right">%</span>
                )}
                <span className="w-20 text-right">Weight (g)</span>
                <span className="w-20 text-right">Available</span>
                <span className="w-7 shrink-0" />
              </div>

              {stage.ingredients.map((si, i) => {
                const isFlour = flourMap.get(si.ingredientId) ?? false;
                const available = getAvailable(si);
                const isOverAllocated = available !== null && available < 0;
                const pctTitle = isFlour
                  ? "% of total formula flour"
                  : "% of stage flour";
                const pctDisabled =
                  !si.ingredientId || (!isFlour && stageFlourTotal === 0);

                return (
                  <div key={i} className="flex items-center gap-2">
                    {/* Ingredient select */}
                    <select
                      value={si.ingredientId}
                      onChange={(e) => handleIngredientChange(i, e.target.value)}
                      className="flex-1 rounded-md border border-wheat bg-white px-2 py-1.5 text-sm text-brown-dark focus:border-crust focus:ring-1 focus:ring-crust focus:outline-none min-w-0"
                    >
                      <option value="">Select ingredient...</option>
                      {formulaIngredients.length > 0 && (
                        <optgroup label="Formula Ingredients">
                          {formulaIngredients.map((ing) => (
                            <option
                              key={ing.id}
                              value={ing.id}
                              disabled={
                                usedIds.has(ing.id) && ing.id !== si.ingredientId
                              }
                            >
                              {ing.name}
                              {ing.isFlour ? " (flour)" : ""}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {extraIngredients.length > 0 && (
                        <optgroup label="Extra (not in formula)">
                          {extraIngredients.map((ing) => (
                            <option
                              key={ing.id}
                              value={ing.id}
                              disabled={
                                usedIds.has(ing.id) && ing.id !== si.ingredientId
                              }
                            >
                              {ing.name}
                              {ing.isFlour ? " (flour)" : ""}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>

                    {/* Percentage input (only in percentageMode) */}
                    {stage.percentageMode && (
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={
                          si.percentage > 0
                            ? Math.round(si.percentage * 10) / 10
                            : ""
                        }
                        onChange={(e) =>
                          handlePercentageChange(i, Number(e.target.value))
                        }
                        disabled={pctDisabled}
                        placeholder="%"
                        title={pctTitle}
                        className="w-16 rounded-md border border-wheat bg-white px-2 py-1.5 text-sm text-right tabular-nums text-brown-dark focus:border-crust focus:ring-1 focus:ring-crust focus:outline-none disabled:bg-parchment disabled:text-brown-light"
                      />
                    )}

                    {/* Weight input */}
                    <input
                      type="number"
                      min={0}
                      value={si.weight || ""}
                      onChange={(e) =>
                        handleWeightChange(i, Number(e.target.value))
                      }
                      placeholder="g"
                      className={`w-20 rounded-md border px-2 py-1.5 text-sm text-right tabular-nums text-brown-dark focus:border-crust focus:ring-1 focus:ring-crust focus:outline-none ${
                        isOverAllocated
                          ? "border-red text-red"
                          : "border-wheat bg-white"
                      }`}
                    />

                    {/* Available column */}
                    <span
                      className={`w-20 shrink-0 text-right text-xs tabular-nums ${
                        isOverAllocated
                          ? "font-semibold text-red"
                          : "text-brown-light"
                      }`}
                    >
                      {available !== null
                        ? isOverAllocated
                          ? `−${Math.abs(available)}g!`
                          : `${available}g`
                        : "—"}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(i)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Stage total / cumulative */}
          {totalStageWeight > 0 && (
            <div className="mt-3 border-t border-wheat/50 pt-2 space-y-0.5 text-right text-sm">
              {carryInWeight > 0 ? (
                <>
                  <div className="text-brown-light">
                    New ingredients: {totalStageWeight}g
                  </div>
                  <div className="text-brown-light">
                    + Carry-in from previous: {carryInWeight}g
                  </div>
                  <div className="font-semibold text-brown-dark">
                    Cumulative: {totalStageWeight + carryInWeight}g
                  </div>
                </>
              ) : (
                <span className="font-semibold text-brown-dark">
                  Stage total: {totalStageWeight}g
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
