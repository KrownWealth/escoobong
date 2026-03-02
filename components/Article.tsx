"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface Article {
  tag: string;
  title: string;
  image: string | null;
  href: string;
  date: string;
  source: "medium" | "substack";
  excerpt?: string;
}

export default function Articles() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [articles, setArticles] = useState<Article[]>([]);


  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((data) => setArticles([...data, ...data]))
      .catch(console.error);
  }, []);


  useGSAP(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const heading = headingRef.current;
    if (!section || !track || !heading || articles.length === 0) return;

    const getScrollDistance = () => track.scrollWidth - section.offsetWidth;

    gsap.fromTo(heading, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 80%" },
    });

    track.querySelectorAll<HTMLElement>(".writing-card").forEach((card, i) => {
      gsap.fromTo(card, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: i * 0.08,
        scrollTrigger: { trigger: section, start: "top 60%" },
      });
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${getScrollDistance()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        gsap.set(track, { x: -getScrollDistance() * self.progress });
        const fill = document.getElementById("writing-progress-fill");
        if (fill) gsap.set(fill, { scaleX: self.progress, transformOrigin: "left center" });
      },
    });
  }, { dependencies: [articles] });

  return (
    <section className="writing-section" ref={sectionRef}>
      <div className="writing-header" ref={headingRef}>
        <div className="writing-header-left">
          <p className="writing-eyebrow">From the blog</p>
          <h2 className="writing-title">Articles</h2>
        </div>
        <Link
          className="writing-view-all"
          href="https://medium.com/@escobyte"
          target="_blank"
          rel="noopener noreferrer"
        >
          View all on Medium ↗
        </Link>
      </div>

      <div className="writing-overflow">
        <div className="writing-track" ref={trackRef}>
          {articles.map((article, i) => (
            <Link
              key={i}
              className="writing-card"
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
                pointerEvents: "auto"  // ← fixes GSAP blocking clicks
              }}
            >
              <div className="writing-card-img">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                ) : (
                  <div className="writing-card-img-fallback" />
                )}
              </div>

              <div className="writing-card-body">
                <div className="writing-card-meta">
                  <span className="writing-card-tag">{article.tag}</span>
                  <span className="writing-card-date">{article.date}</span>
                </div>
                <h3 className="writing-card-title">{article.title}</h3>
                <p className="writing-card-excerpt">{article.excerpt}</p>

              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="writing-progress-bar">
        <div className="writing-progress-fill" id="writing-progress-fill" />
      </div>
    </section>
  );
}