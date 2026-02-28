import { Plus } from "lucide-react";
import { Button } from "@/components/Button";
import { generateId } from "@/lib/id";
import type { Ingredient } from "@/types";
import type { FormStage } from "./stageFormTypes";
import { StageCard } from "./StageCard";

interface FormulaSummary {
  ingredientId: string;
  name: string;
  weight: number;
}

interface StageListProps {
  stages: FormStage[];
  allIngredients: Ingredient[];
  formulaIngredientIds: Set<string>;
  formulaWeights: Map<string, number>;
  formulaFlourTotal: number;
  formulaSummary: FormulaSummary[]; // for final mix preview
  onChange: (stages: FormStage[]) => void;
}

export function StageList({
  stages,
  allIngredients,
  formulaIngredientIds,
  formulaWeights,
  formulaFlourTotal,
  formulaSummary,
  onChange,
}: StageListProps) {
  function getOtherAllocations(excludeIndex: number): Map<string, number> {
    const map = new Map<string, number>();
    for (let i = 0; i < stages.length; i++) {
      if (i === excludeIndex) continue;
      for (const si of stages[i].ingredients) {
        if (si.fromFormula) {
          map.set(si.ingredientId, (map.get(si.ingredientId) ?? 0) + si.weight);
        }
      }
    }
    return map;
  }

  function addStage() {
    onChange([
      ...stages,
      {
        id: generateId(),
        name: "",
        notes: "",
        percentageMode: false,
        ingredients: [],
      },
    ]);
  }

  function updateStage(index: number, updated: FormStage) {
    onChange(stages.map((s, i) => (i === index ? updated : s)));
  }

  function removeStage(index: number) {
    onChange(stages.filter((_, i) => i !== index));
  }

  function moveStage(index: number, direction: "up" | "down") {
    const next = [...stages];
    const target = direction === "up" ? index - 1 : index + 1;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  // Compute cumulative weights for carry-in tracking.
  // cumulativeWeights[i] = total weight of all stages before stage i.
  const cumulativeWeights: number[] = [];
  let running = 0;
  for (const stage of stages) {
    cumulativeWeights.push(running);
    running += stage.ingredients
      .filter((si) => si.fromFormula)
      .reduce((sum, si) => sum + si.weight, 0);
  }
  const totalStagesWeight = running; // cumulative after all stages (formula ingredients only)

  // Compute final mix: formula ingredients minus all stage allocations
  const allAllocations = new Map<string, number>();
  for (const stage of stages) {
    for (const si of stage.ingredients) {
      if (si.fromFormula) {
        allAllocations.set(
          si.ingredientId,
          (allAllocations.get(si.ingredientId) ?? 0) + si.weight
        );
      }
    }
  }

  const finalMixRemaining = formulaSummary
    .map((item) => ({
      ...item,
      remaining: item.weight - (allAllocations.get(item.ingredientId) ?? 0),
    }))
    .filter((item) => item.remaining > 0);

  const hasAnyAllocation = stages.some((s) =>
    s.ingredients.some((si) => si.weight > 0)
  );

  const lastStageName =
    stages.length > 0 ? stages[stages.length - 1].name : "";
  const finalMixRemainingTotal = finalMixRemaining.reduce(
    (sum, r) => sum + r.remaining,
    0
  );

  return (
    <div className="space-y-4">
      {stages.map((stage, i) => (
        <StageCard
          key={stage.id}
          stage={stage}
          stageIndex={i}
          totalStages={stages.length}
          allIngredients={allIngredients}
          formulaIngredientIds={formulaIngredientIds}
          formulaWeights={formulaWeights}
          formulaFlourTotal={formulaFlourTotal}
          otherAllocations={getOtherAllocations(i)}
          carryInWeight={cumulativeWeights[i]}
          onChange={(updated) => updateStage(i, updated)}
          onMoveUp={() => moveStage(i, "up")}
          onMoveDown={() => moveStage(i, "down")}
          onRemove={() => removeStage(i)}
        />
      ))}

      <Button type="button" variant="secondary" onClick={addStage}>
        <Plus size={14} />
        Add Stage
      </Button>

      {/* Final Mix preview */}
      {stages.length > 0 && hasAnyAllocation && (
        <div className="rounded-lg border border-wheat bg-cream p-4">
          <h3 className="mb-3 font-serif text-base font-semibold text-brown">
            Final Mix
          </h3>
          <div className="space-y-1">
            {/* Carry-in from all stages */}
            {totalStagesWeight > 0 && (
              <div className="flex items-center justify-between text-sm font-medium text-brown-light">
                <span>
                  {lastStageName ? `${lastStageName} (carry-in)` : "Carry-in from stages"}
                </span>
                <span className="tabular-nums">{totalStagesWeight}g</span>
              </div>
            )}

            {/* Remaining formula ingredients */}
            {finalMixRemaining.length === 0 && totalStagesWeight === 0 ? (
              <p className="text-sm italic text-brown-light">
                Add stage ingredients to see the final mix preview.
              </p>
            ) : finalMixRemaining.length === 0 ? (
              <p className="text-sm italic text-brown-light">
                All formula ingredients are allocated across stages.
              </p>
            ) : (
              finalMixRemaining.map((item) => (
                <div
                  key={item.ingredientId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-brown-dark">{item.name}</span>
                  <span className="tabular-nums font-semibold text-brown-dark">
                    {item.remaining}g
                  </span>
                </div>
              ))
            )}

            {/* Total */}
            {(totalStagesWeight > 0 || finalMixRemainingTotal > 0) && (
              <div className="mt-2 border-t border-wheat pt-2 flex items-center justify-between text-sm font-semibold">
                <span className="text-brown-dark">Total dough weight</span>
                <span className="tabular-nums text-brown-dark">
                  {totalStagesWeight + finalMixRemainingTotal}g
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
