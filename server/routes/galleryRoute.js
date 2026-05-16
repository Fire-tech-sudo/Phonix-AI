import express from "express";
import userAuth from "../middlewares/auth.js";
import {
	getPublicGallery,
	saveImage,
	getMyGallery,
	getFeed,
} from "../controllers/galleryController.js";

const galleryRouter = express.Router();

// Public gallery dekhne ke liye login ki zaroorat nahi hai
galleryRouter.get("/public", getPublicGallery);

// Image save karne aur apni gallery dekhne ke liye protect (login) zaroori hai
galleryRouter.post("/save", userAuth, saveImage);
galleryRouter.get("/my-images", userAuth, getMyGallery);
galleryRouter.get("/feed", userAuth, getFeed);

export default galleryRouter;
