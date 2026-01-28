import { PromotionsSchemaType } from "@repo/types/types";
import promotionsRepo from "@repositories/promotions.repo.js";

class Promotion_Service{
    async addNewPromotion(data : PromotionsSchemaType){
        try {
            await promotionsRepo.addNewPromotion(data);
        } catch (error) {
            console.error(`error at addNewPromotion: ${error}`);
            throw error;
        }
    }
}

export default new Promotion_Service()