"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger);

export default function HeroBanner() {
  // ── Hero refs ──────────────────────────────────────────────
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  // ── Menu refs ──────────────────────────────────────────────
  const heroRef = useRef<HTMLDivElement>(null); // pushed by menu open
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuOverlayContentRef = useRef<HTMLDivElement>(null);
  const menuMediaWrapperRef = useRef<HTMLDivElement>(null);
  const menuToggleLabelRef = useRef<HTMLParagraphElement>(null);
  const hamburgerIconRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const isMenuOpenRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const splitTextByContainerRef = useRef<SplitText[][]>([]);
  const copyContainersRef = useRef<HTMLElement[]>([]);

  // ── Menu toggle ────────────────────────────────────────────
  const handleMenuToggle = useCallback(() => {
    if (isAnimatingRef.current) return;

    const hero = heroRef.current;
    const menuOverlay = menuOverlayRef.current;
    const menuOverlayContent = menuOverlayContentRef.current;
    const menuMediaWrapper = menuMediaWrapperRef.current;
    const menuToggleLabel = menuToggleLabelRef.current;
    const hamburgerIcon = hamburgerIconRef.current;
    const copyContainers = copyContainersRef.current;

    if (!hero || !menuOverlay || !menuOverlayContent || !menuMediaWrapper || !menuToggleLabel || !hamburgerIcon) return;

    if (!isMenuOpenRef.current) {
      // OPEN
      isAnimatingRef.current = true;
      lenisRef.current?.stop();

      const tl = gsap.timeline();

      tl.to(menuToggleLabel, { y: "-110%", duration: 1, ease: "hop" }, "<")
        .to(hero, { y: "100svh", duration: 1, ease: "hop" }, "<")
        .to(menuOverlay, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1, ease: "hop" }, "<")
        .to(menuOverlayContent, { yPercent: 0, duration: 1, ease: "hop" }, "<")
        .to(menuMediaWrapper, { opacity: 1, duration: 0.75, ease: "power2.out", delay: 0.5 }, "<");

      splitTextByContainerRef.current.forEach((containerSplits) => {
        const lines = containerSplits.flatMap((s) => s.lines);
        tl.to(lines, { y: "0%", duration: 2, ease: "hop", stagger: -0.075 }, -0.15);
      });

      hamburgerIcon.classList.add("active");
      tl.call(() => { isAnimatingRef.current = false; });
      isMenuOpenRef.current = true;

    } else {
      // CLOSE
      isAnimatingRef.current = true;
      hamburgerIcon.classList.remove("active");

      const tl = gsap.timeline();

      tl.to(hero, { y: "0svh", duration: 1, ease: "hop" })
        .to(menuOverlay, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", duration: 1, ease: "hop" }, "<")
        .to(menuOverlayContent, { yPercent: -50, duration: 1, ease: "hop" }, "<")
        .to(menuToggleLabel, { y: "0%", duration: 1, ease: "hop" }, "<")
        .to(copyContainers, { opacity: 0.25, duration: 1, ease: "hop" }, "<");

      tl.call(() => {
        splitTextByContainerRef.current.forEach((containerSplits) => {
          gsap.set(containerSplits.flatMap((s) => s.lines), { y: "-110%" });
        });
        gsap.set(copyContainers, { opacity: 1 });
        gsap.set(menuMediaWrapper, { opacity: 0 });
        isAnimatingRef.current = false;
        lenisRef.current?.start();
      });

      isMenuOpenRef.current = false;
    }
  }, []);

  // ── Effects ────────────────────────────────────────────────
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // Lenis + ScrollTrigger integration
    CustomEase.create("hop", ".87,0,.13,1");
    const lenis = new Lenis();
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time: number) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // SplitText
    const textContainers = document.querySelectorAll<HTMLElement>(".menu-col");
    copyContainersRef.current = Array.from(textContainers);

    const splitResults: SplitText[][] = [];
    textContainers.forEach((col) => {
      const splits: SplitText[] = [];
      col.querySelectorAll<HTMLElement>("a, p").forEach((el) => {
        const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "line" });
        splits.push(split);
        gsap.set(split.lines, { y: "-110%" });
      });
      splitResults.push(splits);
    });
    splitTextByContainerRef.current = splitResults;

    // Hero reveal
    const customEase = CustomEase.create("custom", ".87,0,.13,1");
    const counter = counterRef.current;

    gsap.set(".video-container", { scale: 0, rotation: -20 });
    gsap.set(".menu-nav", { opacity: 0, pointerEvents: "none" });
    gsap.set(".logo", { opacity: 0 });

    gsap.to(".hero", { clipPath: "polygon(0% 45%, 25% 45%, 25% 55%, 0% 55%)", duration: 1.5, ease: customEase, delay: 1 });

    gsap.to(".hero", {
      clipPath: "polygon(0% 45%, 100% 45%, 100% 55%, 0% 55%)",
      duration: 2,
      ease: customEase,
      delay: 3,
      onStart: () => {
        gsap.to(".progress-bar", { width: "100vw", duration: 2, ease: customEase });
        if (counter) {
          gsap.to(counter, { innerHTML: 100, duration: 2, ease: customEase, snap: { innerHTML: 1 } });
        }
      },
    });

    gsap.to(".hero", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: customEase,
      delay: 5,
      onStart: () => {
        gsap.to(".video-container", { scale: 1, rotation: 0, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1.25, ease: customEase });
        gsap.to(".progress-bar", { opacity: 0, duration: 0.3 });
        gsap.to(".menu-nav", { opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.5, onComplete: () => { const el = document.querySelector<HTMLElement>(".menu-nav"); if (el) el.style.pointerEvents = "all"; } });
        gsap.to(".logo", { opacity: 1, duration: 0.01 });
        gsap.to(".logo", {
          left: "0%",
          transform: "translateX(0%)",
          duration: 1.25,
          ease: customEase,
          onStart: () => {
            gsap.to(".char.anim-out h1", { y: "100%", duration: 1, stagger: -0.075, ease: customEase });
            gsap.to(".char.anim-in h1", { x: "-1200%", duration: 1, ease: customEase, delay: 0.25 });
          },
        });
      },
    });

    // Each line staggers in with blur clearing and subtle scale
    gsap.to(".header span", {
      y: "0%",
      filter: "blur(0px)",
      duration: 1.2,
      stagger: 0.1,
      ease: "power4.out",
      delay: 5.75,
    });
    gsap.to(".coordinates span", {
      y: "0%",
      filter: "blur(0px)",
      duration: 1,
      stagger: 0.08,
      ease: "power3.out",
      delay: 6.1,
    });

    return () => { lenis.destroy(); };
  }, []);

  return (
    <>
      {/* Menu nav — fixed, above everything */}
      <nav className="menu-nav">
        <div className="menu-bar">
          <div className="menu-logo">
            <a href="/"><span className="menu-logo-text">Esco Obong</span></a>
          </div>
          <div className="menu-toggle-btn" onClick={handleMenuToggle}>
            <div className="menu-toggle-label">
              <p ref={menuToggleLabelRef}>Menu</p>
            </div>
            <div className="menu-hamburger-icon" ref={hamburgerIconRef}>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div className="menu-overlay" ref={menuOverlayRef}>
          <div className="menu-overlay-content" ref={menuOverlayContentRef}>
            <div className="menu-media-wrapper" ref={menuMediaWrapperRef}>
              <Image src="/hero-img.jpg" alt="Menu media" fill style={{ objectFit: "cover", opacity: 0.25 }} />
            </div>
            <div className="menu-content-wrapper">
              <div className="menu-content-main">
                <div className="menu-col">
                  <div className="menu-link"><a href="#">Home</a></div>
                  <div className="menu-link"><a href="#">About</a></div>
                  <div className="menu-link"><a href="#">Studio</a></div>
                  <div className="menu-link"><a href="#">Journal</a></div>
                  <div className="menu-link"><a href="#">Connect</a></div>
                </div>
                <div className="menu-col">
                  <div className="menu-tag"><a href="#">LLMs</a></div>
                  <div className="menu-tag"><a href="#">System Design</a></div>
                  <div className="menu-tag"><a href="#">Algorithm & Data Structure</a></div>
                </div>
              </div>
              <div className="menu-footer">
                <div className="menu-col"><p>New York City, United State</p></div>
                <div className="menu-col">
                  <p>+1 700 000 0000</p>
                  <p>hello@esco.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero — ref'd so menu can push it down */}
      <div className="hero" ref={heroRef}>
        <div className="progress-bar">
          <p>loading</p>
          <p>/<span ref={counterRef}>0</span></p>
        </div>

        <div className="video-container">
          <Image src="/hero-img.jpg" alt="Hero background" fill priority style={{ objectFit: "cover", opacity: 0.85 }} />
        </div>

        <div className="header">
          {/* <h1><span>Happy Birthday</span></h1> */}
          <h1><span>Esco Obong</span></h1>
          {/* <h1><span>Kansas</span></h1>
          <p><span>( watch the fight )</span></p> */}
        </div>S

        <div className="coordinates">
          <p><span>37.6934° N</span></p>
          <p><span>97.3382° W</span></p>
        </div>
      </div>

      {/* Logo — outside hero, animates in independently */}
      <div className="logo">
        <div className="char"><h1>C</h1></div>
        <div className="char anim-out"><h1>l</h1></div>
        <div className="char anim-out"><h1>a</h1></div>
        <div className="char anim-out"><h1>s</h1></div>
        <div className="char anim-out"><h1>h</h1></div>
        <div className="char anim-out"><h1>o</h1></div>
        <div className="char anim-out"><h1>n</h1></div>
        <div className="char anim-in"><h1>.</h1></div>
      </div>
    </>
  );
}