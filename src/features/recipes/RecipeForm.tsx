import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useIngredients } from "@/features/ingredients/useIngredients";
import { useRecipes } from "./useRecipes";
import { RecipeIngredientRow } from "./RecipeIngredientRow";
import type { RecipeIngredient } from "@/types";

interface FormRow {
  ingredientId: string;
  weight: number;
  percentage: number;
  inputMode: "weight" | "percentage";
}

export function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ingredients: allIngredients } = useIngredients();
  const { getRecipe, addRecipe, updateRecipe } = useRecipes();

  const existing = id ? getRecipe(id) : undefined;
  const isEditing = Boolean(existing);

  const flourMap = new Map(allIngredients.map((i) => [i.id, i.isFlour]));

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [rows, setRows] = useState<FormRow[]>(() => {
    if (existing) {
      const totalFlour = existing.ingredients
        .filter((ri) => flourMap.get(ri.ingredientId))
        .reduce((sum, ri) => sum + ri.weight, 0);

      return existing.ingredients.map((ri) => ({
        ingredientId: ri.ingredientId,
        weight: ri.weight,
        percentage:
          totalFlour > 0
            ? Math.round((ri.weight / totalFlour) * 100 * 10) / 10
            : 0,
        inputMode: "weight" as const,
      }));
    }
    return [
      { ingredientId: "", weight: 0, percentage: 0, inputMode: "weight" as const },
    ];
  });

  const totalFlour = rows
    .filter((r) => r.ingredientId && flourMap.get(r.ingredientId))
    .reduce((sum, r) => sum + r.weight, 0);
  const hasFlour = totalFlour > 0;

  function recalculate(updatedRows: FormRow[]): FormRow[] {
    const tf = updatedRows
      .filter((r) => r.ingredientId && flourMap.get(r.ingredientId))
      .reduce((sum, r) => sum + r.weight, 0);

    if (tf <= 0) return updatedRows;

    return updatedRows.map((r) => {
      if (!r.ingredientId) return r;

      const isFlour = flourMap.get(r.ingredientId) ?? false;

      if (isFlour || r.inputMode === "weight") {
        return {
          ...r,
          percentage: Math.round((r.weight / tf) * 100 * 10) / 10,
        };
      } else {
        return {
          ...r,
          weight: Math.round((r.percentage / 100) * tf),
        };
      }
    });
  }

  function handleIngredientChange(index: number, ingredientId: string) {
    setRows((prev) =>
      recalculate(
        prev.map((r, i) => (i === index ? { ...r, ingredientId } : r))
      )
    );
  }

  function handleWeightChange(index: number, weight: number) {
    setRows((prev) =>
      recalculate(
        prev.map((r, i) =>
          i === index ? { ...r, weight, inputMode: "weight" as const } : r
        )
      )
    );
  }

  function handlePercentageChange(index: number, percentage: number) {
    setRows((prev) =>
      recalculate(
        prev.map((r, i) =>
          i === index
            ? { ...r, percentage, inputMode: "percentage" as const }
            : r
        )
      )
    );
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { ingredientId: "", weight: 0, percentage: 0, inputMode: "weight" as const },
    ]);
  }

  function removeRow(index: number) {
    setRows((prev) => recalculate(prev.filter((_, i) => i !== index)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const validRows: RecipeIngredient[] = rows
      .filter((r) => r.ingredientId && r.weight > 0)
      .map((r) => ({
        ingredientId: r.ingredientId,
        weight: r.weight,
        percentage: r.percentage,
      }));

    if (validRows.length === 0) return;

    if (isEditing && id) {
      updateRecipe(id, trimmedName, description.trim(), validRows);
      navigate(`/recipes/${id}`);
    } else {
      const recipe = addRecipe(trimmedName, description.trim(), validRows);
      navigate(`/recipes/${recipe.id}`);
    }
  }

  return (
    <div>
      <PageHeader title={isEditing ? "Edit Recipe" : "New Recipe"} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-wheat bg-white p-4 space-y-4">
          <Input
            id="recipe-name"
            label="Recipe Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Classic Sourdough"
          />
          <div>
            <label
              htmlFor="recipe-desc"
              className="mb-1 block text-sm font-medium text-brown"
            >
              Description
            </label>
            <textarea
              id="recipe-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes about this recipe..."
              rows={2}
              className="w-full rounded-md border border-wheat bg-white px-3 py-2 text-sm text-brown-dark placeholder:text-brown-light/50 focus:border-crust focus:ring-1 focus:ring-crust focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="rounded-lg border border-wheat bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-brown">
              Ingredients
            </h2>
            <Button type="button" variant="secondary" size="sm" onClick={addRow}>
              <Plus size={14} />
              Add Row
            </Button>
          </div>

          {allIngredients.length === 0 ? (
            <p className="text-sm text-brown-light">
              No ingredients defined yet.{" "}
              <a href="/ingredients" className="text-crust underline">
                Add some ingredients
              </a>{" "}
              first.
            </p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs font-medium text-brown-light">
                <span className="flex-1">Ingredient</span>
                <span className="w-24 text-right">Weight (g)</span>
                <span className="w-24 text-right">Baker's %</span>
                <span className="w-9 shrink-0" />
              </div>
              {rows.map((row, index) => {
                const isFlour = flourMap.get(row.ingredientId) ?? false;
                return (
                  <RecipeIngredientRow
                    key={index}
                    ingredientId={row.ingredientId}
                    weight={row.weight}
                    percentage={row.percentage}
                    allIngredients={allIngredients}
                    percentageDisabled={isFlour || !hasFlour}
                    onChangeIngredient={(id) =>
                      handleIngredientChange(index, id)
                    }
                    onChangeWeight={(weight) =>
                      handleWeightChange(index, weight)
                    }
                    onChangePercentage={(percentage) =>
                      handlePercentageChange(index, percentage)
                    }
                    onRemove={() => removeRow(index)}
                  />
                );
              })}
              {!hasFlour && rows.length > 0 && (
                <p className="text-xs text-brown-light/70 italic mt-1">
                  Add a flour ingredient to enable baker's percentage
                  calculations.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit">
            {isEditing ? "Save Changes" : "Create Recipe"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
