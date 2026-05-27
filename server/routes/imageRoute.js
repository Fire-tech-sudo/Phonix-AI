import express from "express";
import { generateImage, deleteImage } from "../controllers/imageController.js";
import userAuth from "../middlewares/auth.js";

const imageRouter = express.Router();

imageRouter.post("/generate-image", userAuth, generateImage);
imageRouter.delete("/:id", userAuth, deleteImage);

export default imageRouter;
