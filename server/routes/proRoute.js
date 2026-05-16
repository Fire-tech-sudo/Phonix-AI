import express from "express";
import userAuth from "../middlewares/auth.js";
import { getProStatus, cancelPro } from "../controllers/proController.js";

const proRouter = express.Router();

// Teeno routes protected hain — login zaroori hai
proRouter.get("/status", userAuth, getProStatus);
proRouter.post("/cancel", userAuth, cancelPro);

export default proRouter;
