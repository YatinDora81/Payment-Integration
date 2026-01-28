import promotionsController from "@controllers/promotions.controller.js";
import { Router } from "express";
const router: Router = Router();

router.post("/add-promotions", promotionsController.addPromotion);

export default router;