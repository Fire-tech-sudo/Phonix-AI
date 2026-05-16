import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    imageUrl: { type: String, required: true },
    prompt: { type: String },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    createdAt: { type: Date, default: Date.now }
});

const galleryModel = mongoose.models.gallery || mongoose.model('gallery', gallerySchema);

export default galleryModel;