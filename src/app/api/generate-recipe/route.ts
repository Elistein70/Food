import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { mealType, kosherCategory, servings, specialRequests, cuisineStyle, appliances } =
      await req.json();

    if (!appliances || appliances.length === 0) {
      return NextResponse.json(
        { error: "No appliances provided. Please set up your kitchen first." },
        { status: 400 }
      );
    }

    const kosherGuide: Record<string, string> = {
      meat: "FLEISHIG (meat): Use only kosher-certified meat or poultry. No dairy of any kind — no butter, milk, cream, or cheese. No pork or shellfish ever.",
      dairy: "MILCHIG (dairy): May include dairy. No meat or poultry. No pork or shellfish ever.",
      pareve:
        "PAREVE (neutral): No meat, poultry, or dairy whatsoever. Fish (with fins and scales only) is permitted. This dish can be eaten with either a meat or dairy meal.",
    };

    const systemPrompt = `You are a world-class Michelin-star chef who also deeply understands Jewish kosher dietary laws.
Your mission is to create elegant, impressive recipes that are:
1. Strictly Kosher — you never make mistakes on this
2. Achievable by a complete beginner home cook
3. Written with crystal-clear instructions that assume zero culinary knowledge

When you write steps, explain WHY each step matters (e.g. "We sear the meat first to lock in flavor and create a beautiful brown crust — this process is called the Maillard reaction").
Define any culinary terms immediately after using them.
Warn about common beginner mistakes before they happen.
Give visual/sensory cues so the cook knows when something is done (e.g. "The onions are ready when they are completely soft and translucent with golden edges").

KOSHER LAW TO FOLLOW: ${kosherGuide[kosherCategory as keyof typeof kosherGuide]}

Available kitchen appliances: ${appliances.join(", ")}
You MUST only use these appliances in your recipe. If an appliance is not on this list, do not use it.`;

    const userPrompt = `Create a ${cuisineStyle} ${mealType} recipe for ${servings} serving${servings !== 1 ? "s" : ""}.
Kosher category: ${kosherCategory}
${specialRequests ? `Special requests: ${specialRequests}` : ""}

Respond with ONLY a valid JSON object. No markdown, no explanation outside the JSON. Use this exact structure:

{
  "name": "Recipe name",
  "description": "2-3 sentence description of the dish and why it is special",
  "kosherNotes": "Specific kosher considerations for this recipe (certifications to look for, substitutions, etc.)",
  "prepTime": "e.g. 20 minutes",
  "cookTime": "e.g. 35 minutes",
  "servings": "${servings}",
  "difficulty": "Beginner-friendly",
  "ingredients": [
    { "amount": "2 tbsp", "item": "extra-virgin olive oil", "note": "look for the kosher certification symbol" }
  ],
  "steps": [
    {
      "number": 1,
      "title": "Short step title",
      "instruction": "Detailed, beginner-friendly instruction. Explain what to do, how to do it, and what it should look, smell, or feel like when done correctly.",
      "tip": "A beginner tip — a common mistake to avoid or a helpful trick",
      "appliance": "Name of appliance used in this step, or null if none"
    }
  ],
  "plating": "Simple but elegant plating instructions a beginner can follow",
  "chefNote": "An inspiring chef's note about the dish, its origins, or how to make it your own"
}`;

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type from AI" }, { status: 500 });
    }

    // Strip markdown code fences if present
    let jsonText = content.text.trim();
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
    return NextResponse.json(
      { error: "Failed to generate recipe. Please try again." },
      { status: 500 }
    );
  }
}
