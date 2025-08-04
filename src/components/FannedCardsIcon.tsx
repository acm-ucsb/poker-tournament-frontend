import React from "react";
import { motion, Variants } from "framer-motion";

const cardVariants: Variants = {
  stacked: {
    rotate: 0,
    transformOrigin: "50% 100%",
  },
  fanned: (i: number) => ({
    rotate: (i - 1.5) * 12,
    transformOrigin: "50% 100%",
    transition: {
      delay: 0.8 + i * 0.1,
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  }),
};

const CardContent = ({
  rank,
  suit,
  color,
  isFrontCard,
}: {
  rank: string;
  suit: string;
  color: string;
  isFrontCard: boolean;
}) => (
  <>
    {/* Top-left */}
    <text x="34" y="32" fontSize="8" fill={color}>
      {rank}
    </text>
    <text x="33" y="42" fontSize="10" fill={color}>
      {suit}
    </text>

    {/* Bottom-right */}
    <text x="68" y="85" fontSize="8" fill={color} transform="rotate(180 67 78)">
      {rank}
    </text>
    <text
      x="67"
      y="75"
      fontSize="10"
      fill={color}
      transform="rotate(180 67 68)"
    >
      {suit}
    </text>

    {/* Center suit for front card */}
    {isFrontCard && (
      <text x="50" y="57" fontSize="20" textAnchor="middle" fill={color}>
        {suit}
      </text>
    )}
  </>
);

export const FannedCardsIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const cards = [
    { rank: "A", suit: "♥", color: "red" },
    { rank: "A", suit: "♣", color: "black" },
    { rank: "A", suit: "♦", color: "red" },
    { rank: "A", suit: "♠", color: "black" },
  ];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
      className="transform-gpu"
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="1"
            dy="1"
            stdDeviation="2"
            floodColor="#000000"
            floodOpacity="0.3"
          />
        </filter>
      </defs>

      {cards.map((card, i) => (
        <motion.g
          key={i}
          custom={i}
          variants={cardVariants}
          initial="stacked"
          animate="fanned"
          style={{ filter: "url(#shadow)" }}
        >
          <rect
            x="30"
            y="20"
            width="40"
            height="60"
            rx="4"
            fill="white"
            stroke="black"
            strokeWidth="0.5"
          />
          <CardContent {...card} isFrontCard={i === cards.length - 1} />
        </motion.g>
      ))}
    </svg>
  );
};
