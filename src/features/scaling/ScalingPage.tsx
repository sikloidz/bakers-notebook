import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { useRecipes } from "@/features/recipes/useRecipes";
import { useIngredients } from "@/features/ingredients/useIngredients";
import { useScalings } from "./useScalings";
import { ScalingForm } from "./ScalingForm";
import { ScalingResult } from "./ScalingResult";
import { scaleRecipe, totalWeight } from "@/lib/baker-math";
import type { ScaledIngredient } from "@/types";

export function ScalingPage() {
  const { id } = useParams();
  const { getRecipe } = useRecipes();
  const { ingredients } = useIngredients();
  const { addScaling } = useScalings();

  const recipe = id ? getRecipe(id) : undefined;

  const [desiredWeight, setDesiredWeight] = useState(0);
  const [result, setResult] = useState<ScaledIngredient[] | null>(null);
  const [saved, setSaved] = useState(false);

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

  const originalWeight = totalWeight(recipe.ingredients);

  function handleScale() {
    if (!recipe || desiredWeight <= 0) return;
    const scaled = scaleRecipe(recipe.ingredients, desiredWeight, ingredients);
    setResult(scaled);
    setSaved(false);
  }

  function handleSave() {
    if (!recipe || !result) return;
    addScaling(recipe.id, recipe.name, desiredWeight, result);
    setSaved(true);
  }

  return (
    <div>
      <PageHeader title={`Scale: ${recipe.name}`}>
        <Link to={`/recipes/${recipe.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft size={14} />
            Back
          </Button>
        </Link>
      </PageHeader>

      <div className="space-y-6">
        <ScalingForm
          desiredWeight={desiredWeight}
          onChangeWeight={setDesiredWeight}
          onScale={handleScale}
          originalWeight={originalWeight}
        />

        {result && (
          <ScalingResult
            scaledIngredients={result}
            desiredWeight={desiredWeight}
            onSave={handleSave}
            saved={saved}
          />
        )}
      </div>
    </div>
  );
}
