import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Description = () => {
    return (
        <motion.div
            className="flex flex-col items-center justify-center my-24 p-6 md:px-28 transition-colors duration-500"
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <h1
                className="text-3xl sm:text-4xl font-semibold mb-2 transition-colors duration-500"
                style={{ color: "var(--text-primary)" }}
            >
                Create AI Images
            </h1>
            <p
                className="mb-8 transition-colors duration-500"
                style={{ color: "var(--text-secondary)" }}
            >
                Turn your imagination into visuals
            </p>

            <div className="flex flex-col gap-5 md:gap-14 md:flex-row items-center mt-4">
                {/* Image with Dynamic Shadow & Hover Effect */}
                <motion.img
                    whileHover={{ scale: 1.03 }}
                    src={assets.sample_img_1}
                    alt="AI Sample"
                    className="w-80 xl:w-96 rounded-2xl border transition-all duration-500"
                    style={{
                        borderColor: "var(--border-color)",
                        boxShadow: "0 15px 40px var(--shadow-color)",
                    }}
                />
                <div>
                    <h2
                        className="text-3xl font-bold max-w-lg mb-4 transition-colors duration-500"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Introducing the AI-Powered Text To Image Generator
                    </h2>
                    <p
                        className="mb-4 leading-relaxed transition-colors duration-500"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Easily bring your ideas to life with our free AI image
                        generator. Whether you need stunning visuals or unique
                        imagery, our tool transforms your text into eye-catching
                        images with just a few clicks. Imagine it, describe it,
                        and watch it come to life instantly.
                    </p>
                    <p
                        className="leading-relaxed transition-colors duration-500"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Simply type in a text prompt, and our cutting-edge AI
                        will generate high-quality images in seconds. From
                        product visuals to character designs and portraits, even
                        concepts that don't yet exist can be visualized
                        effortlessly. Powered by advanced AI technology, the
                        creative possibilities are limitless!
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Description;
