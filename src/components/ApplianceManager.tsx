"use client";

import { useState, useEffect } from "react";
import {
  Appliance,
  loadAppliances,
  saveAppliances,
} from "@/lib/appliances";

export default function ApplianceManager() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Other");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAppliances(loadAppliances());
  }, []);

  function toggle(id: string) {
    setAppliances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, owned: !a.owned } : a))
    );
    setSaved(false);
  }

  function addCustom() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const id = `custom-${Date.now()}`;
    const updated = [
      ...appliances,
      { id, name: trimmed, category: newCategory, owned: true },
    ];
    setAppliances(updated);
    setNewName("");
    setSaved(false);
  }

  function remove(id: string) {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
    setSaved(false);
  }

  function save() {
    saveAppliances(appliances);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  // Group by category
  const categories = Array.from(new Set(appliances.map((a) => a.category)));
  const ownedCount = appliances.filter((a) => a.owned).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-900">My Kitchen</h2>
          <p className="text-sm text-amber-700 mt-1">
            {ownedCount} appliance{ownedCount !== 1 ? "s" : ""} — recipes will
            be tailored to what you have
          </p>
        </div>
        <button
          onClick={save}
          className="px-5 py-2 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors shadow"
        >
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Appliance Categories */}
      {categories.map((cat) => (
        <section key={cat}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-600 mb-3 border-b border-amber-200 pb-1">
            {cat}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {appliances
              .filter((a) => a.category === cat)
              .map((appliance) => (
                <label
                  key={appliance.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all select-none ${
                    appliance.owned
                      ? "bg-amber-100 border-amber-400 text-amber-900"
                      : "bg-white border-gray-200 text-gray-500 hover:border-amber-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={appliance.owned}
                    onChange={() => toggle(appliance.id)}
                    className="w-4 h-4 accent-amber-600 shrink-0"
                  />
                  <span className="text-sm font-medium flex-1">
                    {appliance.name}
                  </span>
                  {appliance.id.startsWith("custom-") && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        remove(appliance.id);
                      }}
                      className="text-red-400 hover:text-red-600 text-xs ml-auto"
                      title="Remove"
                    >
                      Remove
                    </button>
                  )}
                </label>
              ))}
          </div>
        </section>
      ))}

      {/* Add Custom Appliance */}
      <section className="bg-white rounded-2xl border-2 border-dashed border-amber-300 p-5">
        <h3 className="text-sm font-semibold text-amber-700 mb-3">
          Add a Custom Appliance
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. Ninja Foodi, George Foreman Grill..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            className="flex-1 border border-amber-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option>Cooking Surfaces</option>
            <option>Small Appliances</option>
            <option>Prep Tools</option>
            <option>Specialty</option>
            <option>Other</option>
          </select>
          <button
            onClick={addCustom}
            className="px-5 py-2 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap"
          >
            + Add
          </button>
        </div>
      </section>

      <p className="text-xs text-gray-400 text-center">
        Changes are saved locally in your browser. Click Save Changes to confirm.
      </p>
    </div>
  );
}
