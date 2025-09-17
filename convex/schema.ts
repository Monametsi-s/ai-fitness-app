import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerkId", ["clerkId"]),

  plans: defineTable({
    userId: v.id("users"),
    name: v.string(),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.optional(v.number()),
              reps: v.optional(v.number()),
              duration: v.optional(v.string()),
              description: v.optional(v.string()),
              exercises: v.optional(v.array(v.string())),
            })
          ),
        })
      ),
    }),
    dietPlan: v.object({
      dailyCalories: v.number(),
      macros: v.object({
        protein: v.string(),
        carbs: v.string(),
        fats: v.string(),
        other: v.optional(v.string()),
      }),
      meals: v.array(
        v.object({
          name: v.string(),
          ingredients: v.optional(v.array(v.string())),
          instructions: v.optional(v.string()),
          foods: v.optional(v.array(v.string())),
        })
      ),
    }),
    isActive: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_active", ["isActive"]),
});

// export default defineSchema({
// 	programs: defineTable({
// 		profile: v.object({
// 			full_name: v.optional(v.string()),
// 			first_name: v.string(),
// 			fitness_goal: v.string(),
// 			height: v.string(),
// 			weight: v.string(),
// 			age: v.number(),
// 			workout_days: v.number(),
// 			injuries: v.optional(v.string()),
// 			fitness_level: v.string(),
// 			equipment_access: v.string(),
// 			dietary_restrictions: v.optional(v.string()),
// 		}),
// 		generated: v.object({
// 			workout_plan: v.any(),
// 			diet_plan: v.any(),
// 			model: v.string(),
// 		}),
// 		userId: v.optional(v.string()),
// 	})
// 		 ,
// });
