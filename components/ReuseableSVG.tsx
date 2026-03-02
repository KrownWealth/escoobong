import React from "react";

interface AboutMeSvgProps {
  text: string;
  className?: string;
}

export default function ReuseableSVG({
  text,
  className,
}: AboutMeSvgProps) {
  return (
    <svg
      viewBox="0 0 1400 220"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <text
        x="50%"
        y="195"
        textAnchor="middle"
        fontFamily="'Saans TRIAL', sans-serif"
        fontSize="240"
        fontWeight="800"
        letterSpacing="-4"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="1.5"
      >
        {text}
      </text>
    </svg>
  );
}