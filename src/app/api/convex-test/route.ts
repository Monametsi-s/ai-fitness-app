// no request params needed
import { getConvexClient } from "@/lib/convexClient";
import { api } from "convex/_generated/api";

export async function POST() {
  try {
    const client = getConvexClient();
    const now = new Date().toISOString();
    const id = await client.mutation(api.programs.saveProgram, {
      profile: {
        full_name: "Test User",
        first_name: "Test",
        fitness_goal: "Connectivity Check",
        height: "1.70m",
        weight: "70 kg",
        age: 30,
        workout_days: 3,
        injuries: "",
        fitness_level: "Beginner",
        equipment_access: "Home gym",
        dietary_restrictions: "",
      },
      generated: {
        workout_plan: { title: "Test", weekly_schedule: [], description: `Inserted ${now}` },
        diet_plan: { title: "Test", daily_calories: "0", macros: { protein: "0%", carbs: "0%", fats: "0%" }, meal_examples: [], description: `Inserted ${now}` },
        model: "test",
      },
      userId: "dev-test",
    });
    return new Response(JSON.stringify({ ok: true, id }), { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
}
