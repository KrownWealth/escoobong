import { AboutMe, Offers, HeroBanner, StudyPlan, Articles, Footer } from "@/components";
import ReactLenis from "lenis/react";


export default function Home() {
  return (
    <>
      <ReactLenis root />
      <HeroBanner />
      <AboutMe />
      <Offers />
      <StudyPlan />
      <Articles />
      <Footer />
    </>
  );
}
