import { useState } from "react";
import { Pencil, Trash2, Wheat } from "lucide-react";
import { Button } from "@/components/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { Ingredient, Recipe } from "@/types";
import { IngredientForm } from "./IngredientForm";

interface IngredientListProps {
  ingredients: Ingredient[];
  recipes: Recipe[];
  onUpdate: (id: string, name: string, isFlour: boolean) => void;
  onDelete: (id: string) => void;
}

export function IngredientList({
  ingredients,
  recipes,
  onUpdate,
  onDelete,
}: IngredientListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Ingredient | null>(null);

  function isUsedInRecipe(id: string) {
    return recipes.some((r) =>
      r.ingredients.some((ri) => ri.ingredientId === id)
    );
  }

  function recipesUsing(id: string) {
    return recipes.filter((r) =>
      r.ingredients.some((ri) => ri.ingredientId === id)
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-wheat bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-wheat bg-cream-dark">
              <th className="px-4 py-2 text-left font-medium text-brown">Name</th>
              <th className="px-4 py-2 text-left font-medium text-brown">Type</th>
              <th className="px-4 py-2 text-right font-medium text-brown">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr key={ingredient.id} className="border-b border-wheat/50 last:border-0">
                {editingId === ingredient.id ? (
                  <td colSpan={3} className="px-4 py-3">
                    <IngredientForm
                      initialName={ingredient.name}
                      initialIsFlour={ingredient.isFlour}
                      submitLabel="Save"
                      onSubmit={(name, isFlour) => {
                        onUpdate(ingredient.id, name, isFlour);
                        setEditingId(null);
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium text-brown-dark">
                      {ingredient.name}
                    </td>
                    <td className="px-4 py-3">
                      {ingredient.isFlour ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold-light/30 px-2 py-0.5 text-xs font-medium text-crust-dark">
                          <Wheat size={12} />
                          Flour
                        </span>
                      ) : (
                        <span className="text-brown-light">Other</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(ingredient.id)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(ingredient)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Ingredient"
        message={
          deleteTarget && isUsedInRecipe(deleteTarget.id)
            ? `"${deleteTarget.name}" is used in ${recipesUsing(deleteTarget.id).length} recipe(s): ${recipesUsing(deleteTarget.id).map((r) => r.name).join(", ")}. Deleting it will remove it from those recipes.`
            : `Are you sure you want to delete "${deleteTarget?.name}"?`
        }
        onConfirm={() => {
          if (deleteTarget) onDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
