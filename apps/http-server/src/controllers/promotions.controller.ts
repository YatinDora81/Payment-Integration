import { Request, Response } from "express";
import {promotionsSchema, PromotionsSchemaType} from '@repo/types/types'
import promotionService from "@services/promotions.service.js";

class PromotionsController {
    async addPromotion(req: Request, res: Response) {
        try {
            const parsedBody = promotionsSchema.safeParse(req.body)
            if(!parsedBody.success){
                res.status(400).json({
                    success : false,
                    data : parsedBody.error,
                    message : parsedBody.error.message || "Invalid Input Data!!!"
                })
            }

            await promotionService.addNewPromotion(parsedBody.data as PromotionsSchemaType);

            res.status(200).json({ 
                success : true,
                data : "Promotion added successfully",
                message : "Promotion added successfully"
             });
        } catch (error) {
            return res.status(500).json({ 
                success : false,
                data : error || "Internal server error",
                message : error instanceof Error ? error.message : "Internal server error"
             });
        }
    }
}

export default new PromotionsController();