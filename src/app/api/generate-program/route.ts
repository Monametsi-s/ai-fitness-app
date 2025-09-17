import { NextRequest } from "next/server";
import { z } from "zod";
import { getConvexClient } from "@/lib/convexClient";
import { api } from "convex/_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ProfileSchema = z.object({
  full_name: z.string().optional(),
  first_name: z.string(),
  fitness_goal: z.string(),
  height: z.string(),
  weight: z.string(),
  age: z.number(),
  workout_days: z.number(),
  injuries: z.string().optional(),
  fitness_level: z.string(),
  equipment_access: z.string(),
  dietary_restrictions: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ProfileSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 });
    }

    const profile = parsed.data;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `You are a certified fitness and nutrition coach. Create a clear, structured weekly gym workout plan and a daily diet plan for the following person. Return JSON with keys workout_plan and diet_plan. Keep details practical.
    Profile: ${JSON.stringify(profile)}
    JSON shape:
    {
      "workout_plan": {
        "title": string,
        "weekly_schedule": Array<{ day: string, focus: string, duration: string }>,
        "description": string
      },
      "diet_plan": {
        "title": string,
        "daily_calories": string,
        "macros": { "protein": string, "carbs": string, "fats": string },
        "meal_examples": Array<{ meal: string, example: string }>,
        "description": string
      }
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response (handles cases where model wraps codeblock)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ error: "Model did not return JSON" }), { status: 502 });
    }
    const generated = JSON.parse(jsonMatch[0]);

    // Save using Convex
  const client = getConvexClient();
  const id = await client.mutation(api.programs.saveProgram, {
      profile,
      generated,
      userId: undefined,
    });

    return new Response(JSON.stringify({ id, profile, generated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("/api/generate-program error", err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
