import React from "react";
import { stepsData } from "../assets/assets";
import { motion } from "framer-motion";
import { Sparkles, Cpu, Share2 } from "lucide-react";

const Steps = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center my-32"
        >
            <h1
                className="text-3xl sm:text-4xl font-bold mb-2 transition-colors duration-500"
                style={{ color: "var(--text-primary)" }}
            >
                How it works
            </h1>
            <p
                className="mb-12 transition-colors duration-500"
                style={{ color: "var(--text-secondary)" }}
            >
                Transform words into stunning images in 3 simple steps
            </p>

            <div className="space-y-4 w-full max-w-3xl px-4">
                {stepsData.map((item, index) => {
                    // 🔥 Dynamic Lucide Icon Component Extract Kiya
                    const IconComponent = item.icon;

                    return (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.02, x: 10 }}
                            className="flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300"
                            style={{
                                backgroundColor: "var(--bg-card)",
                                borderColor: "var(--border-color)",
                                boxShadow: "0 10px 25px var(--shadow-color)",
                            }}
                        >
                            {/* Icon Container with Theme Glow */}
                            <div
                                className="p-3.5 rounded-xl border flex items-center justify-center transition-all duration-500"
                                style={{
                                    backgroundColor: "var(--bg-secondary)",
                                    borderColor: "var(--border-color)",
                                    boxShadow: "0 0 15px var(--btn-glow)",
                                }}
                            >
                                {/* 🔥 Lucide Icon with exact customizable props */}
                                <IconComponent
                                    size={24}
                                    strokeWidth={2}
                                    style={{ color: "var(--accent-primary)" }}
                                    className="transition-colors duration-500"
                                />
                            </div>

                            <div>
                                <h2
                                    className="text-xl font-bold transition-colors duration-500"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    {item.title}
                                </h2>
                                <p
                                    className="text-sm transition-colors duration-500 mt-1"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default Steps;
