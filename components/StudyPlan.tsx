"use client";

import { useRef } from "react";
import AnimatedCopy from "./AnimatedText";

interface StudyRow {
  topic: string;
  tag: string;
  items: string[];
  direction: "left" | "right";
  duration: number;
}

const studyRows: StudyRow[] = [
  {
    topic: "Data Structures & Algorithms",
    tag: "Foundation",
    direction: "left",
    duration: 35,
    items: [
      "Arrays & Hashing",
      "Two Pointers",
      "Sliding Window",
      "Binary Search",
      "Linked Lists",
      "Trees & Tries",
      "Graphs",
      "Heaps & Priority Queues",
      "Backtracking",
      "Dynamic Programming",
      "Greedy Algorithms",
      "Bit Manipulation",
    ],
  },
  {
    topic: "System Design",
    tag: "Senior-level",
    direction: "right",
    duration: 40,
    items: [
      "URL Shortener",
      "Rate Limiter",
      "Consistent Hashing",
      "Distributed Cache",
      "Message Queue",
      "CDN Architecture",
      "Database Sharding",
      "Load Balancing",
      "Event-Driven Systems",
      "CAP Theorem",
      "API Gateway",
      "Search Autocomplete",
    ],
  },
  {
    topic: "Behavioural & Leadership",
    tag: "Culture Fit",
    direction: "left",
    duration: 30,
    items: [
      "STAR Framework",
      "Conflict Resolution",
      "Ownership Stories",
      "Cross-team Impact",
      "Failure & Recovery",
      "Mentorship Examples",
      "Ambiguity & Decision-making",
      "Prioritisation Under Pressure",
      "Stakeholder Alignment",
      "Metrics & Outcomes",
    ],
  },
  {
    topic: "LeetCode Patterns",
    tag: "Repetition",
    direction: "right",
    duration: 38,
    items: [
      "Top K Elements",
      "Fast & Slow Pointers",
      "Merge Intervals",
      "Cyclic Sort",
      "In-place Reversal",
      "BFS / Level Order",
      "DFS",
      "Subsets / Power Set",
      "Modified Binary Search",
      "K-way Merge",
      "Topological Sort",
      "Matrix Traversal",
    ],
  },
  {
    topic: "Languages & Tooling",
    tag: "Craft",
    direction: "left",
    duration: 32,
    items: [
      "TypeScript",
      "Python",
      "React",
      "Node.js",
      "SQL & NoSQL",
      "Redis",
      "Kafka",
      "Docker",
      "Git Internals",
      "REST & GraphQL",
      "Testing Strategies",
      "CI/CD Pipelines",
    ],
  },
];

export default function StudyPlan() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section className="study-plan" ref={sectionRef}>
      {/* ── Heading ── */}
      <div className="study-plan-heading">
        <p className="study-plan-eyebrow">How I Study</p>
        <AnimatedCopy
          colorDim="#333"
          colorLit="#fff"
          start="top 90%"
          end="top 15%"
        >
          <h2>
            The exact blueprint that got me multiple offers at FAANG.
          </h2>
        </AnimatedCopy>
      </div>

      {/* ── Marquee rows ── */}
      <div className="study-plan-rows">
        {studyRows.map((row, rowIndex) => (
          <div className="study-plan-row" key={rowIndex}>
            {/* Topic label pinned left */}
            <div className="study-plan-row-label">
              <span className="study-plan-row-tag">{row.tag}</span>
              <span className="study-plan-row-topic">{row.topic}</span>
            </div>

            {/* Marquee track */}
            <div className="study-plan-marquee-clip">
              <div
                className="study-plan-marquee-track"
                style={{
                  animationDuration: `${row.duration}s`,
                  animationDirection:
                    row.direction === "right" ? "reverse" : "normal",
                }}
              >
                {/* Items duplicated to create seamless loop */}
                {[...row.items, ...row.items].map((item, i) => (
                  <div className="study-plan-item" key={i}>
                    <span className="study-plan-item-dot" />
                    <span className="study-plan-item-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer cta ── */}
      <div className="study-plan-footer">
        <p>6 months of consistency. That&apos;s all it takes.</p>
      </div>
    </section>
  );
}