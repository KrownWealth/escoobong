"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ReuseableSVG from "./ReuseableSVG";

gsap.registerPlugin(ScrollTrigger);

interface JourneyCardData {
  index: string;
  title: string;
  image: string;
  label: string;
  description: string;
}

const journeyData: JourneyCardData[] = [
  {
    index: "01",
    title: "GOOGLE",
    image: "/sticky-cards/card_1.jpg",
    label: "(The breakthrough)",
    description:
      "A self-taught engineer with no CS degree, Google came calling anyway. The offer validated years of deliberate practice, late nights with LeetCode, and an unshakeable belief that merit speaks louder than credentials.",
  },
  {
    index: "02",
    title: "AMAZON",
    image: "/sticky-cards/card_2.jpg",
    label: "(The conviction)",
    description:
      "Amazon saw what the résumé couldn't show — a systems thinker who builds with scale in mind from day one. Another proof point that unconventional paths can lead to the most conventional of destinations.",
  },
  {
    index: "03",
    title: "AIRBNB",
    image: "/sticky-cards/card_3.jpg",
    label: "(Where I landed)",
    description:
      "Airbnb was the choice. Writing production code, shipping at scale, and learning how the best engineers in the world collaborate. LLMs have since changed how that code gets written — and I've written about it.",
  },
  {
    index: "04",
    title: "MORE",
    image: "/sticky-cards/card_4.jpg",
    label: "(The full picture)",
    description:
      "The offers kept coming. Each one a signal. No CS degree, no traditional path. Just the work, the reps, and a refusal to wait for permission.",
  },
];

export default function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const introTextRef = useRef<HTMLHeadingElement>(null);
  const bannerSectionRef = useRef<HTMLElement>(null);
  const headerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const introTextEl = introTextRef.current;
    const bannerSection = bannerSectionRef.current;
    const headers = headerRefs.current.filter(Boolean) as HTMLDivElement[];
    const container = containerRef.current;

    // ── Intro text clip reveal (same pattern as AboutMe) ──────
    if (introTextEl) {
      introTextEl.setAttribute("data-text", introTextEl.textContent?.trim() ?? "");

      ScrollTrigger.create({
        trigger: introTextEl,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        onUpdate: (self) => {
          const clipValue = Math.max(0, 100 - self.progress * 100);
          introTextEl.style.setProperty("--clip-value", `${clipValue}%`);
        },
      });
    }

    // ── Banner slide-in (same pattern as AboutMe) ─────────────
    if (bannerSection && headers.length === 3) {
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

      // ── Banner pin + spread + scale ──────────────────────────
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
            headers.forEach((h) => gsap.set(h, { scale }));
          }
        },
      });
    }

    // ── Sticky cards ──────────────────────────────────────────
    if (!container) return;

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>(".journey-card")
    );

    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cards[cards.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
      }

      if (index < cards.length - 1) {
        ScrollTrigger.create({
          trigger: cards[index + 1],
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(card, {
              scale: 1 - progress * 0.25,
              rotation: (index % 2 === 0 ? 5 : -5) * progress,
              "--after-opacity": progress,
            } as gsap.TweenVars);
          },
        });
      }
    });
  });

  return (
    <>
      {/* ── Intro text — clip reveal on scroll ── */}
      <section className="journey-intro">
        <h1 className="about-animate-text journey-intro-text" ref={introTextRef}>
          $500K/yr WITHOUT A CS DEGREE
        </h1>
      </section>

      {/* ── SVG banner — slides in, pins, spreads, scales ── */}
      <section className="journey-banners" ref={bannerSectionRef}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="journey-banner-row"
            ref={(el) => { headerRefs.current[i] = el; }}
          >
            <ReuseableSVG text="OFFERS" />
          </div>
        ))}
      </section>

      {/* ── Sticky journey cards — revealed after banner scales down ── */}
      <div className="journey-cards" style={{ marginTop: "155svh" }} ref={containerRef}>
        {journeyData.map((card, index) => (
          <div className="journey-card" key={index}>
            <div className="journey-card-index">
              <h1>{card.index}</h1>
            </div>

            <div className="journey-card-content">
              <div className="journey-card-content-wrapper">
                <h1 className="journey-card-header">{card.title}</h1>

                <div className="journey-card-img">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={800}
                    height={480}
                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  />
                </div>

                <div className="journey-card-copy">
                  <div className="journey-card-copy-title">
                    <p>{card.label}</p>
                  </div>
                  <div className="journey-card-copy-description">
                    <p>{card.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}