"use client";

import { useState, useRef, useEffect } from "react";

export type MealType = "breakfast" | "lunch" | "dinner" | "dessert" | "snack" | "appetizer";
export type KosherCategory = "meat" | "dairy" | "pareve";

export interface RecipeRequest {
  ingredients: string;
  mealType: MealType;
  kosherCategory: KosherCategory;
  servings: number;
}

interface Props {
  onSubmit: (req: RecipeRequest) => void;
  loading: boolean;
  ownedAppliances: string[];
}

type Step = 0 | 1 | 2 | 3 | 4;

const STEP_LABELS = ["Ingredients", "Meal", "Kosher", "Servings", "Let's go"];
const TOTAL_STEPS = 4; // steps 0-3 are questions; step 4 is confirm/submit

const MEAL_OPTIONS: { value: MealType; label: string; emoji: string }[] = [
  { value: "breakfast", label: "Breakfast", emoji: "🥐" },
  { value: "lunch",     label: "Lunch",     emoji: "🥗" },
  { value: "dinner",    label: "Dinner",    emoji: "🍽️" },
  { value: "appetizer", label: "Appetizer", emoji: "🥙" },
  { value: "dessert",   label: "Dessert",   emoji: "🍰" },
  { value: "snack",     label: "Snack",     emoji: "🫙" },
];

const KOSHER_OPTIONS: { value: KosherCategory; label: string; hebrew: string; desc: string; color: string }[] = [
  {
    value: "meat",
    label: "Fleishig",
    hebrew: "Meat",
    desc: "Kosher meat or poultry. No dairy whatsoever.",
    color: "border-red-300 bg-red-50 text-red-900",
  },
  {
    value: "dairy",
    label: "Milchig",
    hebrew: "Dairy",
    desc: "Dairy products welcome. No meat or poultry.",
    color: "border-blue-300 bg-blue-50 text-blue-900",
  },
  {
    value: "pareve",
    label: "Pareve",
    hebrew: "Neutral",
    desc: "No meat and no dairy. Goes with either meal.",
    color: "border-green-300 bg-green-50 text-green-900",
  },
];

const SERVING_OPTIONS = [1, 2, 3, 4, 6, 8];

const INGREDIENT_SUGGESTIONS = [
  "chicken", "salmon", "beef", "lamb", "eggs", "tofu",
  "lentils", "potatoes", "pasta", "rice", "zucchini", "cauliflower",
  "chickpeas", "mushrooms", "eggplant", "spinach",
];

export default function RecipeForm({ onSubmit, loading, ownedAppliances }: Props) {
  const [step, setStep] = useState<Step>(0);
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState<MealType | null>(null);
  const [kosherCategory, setKosherCategory] = useState<KosherCategory | null>(null);
  const [servings, setServings] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus the textarea when on step 0
  useEffect(() => {
    if (step === 0) textareaRef.current?.focus();
  }, [step]);

  function addSuggestion(word: string) {
    setIngredients((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return word;
      if (trimmed.toLowerCase().includes(word.toLowerCase())) return prev;
      return trimmed.endsWith(",") ? `${trimmed} ${word}` : `${trimmed}, ${word}`;
    });
    textareaRef.current?.focus();
  }

  function canAdvance() {
    if (step === 0) return ingredients.trim().length > 0;
    if (step === 1) return mealType !== null;
    if (step === 2) return kosherCategory !== null;
    if (step === 3) return servings !== null;
    return true;
  }

  function advance() {
    if (!canAdvance()) return;
    if (step < 4) setStep((step + 1) as Step);
  }

  function back() {
    if (step > 0) setStep((step - 1) as Step);
  }

  function handleSubmit() {
    if (!mealType || !kosherCategory || !servings) return;
    onSubmit({ ingredients, mealType, kosherCategory, servings });
  }

  const kosherLabel = KOSHER_OPTIONS.find((o) => o.value === kosherCategory);
  const mealLabel   = MEAL_OPTIONS.find((o) => o.value === mealType);

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          {STEP_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => { if (i <= step) setStep(i as Step); }}
              className={`text-xs font-medium transition-colors ${
                i === step
                  ? "text-amber-700"
                  : i < step
                  ? "text-amber-500 cursor-pointer hover:text-amber-700"
                  : "text-gray-300 cursor-default"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Step 0: Ingredients ── */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-amber-900">
              What ingredients do you want to use?
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              List anything you have or want to cook with. Don&apos;t worry about being exact — we&apos;ll handle the rest.
            </p>
          </div>

          <textarea
            ref={textareaRef}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && canAdvance()) {
                e.preventDefault();
                advance();
              }
            }}
            placeholder="e.g. chicken thighs, lemon, garlic, fresh herbs..."
            rows={3}
            className="w-full border-2 border-amber-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none leading-relaxed"
          />

          <div>
            <p className="text-xs text-gray-400 mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {INGREDIENT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSuggestion(s)}
                  className="px-3 py-1 text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-full hover:bg-amber-100 transition-colors capitalize"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1: Meal type ── */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-amber-900">What meal is this for?</h2>
            <p className="text-sm text-gray-500 mt-1">We&apos;ll match the recipe to the occasion.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MEAL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { setMealType(opt.value); }}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all font-medium ${
                  mealType === opt.value
                    ? "bg-amber-500 border-amber-500 text-white shadow-lg scale-105"
                    : "bg-white border-gray-200 hover:border-amber-300 text-gray-600"
                }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Kosher category ── */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-amber-900">Milchig, Fleishig, or Pareve?</h2>
            <p className="text-sm text-gray-500 mt-1">Choose the Kosher category for this meal.</p>
          </div>
          <div className="flex flex-col gap-3">
            {KOSHER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setKosherCategory(opt.value)}
                className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                  kosherCategory === opt.value
                    ? `${opt.color} border-opacity-100 shadow-md scale-[1.02]`
                    : "bg-white border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <div className={`w-5 h-5 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  kosherCategory === opt.value ? "border-current" : "border-gray-300"
                }`}>
                  {kosherCategory === opt.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-current" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-base">
                    {opt.label}{" "}
                    <span className="font-normal opacity-60 text-sm">({opt.hebrew})</span>
                  </p>
                  <p className="text-sm opacity-75 mt-0.5">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 3: Servings ── */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-amber-900">How many servings?</h2>
            <p className="text-sm text-gray-500 mt-1">
              The recipe and quantities will be scaled exactly to this.
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {SERVING_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setServings(n)}
                className={`flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all font-bold text-lg ${
                  servings === n
                    ? "bg-amber-500 border-amber-500 text-white shadow-lg scale-110"
                    : "bg-white border-gray-200 hover:border-amber-300 text-gray-700"
                }`}
              >
                {n}
                <span className="text-xs font-normal opacity-70">
                  {n === 1 ? "person" : "people"}
                </span>
              </button>
            ))}
          </div>

          {/* Custom number */}
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-400">Other amount:</p>
            <input
              type="number"
              min={1}
              max={50}
              placeholder="e.g. 12"
              value={servings && !SERVING_OPTIONS.includes(servings) ? servings : ""}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!isNaN(v) && v > 0) setServings(v);
              }}
              className="w-24 border-2 border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
            />
          </div>
        </div>
      )}

      {/* ── Step 4: Confirm ── */}
      {step === 4 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-amber-900">Ready to cook?</h2>
            <p className="text-sm text-gray-500 mt-1">Here&apos;s what we&apos;re working with:</p>
          </div>

          <div className="bg-amber-50 rounded-2xl border border-amber-200 divide-y divide-amber-100 overflow-hidden">
            <SummaryRow label="Ingredients" value={ingredients} onEdit={() => setStep(0)} />
            <SummaryRow
              label="Meal"
              value={`${mealLabel?.emoji} ${mealLabel?.label}`}
              onEdit={() => setStep(1)}
            />
            <SummaryRow
              label="Kosher"
              value={`${kosherLabel?.label} (${kosherLabel?.hebrew})`}
              onEdit={() => setStep(2)}
            />
            <SummaryRow
              label="Servings"
              value={`${servings} ${servings === 1 ? "person" : "people"}`}
              onEdit={() => setStep(3)}
            />
          </div>

          {ownedAppliances.length > 0 && (
            <div className="flex gap-2 bg-white rounded-xl border border-amber-100 p-3">
              <span className="text-sm shrink-0">🍳</span>
              <p className="text-xs text-amber-700">
                <span className="font-semibold">Your kitchen:</span>{" "}
                {ownedAppliances.join(", ")}
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
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
        </div>
      )}

      {/* Navigation */}
      {step < 4 && (
        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="px-5 py-3 border-2 border-gray-200 text-gray-500 rounded-xl font-medium hover:border-amber-300 hover:text-amber-700 transition-colors"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={advance}
            disabled={!canAdvance()}
            className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {step === 3 ? "Review" : "Next"}
          </button>
        </div>
      )}

      {step === 4 && (
        <button
          type="button"
          onClick={back}
          className="w-full py-2 text-sm text-gray-400 hover:text-amber-700 transition-colors"
        >
          Back to edit
        </button>
      )}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide w-20 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-gray-800 flex-1">{value}</span>
      <button
        onClick={onEdit}
        className="text-xs text-amber-600 hover:text-amber-800 font-medium shrink-0"
      >
        Edit
      </button>
    </div>
  );
}
