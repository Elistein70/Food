"use client";

import { useState, useEffect } from "react";
import RecipeForm, { RecipeRequest } from "@/components/RecipeForm";
import RecipeDisplay, { ParsedRecipe } from "@/components/RecipeDisplay";
import { loadAppliances, getOwnedAppliances, Appliance } from "@/lib/appliances";

export default function HomePage() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [recipe, setRecipe] = useState<ParsedRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAppliances(loadAppliances());
  }, []);

  const ownedAppliances = getOwnedAppliances(appliances);

  async function handleGenerate(request: RecipeRequest) {
    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...request,
          appliances: ownedAppliances,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setRecipe(data.recipe);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Intro banner */}
      {!recipe && (
        <div className="text-center space-y-3">
          <div className="inline-flex gap-1 text-4xl">
            <span>🍽️</span><span>✡</span><span>⭐</span>
          </div>
          <h2 className="text-2xl font-bold text-amber-900">
            Michelin-Level Kosher Recipes, Simplified
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Answer a few quick questions and we&apos;ll craft an elevated, strictly Kosher recipe
            built around your ingredients — with step-by-step guidance written for beginner cooks.
          </p>
          {ownedAppliances.length === 0 && (
            <div className="bg-amber-100 border border-amber-300 rounded-xl p-4 text-sm text-amber-800">
              <strong>Tip:</strong> Visit{" "}
              <a href="/appliances" className="underline font-semibold">
                My Kitchen
              </a>{" "}
              to set up your appliances so recipes are tailored to what you have.
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Recipe or Form */}
      {recipe ? (
        <RecipeDisplay recipe={recipe} onReset={() => setRecipe(null)} />
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-amber-100 p-6 sm:p-8">
          <RecipeForm
            onSubmit={handleGenerate}
            loading={loading}
            ownedAppliances={ownedAppliances}
          />
        </div>
      )}

      {/* Loading overlay feel */}
      {loading && (
        <div className="text-center text-amber-700 text-sm animate-pulse">
          Our chef is crafting your recipe... this usually takes 10-20 seconds.
        </div>
      )}
    </div>
  );
}
