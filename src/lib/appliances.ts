export interface Appliance {
  id: string;
  name: string;
  category: string;
  owned: boolean;
}

export const DEFAULT_APPLIANCES: Appliance[] = [
  // Cooking surfaces
  { id: "stovetop", name: "Stovetop / Gas or Electric Range", category: "Cooking Surfaces", owned: true },
  { id: "oven", name: "Oven", category: "Cooking Surfaces", owned: true },
  { id: "toaster-oven", name: "Toaster Oven", category: "Cooking Surfaces", owned: false },
  { id: "induction-cooktop", name: "Induction Cooktop", category: "Cooking Surfaces", owned: false },
  // Small appliances
  { id: "microwave", name: "Microwave", category: "Small Appliances", owned: true },
  { id: "air-fryer", name: "Air Fryer", category: "Small Appliances", owned: false },
  { id: "instant-pot", name: "Instant Pot / Pressure Cooker", category: "Small Appliances", owned: false },
  { id: "slow-cooker", name: "Slow Cooker (Crock Pot)", category: "Small Appliances", owned: false },
  { id: "rice-cooker", name: "Rice Cooker", category: "Small Appliances", owned: false },
  { id: "electric-kettle", name: "Electric Kettle", category: "Small Appliances", owned: false },
  // Prep tools
  { id: "blender", name: "Blender", category: "Prep Tools", owned: false },
  { id: "immersion-blender", name: "Immersion / Hand Blender", category: "Prep Tools", owned: false },
  { id: "food-processor", name: "Food Processor", category: "Prep Tools", owned: false },
  { id: "stand-mixer", name: "Stand Mixer", category: "Prep Tools", owned: false },
  { id: "hand-mixer", name: "Hand Mixer", category: "Prep Tools", owned: false },
  // Specialty
  { id: "sous-vide", name: "Sous Vide Circulator", category: "Specialty", owned: false },
  { id: "cast-iron", name: "Cast Iron Skillet", category: "Specialty", owned: false },
  { id: "dutch-oven", name: "Dutch Oven", category: "Specialty", owned: false },
  { id: "wok", name: "Wok", category: "Specialty", owned: false },
  { id: "grill", name: "Outdoor Grill / BBQ", category: "Specialty", owned: false },
  { id: "panini-press", name: "Panini Press / Sandwich Maker", category: "Specialty", owned: false },
  { id: "waffle-iron", name: "Waffle Iron", category: "Specialty", owned: false },
];

export const STORAGE_KEY = "kosher_recipe_appliances";

export function loadAppliances(): Appliance[] {
  if (typeof window === "undefined") return DEFAULT_APPLIANCES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_APPLIANCES;
    const parsed: Appliance[] = JSON.parse(stored);

    // Merge: keep defaults for any new appliances added in updates
    const storedIds = new Set(parsed.map((a) => a.id));
    const merged = [...parsed];
    for (const def of DEFAULT_APPLIANCES) {
      if (!storedIds.has(def.id)) merged.push(def);
    }
    return merged;
  } catch {
    return DEFAULT_APPLIANCES;
  }
}

export function saveAppliances(appliances: Appliance[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appliances));
}

export function getOwnedAppliances(appliances: Appliance[]): string[] {
  return appliances.filter((a) => a.owned).map((a) => a.name);
}
