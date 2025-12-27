import express from "express"
import "dotenv/config";
import cors from "cors";

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import imageRouter from "./routes/imageRoute.js";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json())
app.use(cors())

await connectDB();

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);

app.get('/', (res, req) => req.send("API is Working..."));

app.listen(PORT, (req, res) => console.log(`APP is running on port ${PORT}`));