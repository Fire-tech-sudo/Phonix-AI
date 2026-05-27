import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GallerySidebar = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [myImages, setMyImages] = useState([]);
	const [galleryLoading, setGalleryLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);

	const { backendUrl, token } = useContext(AppContext);
	const navigate = useNavigate();

	const fetchMyGallery = async () => {
		setGalleryLoading(true);
		try {
			if (token) {
				const { data } = await axios.get(
					`${backendUrl}/api/image/gallery/feed`,
					{ headers: { token } },
				);
				if (data.success) setMyImages(data.data);
			} else {
				const { data } = await axios.get(
					`${backendUrl}/api/image/gallery/public`,
				);
				if (data.success) setMyImages(data.data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setGalleryLoading(false);
		}
	};

	useEffect(() => {
		fetchMyGallery();
	}, [token]);

	return (
		<>
			{/* Theme-Ready Dynamic Sidebar */}
			<motion.div
				animate={{ width: collapsed ? 56 : 240 }}
				transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
				style={{
					position: "fixed",
					left: 0,
					top: 0,
					height: "100vh",
					zIndex: 60, // 🔥 FIX: 40 se 60 kar diya taaki Navbar ke Theme Changer ke upar rahe
					display: "flex",
					flexDirection: "column",
					background: "var(--bg-secondary)", // Dynamic background
					borderRight: "1px solid var(--border-color)",
					boxShadow: "4px 0 24px var(--shadow-color)",
					overflow: "hidden",
					transition:
						"background-color 0.5s ease, border-color 0.5s ease",
				}}
			>
				{/* Header */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						padding: "20px 14px",
						borderBottom: "1px solid var(--border-color)",
						minHeight: 64,
						flexShrink: 0,
						position: "relative",
					}}
				>
					<AnimatePresence>
						{!collapsed && (
							<motion.div
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								transition={{ duration: 0.2 }}
								style={{
									display: "flex",
									alignItems: "center",
									gap: 8,
									position: "absolute",
									left: 14,
								}}
							>
								<span style={{ fontSize: 16 }}>🖼️</span>
								<span
									style={{
										fontSize: 13,
										fontWeight: 600,
										color: "var(--text-primary)", // Dynamic Text
										letterSpacing: "0.04em",
										whiteSpace: "nowrap",
										fontFamily: "'DM Sans', sans-serif",
									}}
								>
									My Gallery
								</span>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Toggle Button */}
					<button
						onClick={() => setCollapsed(!collapsed)}
						style={{
							width: 28,
							height: 28,
							borderRadius: "50%",
							border: "1px solid var(--border-color)",
							background: "var(--bg-card)",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
							transition: "all 0.3s ease",
							marginLeft: collapsed ? 0 : "auto",
						}}
						title={
							collapsed ? "Expand gallery" : "Collapse gallery"
						}
					>
						<motion.span
							animate={{ rotate: collapsed ? 180 : 0 }}
							transition={{ duration: 0.3 }}
							style={{
								fontSize: 12,
								color: "var(--text-secondary)",
								lineHeight: 1,
								position: "relative",
								left: collapsed ? "2px" : "-2px",
							}}
						>
							◀
						</motion.span>
					</button>
				</div>

				{/* Collapsed: Icon Strip */}
				{collapsed && (
					<div
						style={{
							flex: 1,
							overflowY: "auto",
							padding: "12px 6px",
							display: "flex",
							flexDirection: "column",
							gap: 6,
							alignItems: "center",
						}}
					>
						{galleryLoading ? (
							[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									style={{
										width: 40,
										height: 40,
										borderRadius: 10,
										background: "var(--border-color)", // Theme loader
										flexShrink: 0,
										animation: "pulse 1.5s infinite",
									}}
								/>
							))
						) : myImages.length === 0 ? (
							<span style={{ fontSize: 20, marginTop: 16 }}>
								📭
							</span>
						) : (
							myImages.slice(0, 10).map((img) => (
								<motion.div
									key={img._id}
									whileHover={{ scale: 1.08 }}
									onClick={() => setSelectedImage(img)}
									style={{
										width: 40,
										height: 40,
										borderRadius: 10,
										overflow: "hidden",
										cursor: "pointer",
										flexShrink: 0,
										border: "2px solid var(--border-color)", // Dynamic border
										boxShadow:
											"0 2px 8px var(--shadow-color)",
									}}
									title={img.prompt}
								>
									<img
										src={img.imageUrl}
										alt=""
										style={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
										}}
									/>
								</motion.div>
							))
						)}
					</div>
				)}

				{/* Expanded: Full Gallery */}
				{!collapsed && (
					<div
						style={{
							flex: 1,
							overflowY: "auto",
							padding: "12px 10px",
							display: "flex",
							flexDirection: "column",
							gap: 8,
						}}
					>
						{/* Refresh */}
						<button
							onClick={fetchMyGallery}
							style={{
								fontSize: 11,
								color: "var(--accent-primary)", // Theme Refresh Button
								background: "none",
								border: "none",
								cursor: "pointer",
								textAlign: "right",
								padding: "0 4px 4px",
								letterSpacing: "0.03em",
								fontWeight: "bold",
							}}
						>
							↻ Refresh
						</button>

						{galleryLoading ? (
							[1, 2, 3].map((i) => (
								<div
									key={i}
									style={{
										width: "100%",
										height: 130,
										borderRadius: 14,
										background: "var(--border-color)",
										animation: "pulse 1.5s infinite",
									}}
								/>
							))
						) : myImages.length === 0 ? (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									flex: 1,
									gap: 8,
									padding: "40px 12px",
									textAlign: "center",
								}}
							>
								<span style={{ fontSize: 32 }}>🎨</span>
								<p
									style={{
										fontSize: 12,
										color: "var(--text-secondary)",
										lineHeight: 1.6,
										margin: 0,
									}}
								>
									Generate your first image — it'll appear
									here
								</p>
							</div>
						) : (
							myImages.map((img, i) => (
								<motion.div
									key={img._id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.05 }}
									whileHover={{ scale: 1.02 }}
									onClick={() => setSelectedImage(img)}
									style={{
										position: "relative",
										borderRadius: 14,
										overflow: "hidden",
										cursor: "pointer",
										border: "1px solid var(--border-color)",
										boxShadow:
											"0 2px 12px var(--shadow-color)",
										flexShrink: 0,
									}}
								>
									<img
										src={img.imageUrl}
										alt=""
										style={{
											width: "100%",
											height: 130,
											objectFit: "cover",
											display: "block",
										}}
									/>

									{/* Visibility badge */}
									<span
										style={{
											position: "absolute",
											top: 7,
											right: 7,
											fontSize: 9,
											padding: "3px 8px",
											borderRadius: 20,
											fontWeight: 700,
											letterSpacing: "0.04em",
											background: "var(--bg-card)",
											color:
												img.visibility === "private"
													? "var(--accent-primary)"
													: "var(--text-secondary)",
											border: `1px solid ${img.visibility === "private" ? "var(--accent-primary)" : "var(--border-color)"}`,
											backdropFilter: "blur(4px)",
										}}
									>
										{img.visibility === "private"
											? "🔒 Private"
											: "🌐 Public"}
									</span>

									{/* Prompt overlay */}
									<div
										style={{
											position: "absolute",
											bottom: 0,
											left: 0,
											right: 0,
											background:
												"linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
											padding: "25px 10px 10px",
										}}
									>
										<p
											style={{
												margin: 0,
												fontSize: 10,
												color: "#fff",
												lineHeight: 1.4,
												display: "-webkit-box",
												WebkitLineClamp: 2,
												WebkitBoxOrient: "vertical",
												overflow: "hidden",
											}}
										>
											{img.prompt}
										</p>
									</div>
								</motion.div>
							))
						)}
					</div>
				)}
			</motion.div>

			{/* Image Preview Modal (Theme Integrated) */}
			<AnimatePresence>
				{selectedImage && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setSelectedImage(null)}
						style={{
							position: "fixed",
							inset: 0,
							zIndex: 100, // Ye 100 hai toh Modal sabse top par rahega
							background: "rgba(0,0,0,0.65)",
							backdropFilter: "blur(8px)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							padding: 16,
						}}
					>
						<motion.div
							initial={{ scale: 0.92, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.92, opacity: 0 }}
							transition={{ duration: 0.25 }}
							onClick={(e) => e.stopPropagation()}
							style={{
								background: "var(--bg-card)", // Dynamic Modal Bg
								borderRadius: 20,
								overflow: "hidden",
								maxWidth: 480,
								width: "100%",
								boxShadow: "0 25px 60px var(--shadow-color)",
								border: "1px solid var(--accent-primary)", // Premium active border
							}}
						>
							<img
								src={selectedImage.imageUrl}
								alt=""
								style={{
									width: "100%",
									maxHeight: 360,
									objectFit: "cover",
									display: "block",
								}}
							/>

							<div style={{ padding: "18px 20px" }}>
								<p
									style={{
										fontSize: 14,
										color: "var(--text-primary)",
										lineHeight: 1.6,
										margin: "0 0 16px",
									}}
								>
									{selectedImage.prompt}
								</p>

								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<span
										style={{
											fontSize: 11,
											padding: "5px 12px",
											borderRadius: 20,
											background: "var(--bg-input)",
											color:
												selectedImage.visibility ===
												"private"
													? "var(--accent-primary)"
													: "var(--text-secondary)",
											border: `1px solid ${selectedImage.visibility === "private" ? "var(--accent-primary)" : "var(--border-color)"}`,
											fontWeight: 600,
										}}
									>
										{selectedImage.visibility === "private"
											? "🔒 Private"
											: "🌐 Public"}
									</span>

									<div style={{ display: "flex", gap: 10 }}>
										{token && (
											<a
												href={selectedImage.imageUrl}
												download
												style={{
													fontSize: 12,
													background:
														"linear-gradient(to right, var(--btn-gradient-start), var(--btn-gradient-end))",
													color: "var(--bg-primary)",
													padding: "8px 18px",
													borderRadius: 20,
													textDecoration: "none",
													fontWeight: 700,
													boxShadow:
														"0 4px 10px var(--btn-glow)",
													display: "inline-block",
												}}
											>
												Download
											</a>
										)}
										<button
											onClick={() =>
												setSelectedImage(null)
											}
											style={{
												fontSize: 12,
												border: "1px solid var(--border-color)",
												background:
													"var(--bg-secondary)",
												color: "var(--text-primary)",
												padding: "8px 18px",
												borderRadius: 20,
												cursor: "pointer",
												fontWeight: 600,
											}}
										>
											Close
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<style>{`
				@keyframes pulse {
					0%, 100% { opacity: 1; }
					50% { opacity: 0.4; }
				}
			`}</style>
		</>
	);
};

export default GallerySidebar;
