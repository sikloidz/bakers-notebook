import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Pencil, Trash2, Scale, History } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useRecipes } from "./useRecipes";
import { useIngredients } from "@/features/ingredients/useIngredients";
import { RecipeTable } from "./RecipeTable";
import { StageDetailCard } from "./StageDetailCard";
import { FinalMixCard } from "./FinalMixCard";

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

  const hasStages = recipe.stages && recipe.stages.length > 0;

  // Compute cumulative carry-in weights for each stage.
  // carryIn[i] = total weight of all stage outputs before stage i.
  const stageCarryIns: number[] = [];
  if (hasStages) {
    let cumulative = 0;
    for (const stage of recipe.stages!) {
      stageCarryIns.push(cumulative);
      cumulative += stage.ingredients
        .filter((si) => si.fromFormula)
        .reduce((sum, si) => sum + si.weight, 0);
    }
    // cumulative now = total weight of all named stages → carry-in for Final Mix
    stageCarryIns.push(cumulative);
  }

  const lastStageName =
    hasStages ? recipe.stages![recipe.stages!.length - 1].name : "";

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

      <div className="space-y-6">
        {/* Overall Formula */}
        <div>
          {hasStages && (
            <h2 className="mb-2 font-serif text-base font-semibold text-brown">
              Overall Formula
            </h2>
          )}
          <RecipeTable
            recipeIngredients={recipe.ingredients}
            allIngredients={ingredients}
          />
        </div>

        {/* Stage Breakdown */}
        {hasStages && (
          <div>
            <h2 className="mb-3 font-serif text-base font-semibold text-brown">
              Stage Breakdown
            </h2>
            <div className="space-y-4">
              {recipe.stages!.map((stage, i) => (
                <StageDetailCard
                  key={stage.id}
                  stage={stage}
                  stageIndex={i}
                  allIngredients={ingredients}
                  formulaIngredients={recipe.ingredients}
                  carryInWeight={stageCarryIns[i]}
                />
              ))}
              <FinalMixCard
                stages={recipe.stages!}
                formulaIngredients={recipe.ingredients}
                allIngredients={ingredients}
                carryInWeight={stageCarryIns[recipe.stages!.length]}
                lastStageName={lastStageName}
              />
            </div>
          </div>
        )}
      </div>

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
