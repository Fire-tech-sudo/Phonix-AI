import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
    Download,
    X,
    RefreshCcw,
    Image as ImageIcon,
    Loader2,
    Trash2,
} from "lucide-react";

// ── Progressive Image ──
const GalleryImage = ({ src, alt }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative w-full h-full overflow-hidden">
            <img
                src={src}
                alt=""
                aria-hidden="true"
                className={`absolute inset-0 w-full h-full object-cover blur-xl scale-110 transition-opacity duration-500 ${
                    loaded ? "opacity-0" : "opacity-100"
                }`}
            />
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                className={`relative w-full h-full object-cover transition-all duration-700 ${
                    loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
            />
        </div>
    );
};

// ── Confirm Delete Dialog ──
const ConfirmDialog = ({ onConfirm, onCancel, deleting }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--bg-card)] border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-xl"
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                    <Trash2 size={20} />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    Delete Image?
                </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
                Yeh image permanently delete ho jaayegi. Yeh action undo nahi ho
                sakta.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    disabled={deleting}
                    className="flex-1 py-2.5 rounded-full text-sm font-semibold border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--hover-bg)] transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={deleting}
                    className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {deleting ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Deleting...
                        </>
                    ) : (
                        <>
                            <Trash2 size={14} />
                            Delete
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    </motion.div>
);

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { backendUrl, token } = useContext(AppContext);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            if (token) {
                const { data } = await axios.get(
                    `${backendUrl}/api/image/gallery/feed`,
                    { headers: { token } },
                );
                if (data.success) setImages(data.data);
            } else {
                const { data } = await axios.get(
                    `${backendUrl}/api/image/gallery/public`,
                );
                if (data.success) setImages(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, [token]);

    // ── Blob Download ──
    const handleDownload = async (imageUrl, prompt) => {
        if (downloading) return;
        setDownloading(true);
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${prompt?.slice(0, 40).trim().replace(/\s+/g, "-") || "ai-image"}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
            toast.error("Failed to download image.");
        } finally {
            setDownloading(false);
        }
    };

    // ── Delete Image ──
    const handleDelete = async () => {
        if (!confirmDelete) return;
        setDeleting(true);
        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/image/${confirmDelete}`,
                { headers: { token } },
            );

            if (data.success) {
                toast.success("Image deleted successfully!");
                setImages((prev) =>
                    prev.filter((img) => img._id !== confirmDelete),
                );
                if (selectedImage?._id === confirmDelete) {
                    setSelectedImage(null);
                }
                setConfirmDelete(null);
            } else {
                toast.error(data.message || "Failed to delete image.");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error(
                error.response?.data?.message || "Something went wrong!",
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pb-28 min-h-screen text-[var(--text-primary)]">
            {/* ── HEADER ── */}
            <div className="flex items-center justify-between mb-8 sm:mb-12">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                        <ImageIcon size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
                            {token ? "My Gallery" : "Public Gallery"}
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                            {token
                                ? "Your AI generated masterpieces"
                                : "Community creations"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchGallery}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--hover-bg)] transition-colors"
                >
                    <RefreshCcw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    <span className="hidden sm:inline">Refresh</span>
                </button>
            </div>

            {/* ── GALLERY GRID ── */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                            key={i}
                            className="aspect-square rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] animate-pulse"
                        />
                    ))}
                </div>
            ) : images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[var(--border-color)] rounded-3xl bg-[var(--bg-card)]/50">
                    <span className="text-5xl mb-4">🎨</span>
                    <h3 className="text-xl font-bold mb-2">No Images Yet</h3>
                    <p className="text-[var(--text-secondary)] max-w-sm">
                        {token
                            ? "Head over to the Generate page to create your first AI masterpiece!"
                            : "Log in to view your personalized feed."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {images.map((img, i) => (
                        <motion.div
                            key={img._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -5 }}
                            className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-[var(--border-color)] shadow-sm hover:shadow-[0_10px_30px_var(--shadow-color)] transition-all bg-[var(--bg-card)]"
                        >
                            {/* Image — click to open modal */}
                            <div
                                onClick={() => setSelectedImage(img)}
                                className="w-full h-full"
                            >
                                <GalleryImage
                                    src={img.imageUrl}
                                    alt={img.prompt}
                                />
                            </div>

                            {/* Badge */}
                            <div className="absolute top-3 right-3 z-10 pointer-events-none">
                                <span
                                    className={`text-[10px] sm:text-xs px-3 py-1 rounded-full font-bold tracking-wide backdrop-blur-md border ${
                                        img.visibility === "private"
                                            ? "bg-[var(--bg-card)]/80 text-[var(--accent-primary)] border-[var(--accent-primary)]/50"
                                            : "bg-[var(--bg-card)]/80 text-[var(--text-secondary)] border-[var(--border-color)]"
                                    }`}
                                >
                                    {img.visibility === "private"
                                        ? "🔒 Private"
                                        : "🌐 Public"}
                                </span>
                            </div>

                            {/* 🔥 FIX 1: Delete button ab sirf Private images par dikhega */}
                            {token && img.visibility === "private" && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmDelete(img._id);
                                    }}
                                    className="absolute top-3 left-3 z-20 p-2 rounded-full bg-black/60 hover:bg-red-500 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 backdrop-blur-md"
                                    title="Delete image"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}

                            {/* Prompt overlay */}
                            <div
                                onClick={() => setSelectedImage(img)}
                                className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <p className="text-white text-xs sm:text-sm font-medium line-clamp-2">
                                    {img.prompt}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* ── IMAGE PREVIEW MODAL ── */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[var(--bg-card)] border border-[var(--accent-primary)]/50 p-1 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            <div className="relative rounded-2xl overflow-hidden bg-[var(--bg-secondary)]">
                                <div className="w-full max-h-[50vh] sm:max-h-[60vh] overflow-hidden">
                                    <GalleryImage
                                        src={selectedImage.imageUrl}
                                        alt="Preview"
                                    />
                                </div>
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md z-10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-5 sm:p-6">
                                <p className="text-sm sm:text-base text-[var(--text-primary)] mb-6 font-medium leading-relaxed">
                                    <span className="text-[var(--accent-primary)] font-bold">
                                        Prompt:{" "}
                                    </span>
                                    {selectedImage.prompt}
                                </p>

                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span
                                        className={`text-xs px-4 py-1.5 rounded-full font-bold border ${
                                            selectedImage.visibility ===
                                            "private"
                                                ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/30"
                                                : "bg-[var(--bg-input)] text-[var(--text-secondary)] border-[var(--border-color)]"
                                        }`}
                                    >
                                        {selectedImage.visibility === "private"
                                            ? "🔒 Private Generation"
                                            : "🌐 Public Generation"}
                                    </span>

                                    {token && (
                                        <div className="flex items-center gap-2">
                                            {/* 🔥 FIX 2: Modal ke andar wala delete button bhi sirf Private pe aayega */}
                                            {selectedImage.visibility ===
                                                "private" && (
                                                <button
                                                    onClick={() =>
                                                        setConfirmDelete(
                                                            selectedImage._id,
                                                        )
                                                    }
                                                    className="flex items-center gap-2 text-xs sm:text-sm border border-red-500/40 text-red-500 hover:bg-red-500/10 px-4 py-2.5 rounded-full font-bold transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                    <span className="hidden sm:inline">
                                                        Delete
                                                    </span>
                                                </button>
                                            )}

                                            {/* ── Download button ── */}
                                            <button
                                                onClick={() =>
                                                    handleDownload(
                                                        selectedImage.imageUrl,
                                                        selectedImage.prompt,
                                                    )
                                                }
                                                disabled={downloading}
                                                className="flex items-center gap-2 text-xs sm:text-sm bg-gradient-to-r from-[var(--btn-gradient-start)] to-[var(--btn-gradient-end)] text-white px-5 py-2.5 rounded-full font-bold shadow-[0_4px_15px_var(--btn-glow)] hover:scale-105 transition-transform disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                                            >
                                                {downloading ? (
                                                    <>
                                                        <Loader2
                                                            size={14}
                                                            className="animate-spin"
                                                        />
                                                        Downloading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download size={14} />
                                                        Download
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── CONFIRM DELETE DIALOG ── */}
            <AnimatePresence>
                {confirmDelete && (
                    <ConfirmDialog
                        onConfirm={handleDelete}
                        onCancel={() => !deleting && setConfirmDelete(null)}
                        deleting={deleting}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
