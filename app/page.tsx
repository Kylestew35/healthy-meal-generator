"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function generateMeals() {
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input })
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-emerald-400">Healthy Meal Generator</h1>
          <p className="text-slate-400 text-sm">
            Enter ingredients or dietary goals. AI will generate 3 meals with macros and a grocery list.
          </p>
        </header>

        <div className="space-y-4">
          <textarea
            className="w-full h-40 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Example: chicken, rice, broccoli OR high protein, low carb, 500 calories"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={generateMeals}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Meal Plan"}
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 min-h-[200px]">
          {!result && (
            <p className="text-slate-500 text-sm">
              Your meal plan will appear here.
            </p>
          )}

          {result && (
            <div className="space-y-6 text-sm">
              {result.meals.map((meal: any, i: number) => (
                <section key={i} className="space-y-2">
                  <h2 className="text-xl font-semibold text-emerald-300">{meal.name}</h2>

                  <div>
                    <h3 className="font-semibold text-emerald-200">Ingredients</h3>
                    <ul className="list-disc list-inside text-slate-200">
                      {meal.ingredients.map((ing: string, idx: number) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-emerald-200">Instructions</h3>
                    <p className="text-slate-200 whitespace-pre-wrap">{meal.instructions}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-emerald-200">Macros</h3>
                    <p className="text-slate-200">
                      Calories: {meal.macros.calories} • Protein: {meal.macros.protein}g • Carbs: {meal.macros.carbs}g • Fat: {meal.macros.fat}g
                    </p>
                  </div>
                </section>
              ))}

              <section>
                <h2 className="text-xl font-semibold text-emerald-300">Grocery List</h2>
                <ul className="list-disc list-inside text-slate-200">
                  {result.groceryList.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
