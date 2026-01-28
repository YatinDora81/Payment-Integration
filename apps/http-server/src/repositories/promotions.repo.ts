import { PromotionsSchemaType } from "@repo/types/types";
import { prisma } from "@repo/db/db";
import { v4 as uuidv4 } from 'uuid';
class PromotionsRepository {
  async addNewPromotion(body: PromotionsSchemaType) {
    try {
      await prisma.$transaction(async (tx) => {
        const promotionMap = new Map<number, string>();
        body.forEach((d, index) => {
          promotionMap.set(index, uuidv4());
        });

        const promotionsData = await tx.promotions.createMany({
          data: body.map((d, index) => ({
            id: promotionMap.get(index),
            name: d.promotion.name,
            type: d.promotion.type,
            category: d.promotion.category,
            isActive: d.promotion.isActive,
            priority: d.promotion.priority,
            exclusive: d.promotion.exclusive,
            isStackable: d.promotion.isStackable,
            startAt: new Date(d.promotion.startAt),
            endAt: new Date(d.promotion.endAt),
          }))  
        });

        await tx.promotionRules.createMany({
            data: body.map((b, index) => ({
              promotionId: promotionMap.get(index)!,
              ruleType: b.rules.ruleType,
              operator: b.rules.operator,
              value: JSON.parse(b.rules.value),
            })),
          });
        
        await tx.promotionEffects.createMany({
            data: body.map((b,i)=>({
                promotionId: promotionMap.get(i)!,
                effectType: b.effects.effectType,
                value: b.effects.value,
                maxDiscount: b.effects.maxDiscount,
            }))
        })

        await tx.couponCode.createMany({
            data: body.map((b,i)=>({
                promotionId: promotionMap.get(i)!,
                code: b.coupons.code,
                maxUses: b.coupons.maxUses,
                perUserLimit: b.coupons.perUserLimit,
                isPublic: b.coupons.isPublic,
            }))
        })

      });
    } catch (error) {
      console.error(`error at addNewPromotion Repository: ${error}`);
      throw error;
    }
  }
}

export default new PromotionsRepository();
