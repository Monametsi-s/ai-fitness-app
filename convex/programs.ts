import { mutationGeneric } from "convex/server";
import { v } from "convex/values";

export const saveProgram = mutationGeneric({
	args: {
		profile: v.object({
			full_name: v.optional(v.string()),
			first_name: v.string(),
			fitness_goal: v.string(),
			height: v.string(),
			weight: v.string(),
			age: v.number(),
			workout_days: v.number(),
			injuries: v.optional(v.string()),
			fitness_level: v.string(),
			equipment_access: v.string(),
			dietary_restrictions: v.optional(v.string()),
		}),
		generated: v.object({
			workout_plan: v.any(),
			diet_plan: v.any(),
			model: v.string(),
		}),
		userId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const id = await ctx.db.insert("programs", {
			profile: args.profile,
			generated: args.generated,
			userId: args.userId,
		});
		return id;
	},
});

