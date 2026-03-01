"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutMeSvg from "./AboutMeSvg";
import AnimatedCopy from "./AnimatedText";

gsap.registerPlugin(ScrollTrigger);

export default function AboutMe() {
  const bannerSectionRef = useRef<HTMLElement>(null);
  const serviceCopyRef = useRef<HTMLHeadingElement>(null);
  const headerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const bannerSection = bannerSectionRef.current;
    const serviceCopyEl = serviceCopyRef.current;
    const headers = headerRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!bannerSection || !serviceCopyEl || headers.length !== 3) return;

    // ── Services copy text reveal ──────────────────────────────
    serviceCopyEl.setAttribute("data-text", serviceCopyEl.textContent?.trim() ?? "");

    ScrollTrigger.create({
      trigger: serviceCopyEl,
      start: "top bottom",
      end: "center center",
      scrub: 1,
      onUpdate: (self) => {
        const clipValue = Math.max(0, 100 - self.progress * 100);
        serviceCopyEl.style.setProperty("--clip-value", `${clipValue}%`);
      },
    });

    // ── Banner slide-in ────────────────────────────────────────
    gsap.set(headers[0], { x: "100%" });
    gsap.set(headers[1], { x: "-100%" });
    gsap.set(headers[2], { x: "100%" });

    ScrollTrigger.create({
      trigger: bannerSection,
      start: "top bottom",
      end: "top top",
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(headers[0], { x: `${100 - self.progress * 100}%` });
        gsap.set(headers[1], { x: `${-100 + self.progress * 100}%` });
        gsap.set(headers[2], { x: `${100 - self.progress * 100}%` });
      },
    });

    // ── Banner pin + spread + scale ────────────────────────────
    // Phase 1 (0–50%): rows 0 and 2 spread apart vertically
    // Phase 2 (50–100%): all rows scale down together → banner becomes small
    // After pin ends, services copy is revealed below
    ScrollTrigger.create({
      trigger: bannerSection,
      start: "top top",
      end: `+=${window.innerHeight * 2}`,
      pin: true,
      scrub: 1,
      pinSpacing: false,
      onUpdate: (self) => {
        if (self.progress <= 0.5) {
          const yProgress = self.progress / 0.5;
          gsap.set(headers[0], { y: `${yProgress * 100}%` });
          gsap.set(headers[2], { y: `${yProgress * -100}%` });
        } else {
          gsap.set(headers[0], { y: "100%" });
          gsap.set(headers[2], { y: "-100%" });

          const scaleProgress = (self.progress - 0.5) / 0.5;
          const minScale = window.innerWidth <= 1000 ? 0.25 : 0.15;
          const scale = 1 - scaleProgress * (1 - minScale);

          headers.forEach((header) => gsap.set(header, { scale }));
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      {/* ── SVG banners — pinned, spreads then scales to small ── */}
      <section className="about-banners" ref={bannerSectionRef}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="about-banner-row"
            ref={(el) => { headerRefs.current[i] = el; }}
          >
            <AboutMeSvg />
          </div>
        ))}
      </section>

      {/* ── Services copy — sits below, revealed after banner scales down ── */}
      <section className="services-copy-section">
        <h1 className="about-animate-text" ref={serviceCopyRef}>
          Esco Obong; is a Senior Software Engineer at <span className="text-[#FF5A5F]">Airbnb,</span> (ex-Uber, NYTimes), and Founder of Algorythm.
        </h1>
      </section>

      <section className="services">
        <div className="service">
          <div className="col">
            <div className="service-copy">
              <AnimatedCopy>
                <p>

                  Every breakthrough begins with detail. From the first sketch
                  to full-scale production, our engineering process is built on
                  accuracy, consistency, and performance. What you see isn’t
                  just a machine—it’s the sum of thousands of deliberate
                  calculations designed to set new standards in motion.
                </p>
              </AnimatedCopy>
            </div>
          </div>
          <div className="col">
            <img src="/img_2.jpg" alt="" />
          </div>
        </div>
      </section>
    </>
  );
}