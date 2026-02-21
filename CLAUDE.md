# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build` (runs `tsc -b && vite build`)
- **Lint:** `pnpm lint`
- **Preview production build:** `pnpm preview`

## Architecture

Baker's Notebook is a client-side-only React SPA for managing baking recipes with baker's percentage calculations and recipe scaling. All data is persisted in localStorage (no backend).

### Tech Stack

- React 19 + TypeScript (strict mode) with Vite 7 and SWC
- Tailwind CSS v4 (using `@theme` directive in `src/index.css`, not `tailwind.config`)
- React Router v7 (BrowserRouter)
- Lucide React for icons
- pnpm as package manager

### Path Alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`). Always use `@/` imports.

### Project Structure

- `src/types/index.ts` — All shared TypeScript interfaces (`Ingredient`, `Recipe`, `Scaling`, `ScaledIngredient`, `RecipeIngredient`) and `STORAGE_KEYS` constants
- `src/lib/` — Pure utility functions: `baker-math.ts` (percentage calculation, recipe scaling), `storage.ts` (localStorage wrapper), `id.ts` (UUID generation)
- `src/hooks/useLocalStorage.ts` — Generic localStorage-backed state hook used by all feature hooks
- `src/components/` — Shared UI primitives: `Button` (variants: primary/secondary/danger/ghost), `Input`, `Toggle`, `ConfirmDialog`, `EmptyState`, `PageHeader`, `Layout`, `NavBar`
- `src/features/` — Feature modules organized by domain:
  - `ingredients/` — CRUD for ingredient library, `useIngredients` hook
  - `recipes/` — CRUD for recipes with ingredient rows, `useRecipes` hook
  - `scaling/` — Scale recipes to target weight, scaling history, `useScalings` hook

### Data Flow Pattern

Each feature has a custom hook (`useIngredients`, `useRecipes`, `useScalings`) that wraps `useLocalStorage` and exposes CRUD operations. Data is stored under namespaced keys (`bakers-notebook:*`).

### Design System

Custom warm/artisanal color palette defined as Tailwind v4 theme tokens in `src/index.css`: `cream`, `parchment`, `wheat`, `crust`, `brown`, `gold`, `red`, `green` (with light/dark variants). Typography uses Playfair Display (serif, for headings) and Inter (sans, for body). Fonts loaded via Google Fonts in `index.html`.

### Key Domain Concept — Baker's Percentages

All ingredient weights are relative to total flour weight (flour = 100%). The `calculatePercentages` and `scaleRecipe` functions in `src/lib/baker-math.ts` implement this. Ingredients have an `isFlour` flag that determines the percentage base.
