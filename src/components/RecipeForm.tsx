"use client";

import { useState } from "react";

export type MealType = "breakfast" | "lunch" | "dinner" | "dessert" | "snack" | "appetizer";
export type KosherCategory = "meat" | "dairy" | "pareve";

export interface RecipeRequest {
  mealType: MealType;
  kosherCategory: KosherCategory;
  servings: number;
  specialRequests: string;
  cuisineStyle: string;
}

interface Props {
  onSubmit: (req: RecipeRequest) => void;
  loading: boolean;
  ownedAppliances: string[];
}

export default function RecipeForm({ onSubmit, loading, ownedAppliances }: Props) {
  const [mealType, setMealType] = useState<MealType>("dinner");
  const [kosherCategory, setKosherCategory] = useState<KosherCategory>("meat");
  const [servings, setServings] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [cuisineStyle, setCuisineStyle] = useState("French / Modern European");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ mealType, kosherCategory, servings, specialRequests, cuisineStyle });
  }

  const mealOptions: { value: MealType; label: string; emoji: string }[] = [
    { value: "breakfast", label: "Breakfast", emoji: "🥐" },
    { value: "lunch", label: "Lunch", emoji: "🥗" },
    { value: "dinner", label: "Dinner", emoji: "🍽️" },
    { value: "appetizer", label: "Appetizer", emoji: "🥙" },
    { value: "dessert", label: "Dessert", emoji: "🍰" },
    { value: "snack", label: "Snack", emoji: "🫙" },
  ];

  const kosherOptions: { value: KosherCategory; label: string; desc: string }[] = [
    { value: "meat", label: "Fleishig (Meat)", desc: "Contains kosher meat or poultry" },
    { value: "dairy", label: "Milchig (Dairy)", desc: "Contains dairy (no meat)" },
    { value: "pareve", label: "Pareve (Neutral)", desc: "No meat or dairy — can be eaten with either" },
  ];

  const cuisines = [
    "French / Modern European",
    "Mediterranean",
    "Middle Eastern",
    "Italian",
    "Japanese / Asian Fusion",
    "American",
    "Israeli",
    "Moroccan / North African",
    "Surprise me!",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Meal Type */}
      <fieldset>
        <legend className="text-sm font-semibold text-amber-800 mb-3">What are you cooking?</legend>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {mealOptions.map((opt) => (
            <label
              key={opt.value}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                mealType === opt.value
                  ? "bg-amber-500 border-amber-500 text-white"
                  : "bg-white border-gray-200 hover:border-amber-300 text-gray-600"
              }`}
            >
              <input
                type="radio"
                name="mealType"
                value={opt.value}
                checked={mealType === opt.value}
                onChange={() => setMealType(opt.value)}
                className="sr-only"
              />
              <span className="text-xl">{opt.emoji}</span>
              <span className="text-xs font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Kosher Category */}
      <fieldset>
        <legend className="text-sm font-semibold text-amber-800 mb-3">Kosher category</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {kosherOptions.map((opt) => (
            <label
              key={opt.value}
              className={`flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                kosherCategory === opt.value
                  ? "bg-blue-50 border-blue-400 text-blue-900"
                  : "bg-white border-gray-200 hover:border-blue-300 text-gray-600"
              }`}
            >
              <input
                type="radio"
                name="kosherCategory"
                value={opt.value}
                checked={kosherCategory === opt.value}
                onChange={() => setKosherCategory(opt.value)}
                className="sr-only"
              />
              <span className="text-sm font-semibold">{opt.label}</span>
              <span className="text-xs opacity-75">{opt.desc}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Cuisine & Servings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-amber-800 mb-2">
            Cuisine style
          </label>
          <select
            value={cuisineStyle}
            onChange={(e) => setCuisineStyle(e.target.value)}
            className="w-full border-2 border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            {cuisines.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-amber-800 mb-2">
            Servings: <span className="text-amber-600">{servings}</span>
          </label>
          <input
            type="range"
            min={1}
            max={8}
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            className="w-full accent-amber-500 mt-2"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>8</span>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-semibold text-amber-800 mb-2">
          Special requests <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="e.g. no mushrooms, something elegant for a Shabbos dinner, I love lemon flavors..."
          rows={2}
          className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
        />
      </div>

      {/* Appliance Summary */}
      {ownedAppliances.length > 0 && (
        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
          <p className="text-xs text-amber-700">
            <span className="font-semibold">Using your kitchen:</span>{" "}
            {ownedAppliances.join(", ")}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold text-lg hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-amber-200"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Creating your recipe...
          </span>
        ) : (
          "Generate My Kosher Recipe"
        )}
      </button>
    </form>
  );
}
