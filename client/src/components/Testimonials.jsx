import React from "react";
import { assets, testimonialsData } from "../assets/assets";
import { motion } from "framer-motion";

const Testimonials = () => {
    return (
        <motion.div
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center my-20 p-6 md:px-28 py-12 transition-colors duration-500"
        >
            <h1
                className="text-3xl sm:text-4xl font-semibold mb-2 transition-colors duration-500"
                style={{ color: "var(--text-primary)" }}
            >
                Customer Testimonials
            </h1>
            <p
                className="mb-8 transition-colors duration-500"
                style={{ color: "var(--text-secondary)" }}
            >
                What Our Users Are Saying
            </p>

            <div className="flex flex-wrap gap-6 justify-center">
                {testimonialsData.map((testimonial, index) => (
                    <div
                        key={index}
                        className="p-10 rounded-2xl border cursor-pointer hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 w-72"
                        style={{
                            backgroundColor: "var(--bg-card)",
                            borderColor: "var(--border-color)",
                            boxShadow: "0 10px 30px var(--shadow-color)",
                        }}
                    >
                        <div className="flex flex-col items-center justify-around">
                            {/* Profile Image with subtle theme border */}
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="rounded-full w-14 border-2 transition-colors duration-500"
                                style={{ borderColor: "var(--accent-primary)" }}
                            />

                            <h2
                                className="text-xl font-bold mt-4 transition-colors duration-500"
                                style={{ color: "var(--text-primary)" }}
                            >
                                {testimonial.name}
                            </h2>
                            <p
                                className="text-sm mb-4 font-medium transition-colors duration-500"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                {testimonial.role}
                            </p>

                            {/* Stars Container */}
                            <div className="flex mb-4 gap-1">
                                {Array(testimonial.stars)
                                    .fill()
                                    .map((item, i) => (
                                        <img
                                            src={assets.rating_star}
                                            key={i}
                                            alt="Star"
                                            className="w-4 h-4 transition-all duration-500"
                                            // filter is used so that if your rating star is dark/light, it adapts. Optional but good for premium feel.
                                            style={{
                                                filter: "drop-shadow(0 0 3px var(--accent-highlight))",
                                            }}
                                        />
                                    ))}
                            </div>

                            <p
                                className="text-center text-sm leading-relaxed transition-colors duration-500"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                "{testimonial.text}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Testimonials;
