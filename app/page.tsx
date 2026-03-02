import { AboutMe, Offers, HeroBanner, StudyPlan } from "@/components";
import ReactLenis from "lenis/react";


export default function Home() {
  return (
    <>
      <ReactLenis root />

      <HeroBanner />
      <AboutMe />

      <Offers />
      <StudyPlan />
    </>
  );
}
