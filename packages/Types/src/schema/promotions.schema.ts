import { z } from "zod";

export const promotionsSchema = z.array(
  z.object({
    promotion: z.object({
      name: z.string(),
      type: z.enum(["AUTO", "COUPON", "TARGETED", "LOYALTY"]),
      category: z.enum(["NORMAL", "USER_SPECIFIC"]),
      isActive: z.boolean(),
      priority: z.number(),
      exclusive: z.boolean(),
      isStackable: z.boolean(),
      startAt: z.coerce.date(), // Converts ISO string to Date
      endAt: z.coerce.date(),   // Converts ISO string to Date
    }),
    rules: z.object({
      ruleType: z.enum([
        "MIN_ORDER_VALUE",
        "FIRST_PURCHASE",
        "MAX_USER_ORDERS",
        "PLAN_IN",
        "USER_IN",
        "COUNTRY_IN",
      ]),
      operator: z.string(),
      value: z.any(),
    }),
    
    effects: 
      z.object({
        effectType: z.enum([
          "PERCENT_DISCOUNT",
          "FLAT_DISCOUNT",
          "BONUS_CREDITS",
        ]),
        value: z.number(),
        maxDiscount: z.number().optional(),
      }),
    coupons: z.object({
        code: z.string(),
        maxUses: z.number(),
        perUserLimit: z.number(),
        isPublic: z.boolean(),
    }),
  }),
);

export type PromotionsSchemaType = z.infer<typeof promotionsSchema>;
