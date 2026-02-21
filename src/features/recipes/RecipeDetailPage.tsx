import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Pencil, Trash2, Scale, History } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useRecipes } from "./useRecipes";
import { useIngredients } from "@/features/ingredients/useIngredients";
import { RecipeTable } from "./RecipeTable";

export function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecipe, deleteRecipe } = useRecipes();
  const { ingredients } = useIngredients();
  const [showDelete, setShowDelete] = useState(false);

  const recipe = id ? getRecipe(id) : undefined;

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <p className="text-brown-light">Recipe not found.</p>
        <Link to="/recipes" className="text-crust underline text-sm mt-2 inline-block">
          Back to recipes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={recipe.name}>
        <Link to={`/recipes/${recipe.id}/scale`}>
          <Button variant="secondary" size="sm">
            <Scale size={14} />
            Scale
          </Button>
        </Link>
        <Link to={`/recipes/${recipe.id}/history`}>
          <Button variant="ghost" size="sm">
            <History size={14} />
            History
          </Button>
        </Link>
        <Link to={`/recipes/${recipe.id}/edit`}>
          <Button variant="ghost" size="sm">
            <Pencil size={14} />
            Edit
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => setShowDelete(true)}>
          <Trash2 size={14} />
        </Button>
      </PageHeader>

      {recipe.description && (
        <p className="mb-4 text-sm text-brown-light">{recipe.description}</p>
      )}

      <RecipeTable
        recipeIngredients={recipe.ingredients}
        allIngredients={ingredients}
      />

      <ConfirmDialog
        open={showDelete}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipe.name}"? This cannot be undone.`}
        onConfirm={() => {
          deleteRecipe(recipe.id);
          navigate("/recipes");
        }}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
