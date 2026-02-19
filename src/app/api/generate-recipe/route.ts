import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { ingredients, mealType, kosherCategory, servings, appliances } =
      await req.json();

    if (!appliances || appliances.length === 0) {
      return NextResponse.json(
        { error: "No appliances provided. Please set up your kitchen first." },
        { status: 400 }
      );
    }

    const kosherGuide: Record<string, string> = {
      meat: "FLEISHIG (meat): Use only kosher-certified meat or poultry. Absolutely no dairy — no butter, milk, cream, or cheese. No pork or shellfish ever.",
      dairy: "MILCHIG (dairy): May include dairy ingredients. No meat or poultry. No pork or shellfish ever.",
      pareve:
        "PAREVE (neutral): No meat, poultry, or dairy whatsoever. Fish with fins and scales is permitted. This dish can be served with either a meat or dairy meal.",
    };

    const systemPrompt = `You are a world-class Michelin-star chef with deep expertise in Jewish kosher dietary laws.
Your mission: create impressive, elegant recipes that are:
1. Strictly Kosher — you never make errors on this. It is non-negotiable.
2. Built around the specific ingredients the user provides — use them as the stars of the dish.
3. Achievable by a complete beginner home cook with no prior cooking experience.
4. Written with crystal-clear, step-by-step instructions that assume zero culinary knowledge.

When writing steps:
- Explain WHY each step matters (e.g. "We sear the meat first to lock in flavor through a process called the Maillard reaction").
- Define culinary terms immediately (e.g. "julienne — this means cutting into thin matchstick-sized strips").
- Warn about common beginner mistakes before they happen.
- Give visual, sensory, and timing cues so the cook knows when something is done (e.g. "The garlic is ready when it smells fragrant and turns light golden — not brown or it will be bitter").
- Scale every quantity precisely to the requested number of servings.

KOSHER LAW: ${kosherGuide[kosherCategory as keyof typeof kosherGuide]}

Available kitchen appliances: ${appliances.join(", ")}
IMPORTANT: Only use these appliances. Do not reference any appliance not on this list.`;

    const userPrompt = `Create a Michelin-star level ${mealType} recipe for exactly ${servings} serving${servings !== 1 ? "s" : ""}.

Kosher category: ${kosherCategory}
Core ingredients to use: ${ingredients}

Build an elevated, restaurant-quality dish centered on these ingredients. You may add complementary pantry staples (kosher salt, olive oil, spices, etc.) but the provided ingredients must be the stars of the recipe.

All quantities must be precisely scaled for ${servings} serving${servings !== 1 ? "s" : ""}.

Respond with ONLY a valid JSON object — no markdown, no explanation outside the JSON:

{
  "name": "Recipe name",
  "description": "2-3 sentence description of the dish, its flavors, and why it is special",
  "kosherNotes": "Specific kosher considerations: what certifications to look for on packaging, any substitution warnings, or separation reminders",
  "prepTime": "e.g. 20 minutes",
  "cookTime": "e.g. 35 minutes",
  "servings": "${servings}",
  "difficulty": "Beginner-friendly",
  "ingredients": [
    { "amount": "2 tbsp", "item": "extra-virgin olive oil", "note": "look for a kosher certification symbol on the label" }
  ],
  "steps": [
    {
      "number": 1,
      "title": "Short step title",
      "instruction": "Full beginner-friendly instruction. Explain what to do, how to do it, and what it should look, smell, or feel like when done correctly. Include exact times and temperatures.",
      "tip": "A beginner tip — a common mistake to avoid or a helpful trick to guarantee success",
      "appliance": "Name of the specific appliance used in this step, or null if no appliance"
    }
  ],
  "plating": "Simple but elegant plating and presentation instructions a beginner can follow to make the dish look restaurant-quality",
  "chefNote": "An inspiring chef's note about the dish, its origins, or how to personalize it"
}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    let jsonText = result.response.text().trim();

    // Strip markdown code fences if present
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    let recipe;
    try {
      recipe = JSON.parse(jsonText);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse recipe. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Recipe generation error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Failed to generate recipe: ${message}` },
      { status: 500 }
    );
  }
}
