import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import GallerySidebar from "../components/GallerySidebar";

const Result = () => {
    const [image, setImage] = useState(assets.sample_img_1);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");

    // ✅ Correct way to pull generateImage
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
            <GallerySidebar />
            <motion.form
                onSubmit={onSubmitHandler}
                initial={{ opacity: 0.2, y: 100 }}
                transition={{ duration: 1 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col min-h-[90vh] justify-center items-center transition-colors duration-500"
            >
                <div>
                    {/* Image Box with Theme Glow & Border */}
                    <div 
                        className="relative rounded-2xl overflow-hidden border transition-all duration-500"
                        style={{
                            borderColor: 'var(--border-color)',
                            boxShadow: '0 10px 40px var(--shadow-color)'
                        }}
                    >
                        <img src={image} alt="Generated UI" className="max-w-sm rounded-2xl" />
                        
                        {/* Dynamic Loading Bar */}
                        <span
                            className={`absolute bottom-0 left-0 h-1.5 transition-all duration-[10s] ease-out`}
                            style={{
                                width: loading ? "100%" : "0%",
                                backgroundColor: "var(--accent-primary)",
                                boxShadow: "0 0 15px var(--btn-glow)"
                            }}
                        />
                    </div>
                    
                    {/* Pulsing Loading Text */}
                    <p 
                        className={`mt-4 text-center tracking-widest text-sm uppercase font-semibold animate-pulse transition-colors duration-500 ${!loading ? "hidden" : ""}`}
                        style={{ color: "var(--accent-primary)" }}
                    >
                        Rendering Synthesis...
                    </p>
                </div>

                {!isImageLoaded && (
                    <div 
                        className="flex w-full max-w-xl text-sm p-1.5 mt-10 rounded-full border transition-colors duration-500 focus-within:ring-2"
                        style={{
                            backgroundColor: "var(--bg-input)",
                            borderColor: "var(--border-color)",
                            boxShadow: "0 15px 35px var(--shadow-color)",
                            "--tw-ring-color": "var(--accent-primary)"
                        }}
                    >
                        <input
                            type="text"
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            className="flex-1 bg-transparent outline-none ml-6 max-sm:w-20 transition-colors duration-500"
                            style={{ color: "var(--text-primary)" }}
                            placeholder="Describe what you want to generate..."
                        />
                        <button
                            type="submit"
                            className="cursor-pointer px-10 sm:px-16 py-3.5 rounded-full font-bold tracking-wide hover:scale-105 transition-all duration-300"
                            style={{
                                background: "linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))",
                                color: "var(--bg-primary)",
                                boxShadow: "0 4px 15px var(--btn-glow)"
                            }}
                        >
                            Generate
                        </button>
                    </div>
                )}

                {isImageLoaded && (
                    <div className="flex gap-4 flex-wrap justify-center text-sm mt-10">
                        <p
                            onClick={() => {
                                setIsImageLoaded(false);
                                setInput("");
                            }}
                            className="px-8 py-3.5 rounded-full cursor-pointer font-bold border hover:scale-105 transition-all duration-300"
                            style={{
                                borderColor: "var(--accent-primary)",
                                color: "var(--text-primary)",
                                backgroundColor: "var(--bg-secondary)",
                                boxShadow: "0 5px 15px var(--shadow-color)"
                            }}
                        >
                            Generate Another
                        </p>
                        <a
                            href={image}
                            download
                            className="px-10 py-3.5 rounded-full cursor-pointer font-bold tracking-wide hover:scale-105 transition-all duration-300"
                            style={{
                                background: "linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))",
                                color: "var(--bg-primary)",
                                boxShadow: "0 4px 15px var(--btn-glow)"
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
