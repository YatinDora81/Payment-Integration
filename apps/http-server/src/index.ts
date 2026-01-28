import express, { Express } from "express";
import promotionsRoutes from "@routes/promotions.routes";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/promotions", promotionsRoutes);

export default app;