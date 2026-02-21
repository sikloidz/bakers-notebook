import { Wheat } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { useIngredients } from "./useIngredients";
import { useRecipes } from "@/features/recipes/useRecipes";
import { IngredientForm } from "./IngredientForm";
import { IngredientList } from "./IngredientList";

export function IngredientsPage() {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } =
    useIngredients();
  const { recipes } = useRecipes();

  return (
    <div>
      <PageHeader title="Ingredients" />

      <div className="mb-6 rounded-lg border border-wheat bg-white p-4">
        <h2 className="mb-3 font-serif text-lg font-semibold text-brown">
          Add Ingredient
        </h2>
        <IngredientForm onSubmit={addIngredient} />
      </div>

      {ingredients.length === 0 ? (
        <EmptyState
          icon={<Wheat size={40} />}
          title="No ingredients yet"
          description="Add your first ingredient above to get started."
        />
      ) : (
        <IngredientList
          ingredients={ingredients}
          recipes={recipes}
          onUpdate={updateIngredient}
          onDelete={deleteIngredient}
        />
      )}
    </div>
  );
}
