"use client";

export interface ParsedRecipe {
  name: string;
  description: string;
  kosherNotes: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  ingredients: { amount: string; item: string; note?: string }[];
  steps: { number: number; title: string; instruction: string; tip?: string; appliance?: string }[];
  plating: string;
  chefNote: string;
}

interface Props {
  recipe: ParsedRecipe;
  onReset: () => void;
}

export default function RecipeDisplay({ recipe, onReset }: Props) {
  return (
    <article className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3 pb-6 border-b border-amber-200">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
          <span>✡</span> Strictly Kosher
        </div>
        <h2 className="text-3xl font-bold text-amber-900">{recipe.name}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">{recipe.description}</p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {[
            { label: "Prep", value: recipe.prepTime },
            { label: "Cook", value: recipe.cookTime },
            { label: "Serves", value: recipe.servings },
            { label: "Level", value: recipe.difficulty },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl px-4 py-2 text-center shadow-sm border border-amber-100">
              <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
              <div className="text-sm font-bold text-amber-800">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Kosher Notes */}
      {recipe.kosherNotes && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
          <span className="text-xl shrink-0">✡</span>
          <div>
            <p className="text-sm font-semibold text-blue-800 mb-1">Kosher Notes</p>
            <p className="text-sm text-blue-700">{recipe.kosherNotes}</p>
          </div>
        </div>
      )}

      {/* Ingredients */}
      <section>
        <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">🛒</span> Ingredients
        </h3>
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
          {recipe.ingredients.map((ing, i) => (
            <div
              key={i}
              className={`flex gap-4 px-5 py-3 ${
                i % 2 === 0 ? "bg-white" : "bg-amber-50"
              }`}
            >
              <span className="text-sm font-bold text-amber-700 w-24 shrink-0 text-right">
                {ing.amount}
              </span>
              <span className="text-sm text-gray-800 flex-1">
                {ing.item}
                {ing.note && (
                  <span className="text-xs text-gray-400 ml-1">({ing.note})</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section>
        <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">👨‍🍳</span> Step-by-Step Instructions
        </h3>
        <div className="space-y-4">
          {recipe.steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-3 bg-amber-600 px-5 py-3">
                <span className="text-white font-bold text-lg w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center shrink-0 text-sm">
                  {step.number}
                </span>
                <h4 className="text-white font-semibold">{step.title}</h4>
                {step.appliance && (
                  <span className="ml-auto text-xs bg-amber-500 text-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {step.appliance}
                  </span>
                )}
              </div>
              <div className="px-5 py-4 space-y-3">
                <p className="text-gray-800 leading-relaxed">{step.instruction}</p>
                {step.tip && (
                  <div className="flex gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <span className="text-yellow-500 shrink-0">💡</span>
                    <p className="text-sm text-yellow-800">
                      <span className="font-semibold">Beginner tip: </span>
                      {step.tip}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Plating */}
      {recipe.plating && (
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
          <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
            <span>🍽️</span> Plating & Presentation
          </h3>
          <p className="text-gray-700 leading-relaxed">{recipe.plating}</p>
        </section>
      )}

      {/* Chef Note */}
      {recipe.chefNote && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 flex gap-3">
          <span className="text-2xl shrink-0">👨‍🍳</span>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Chef&apos;s Note</p>
            <p className="text-sm text-gray-600 leading-relaxed">{recipe.chefNote}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onReset}
          className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
        >
          Generate Another Recipe
        </button>
        <button
          onClick={() => window.print()}
          className="px-5 py-3 border-2 border-amber-300 text-amber-700 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
        >
          Print
        </button>
      </div>
    </article>
  );
}
