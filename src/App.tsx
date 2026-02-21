import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Layout } from "@/components/Layout";
import { IngredientsPage } from "@/features/ingredients/IngredientsPage";
import { RecipesPage } from "@/features/recipes/RecipesPage";
import { RecipeDetailPage } from "@/features/recipes/RecipeDetailPage";
import { RecipeForm } from "@/features/recipes/RecipeForm";
import { ScalingPage } from "@/features/scaling/ScalingPage";
import { ScalingHistoryPage } from "@/features/scaling/ScalingHistoryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/recipes" replace />} />
          <Route path="ingredients" element={<IngredientsPage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="recipes/new" element={<RecipeForm />} />
          <Route path="recipes/:id" element={<RecipeDetailPage />} />
          <Route path="recipes/:id/edit" element={<RecipeForm />} />
          <Route path="recipes/:id/scale" element={<ScalingPage />} />
          <Route path="recipes/:id/history" element={<ScalingHistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
