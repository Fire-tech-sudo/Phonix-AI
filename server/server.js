import express from "express";
import "dotenv/config";
import cors from "cors";

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import imageRouter from "./routes/imageRoute.js";
import galleryRouter from "./routes/galleryRoute.js";
import proRouter from "./routes/proRoute.js";

import otpRouter from "./routes/otpRoute.js";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors());

await connectDB();

app.use("/api/user", userRouter);
app.use("/api/user/pro", proRouter); // user ke saath rakho, upar
app.use("/api/image/gallery", galleryRouter); // specific pehle
app.use("/api/image", imageRouter);
app.use("/api/auth", otpRouter);
// generic baad mein

app.get("/", (res, req) => req.send("API is Working..."));

app.listen(PORT, (req, res) => console.log(`APP is running on port ${PORT}`));
