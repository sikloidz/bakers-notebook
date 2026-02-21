import { useParams, Link } from "react-router";
import { ArrowLeft, History } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { useRecipes } from "@/features/recipes/useRecipes";
import { useScalings } from "./useScalings";
import { ScalingHistoryList } from "./ScalingHistoryList";

export function ScalingHistoryPage() {
  const { id } = useParams();
  const { getRecipe } = useRecipes();
  const { getScalingsForRecipe, deleteScaling } = useScalings();

  const recipe = id ? getRecipe(id) : undefined;
  const scalings = id ? getScalingsForRecipe(id) : [];

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
      <PageHeader title={`History: ${recipe.name}`}>
        <Link to={`/recipes/${recipe.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft size={14} />
            Back
          </Button>
        </Link>
      </PageHeader>

      {scalings.length === 0 ? (
        <EmptyState
          icon={<History size={40} />}
          title="No scaling history"
          description="Scale this recipe to start building a history."
          action={
            <Link to={`/recipes/${recipe.id}/scale`}>
              <Button>Scale Recipe</Button>
            </Link>
          }
        />
      ) : (
        <ScalingHistoryList scalings={scalings} onDelete={deleteScaling} />
      )}
    </div>
  );
}
