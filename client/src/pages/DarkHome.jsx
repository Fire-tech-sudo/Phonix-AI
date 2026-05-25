import React from "react";
// import Header from "../components/Header";
import DarkHeader from "../components/DarkHeader";
// import Steps from "../components/Steps";
import DarkSteps from "../components/DarkSteps";
// import Description from "../components/Description";
import Darkescription from "../components/DarkDescription";
// import Testimonials from "../components/Testimonials";
import DarkTestimonials from "../components/DarkTestimonials";
// import GenerateBtn from "../components/GenerateBtn";
import DarkGenerateBtn from "../components/DarkGenerateBtn";
// import GallerySidebar from "../components/GallerySidebar";
import DarkGallerySidebar from "../components/DarkGallerySidebar";

const Home = () => {
	return (
		<div>
			<DarkGallerySidebar />
			<DarkHeader />
			<DarkSteps />
			<Darkescription />
			<DarkTestimonials />
			<DarkGenerateBtn />
		</div>
	);
};

export default Home;
