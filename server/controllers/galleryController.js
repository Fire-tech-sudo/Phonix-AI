import userModel from "../models/userModel.js";
import galleryModel from "../models/galleryModel.js";

// 1. Image Save Karne ki Logic
export const saveImage = async (req, res) => {
    try {
        // Safe check for authentication
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID missing",
            });
        }

        const { imageUrl, prompt, requestedVisibility } = req.body;

        // Input validation
        if (!imageUrl || !prompt) {
            return res.status(400).json({
                success: false,
                message: "Image URL and Prompt are required",
            });
        }

        const userId = req.userId;

        // Performance Optimization: Sirf 'isPro' field select karein, pura user object nahi
        const user = await userModel.findById(userId).select("isPro");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User Not Found" });
        }

        // Visibility Logic: Only pro users can set private
        let finalVisibility = "public";
        if (user.isPro && requestedVisibility === "private") {
            finalVisibility = "private";
        }

        const newImage = new galleryModel({
            userId,
            imageUrl,
            prompt,
            visibility: finalVisibility,
        });

        await newImage.save();
        return res.status(201).json({ success: true, data: newImage });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Public Gallery Fetch Karne ki Logic (With Pagination)
export const getPublicGallery = async (req, res) => {
    try {
        // Pagination logic parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Fetch paginated public images
        const images = await galleryModel
            .find({ visibility: "public" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalImages = await galleryModel.countDocuments({
            visibility: "public",
        });

        return res.status(200).json({
            success: true,
            count: images.length,
            totalPages: Math.ceil(totalImages / limit),
            currentPage: page,
            data: images,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 3. User ki Khud ki Gallery Fetch Karne ki Logic (With Pagination)
export const getMyGallery = async (req, res) => {
    try {
        if (!req.userId) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Fetch all images belonging to the logged-in user
        const images = await galleryModel
            .find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalImages = await galleryModel.countDocuments({
            userId: req.userId,
        });

        return res.status(200).json({
            success: true,
            count: images.length,
            totalPages: Math.ceil(totalImages / limit),
            currentPage: page,
            data: images,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Combined feed — Pro ko public + apni private, Non-Pro ko sirf public
export const getFeed = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const user = await userModel.findById(req.userId).select("isPro");
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });

        let query;
        if (user.isPro) {
            // Pro — public sab + apni private
            query = {
                $or: [
                    { visibility: "public" },
                    { visibility: "private", userId: req.userId },
                ],
            };
        } else {
            // Non-Pro — sirf public
            query = { visibility: "public" };
        }

        const images = await galleryModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalImages = await galleryModel.countDocuments(query);

        return res.status(200).json({
            success: true,
            count: images.length,
            totalPages: Math.ceil(totalImages / limit),
            currentPage: page,
            data: images,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
