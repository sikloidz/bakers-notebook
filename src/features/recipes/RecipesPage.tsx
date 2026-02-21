import { Link } from "react-router";
import { Plus, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { useRecipes } from "./useRecipes";
import { useIngredients } from "@/features/ingredients/useIngredients";
import { totalWeight, calculatePercentages, totalPercentage } from "@/lib/baker-math";

export function RecipesPage() {
  const { recipes } = useRecipes();
  const { ingredients } = useIngredients();

  return (
    <div>
      <PageHeader title="Recipes">
        <Link to="/recipes/new">
          <Button size="sm">
            <Plus size={14} />
            New Recipe
          </Button>
        </Link>
      </PageHeader>

      {recipes.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={40} />}
          title="No recipes yet"
          description="Create your first recipe to start baking."
          action={
            <Link to="/recipes/new">
              <Button>Create Recipe</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3">
          {recipes.map((recipe) => {
            const withPct = calculatePercentages(recipe.ingredients, ingredients);
            const weight = totalWeight(recipe.ingredients);
            const pct = totalPercentage(withPct);
            return (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                className="block rounded-lg border border-wheat bg-white p-4 transition-colors hover:border-crust hover:bg-cream-dark/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-brown-dark">
                      {recipe.name}
                    </h3>
                    {recipe.description && (
                      <p className="mt-1 text-sm text-brown-light line-clamp-1">
                        {recipe.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm text-brown-light">
                    <div>{recipe.ingredients.length} ingredients</div>
                    <div>{weight}g &middot; {pct.toFixed(0)}%</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
