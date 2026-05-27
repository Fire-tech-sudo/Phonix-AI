import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";

const Result = () => {
    const [image, setImage] = useState(assets.sample_img_1);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");

    const { generateImage } = useContext(AppContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (input) {
            const resultImage = await generateImage(input);
            if (resultImage) {
                setIsImageLoaded(true);
                setImage(resultImage);
            }
        }

        setLoading(false);
    };

    return (
        <>
            <motion.form
                onSubmit={onSubmitHandler}
                initial={{ opacity: 0.2, y: 100 }}
                transition={{ duration: 1 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                // 🔥 FIX 1: Mobile padding (pb-28) to prevent Bottom Navbar overlap
                className="flex flex-col min-h-[85vh] justify-center items-center transition-colors duration-500 pb-28 md:pb-10 pt-4 sm:pt-0"
            >
                <div className="w-full flex justify-center px-4 sm:px-0">
                    {/* Image Box with Theme Glow & Border */}
                    <div
                        // 🔥 FIX 2: Responsive image container size
                        className="relative rounded-2xl overflow-hidden border transition-all duration-500 w-full max-w-[280px] sm:max-w-sm md:max-w-md aspect-square"
                        style={{
                            borderColor: "var(--border-color)",
                            boxShadow: "0 10px 40px var(--shadow-color)",
                        }}
                    >
                        <img
                            src={image}
                            alt="Generated UI"
                            // max-w-sm se full width (w-full) taaki div ke hisaab se scale ho
                            className="w-full h-full object-cover"
                        />

                        {/* Dynamic Loading Bar */}
                        <span
                            className={`absolute bottom-0 left-0 h-1.5 transition-all duration-[10s] ease-out`}
                            style={{
                                width: loading ? "100%" : "0%",
                                backgroundColor: "var(--accent-primary)",
                                boxShadow: "0 0 15px var(--btn-glow)",
                            }}
                        />
                    </div>
                </div>

                {/* Pulsing Loading Text */}
                <p
                    className={`mt-4 sm:mt-6 text-center tracking-widest text-xs sm:text-sm uppercase font-semibold animate-pulse transition-colors duration-500 ${!loading ? "hidden" : ""}`}
                    style={{ color: "var(--accent-primary)" }}
                >
                    Rendering Synthesis...
                </p>

                {!isImageLoaded && (
                    // 🔥 FIX 3: Fixed Input Field Squishing Issue
                    <div
                        className="flex w-[90%] sm:w-full max-w-xl text-sm p-1 sm:p-1.5 mt-8 sm:mt-10 rounded-full border transition-colors duration-500 focus-within:ring-2"
                        style={{
                            backgroundColor: "var(--bg-input)",
                            borderColor: "var(--border-color)",
                            boxShadow: "0 15px 35px var(--shadow-color)",
                            "--tw-ring-color": "var(--accent-primary)",
                        }}
                    >
                        <input
                            type="text"
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            // max-sm:w-20 hata diya aur flex-1 rakha taaki wo saari bachi hui jagah le
                            className="flex-1 bg-transparent outline-none ml-4 sm:ml-6 px-2 transition-colors duration-500 text-xs sm:text-sm min-w-0"
                            style={{ color: "var(--text-primary)" }}
                            placeholder="Describe what you want to generate..."
                        />
                        <button
                            type="submit"
                            // Mobile par padding aur text chota kiya
                            className="cursor-pointer px-5 sm:px-16 py-2.5 sm:py-3.5 text-xs sm:text-base rounded-full font-bold tracking-wide hover:scale-105 transition-all duration-300 flex-shrink-0"
                            style={{
                                background:
                                    "linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))",
                                color: "var(--bg-primary)",
                                boxShadow: "0 4px 15px var(--btn-glow)",
                            }}
                        >
                            Generate
                        </button>
                    </div>
                )}

                {isImageLoaded && (
                    // 🔥 FIX 4: Mobile optimized Action Buttons
                    <div className="flex gap-3 sm:gap-4 flex-wrap justify-center mt-8 sm:mt-10 px-4">
                        <button
                            onClick={() => {
                                setIsImageLoaded(false);
                                setInput("");
                            }}
                            className="px-6 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-sm rounded-full cursor-pointer font-bold border hover:scale-105 transition-all duration-300"
                            style={{
                                borderColor: "var(--accent-primary)",
                                color: "var(--text-primary)",
                                backgroundColor: "var(--bg-secondary)",
                                boxShadow: "0 5px 15px var(--shadow-color)",
                            }}
                        >
                            Generate Another
                        </button>
                        <a
                            href={image}
                            download
                            className="px-6 sm:px-10 py-2.5 sm:py-3.5 text-xs sm:text-sm rounded-full cursor-pointer font-bold tracking-wide hover:scale-105 transition-all duration-300 inline-block text-center"
                            style={{
                                background:
                                    "linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))",
                                color: "var(--bg-primary)",
                                boxShadow: "0 4px 15px var(--btn-glow)",
                            }}
                        >
                            Download Image
                        </a>
                    </div>
                )}
            </motion.form>
        </>
    );
};

export default Result;
