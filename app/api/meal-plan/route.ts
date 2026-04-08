export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input) {
      return NextResponse.json(
        { error: "Missing input. Provide ingredients or dietary goals." },
        { status: 400 }
      );
    }

    const prompt = `
You are a nutritionist and meal planner.

The user will provide either:
- Ingredients (e.g., "chicken, rice, broccoli")
OR
- Dietary goals (e.g., "high protein, low carb, 500 calories")

Return ONLY valid JSON with this structure:

{
  "meals": [
    {
      "name": string,
      "ingredients": string[],
      "instructions": string,
      "macros": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number
      }
    }
  ],
  "groceryList": string[]
}

User input:
${input}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a nutritionist. Return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4
    });

    const msg = completion.choices[0].message as any;

    let parsed;

    if (msg.parsed) {
      parsed = msg.parsed;
    } else if (typeof msg.content === "string") {
      parsed = JSON.parse(msg.content);
    } else {
      throw new Error("Could not parse JSON.");
    }

    return NextResponse.json({ result: parsed });
  } catch (error) {
    console.error("Error in /api/meal-plan:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan." },
      { status: 500 }
    );
  }
}
