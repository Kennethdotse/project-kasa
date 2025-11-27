"use client";

import { motion } from "framer-motion";

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const Shape = ({
  x,
  y,
  size,
  color,
  delay,
  duration,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      top: `${y}%`,
      left: `${x}%`,
    }}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{
      opacity: [0, 0.2, 0],
      scale: [0.5, 1.2, 0.5],
      y: [0, random(-30, 30), 0],
      x: [0, random(-30, 30), 0],
    }}
    transition={{
      duration,
      ease: "easeInOut",
      repeat: Infinity,
      delay,
    }}
  />
);

const shapes = [
  { x: 10, y: 20, size: 100, color: "hsl(var(--primary) / 0.2)", delay: 0, duration: 15 },
  { x: 80, y: 15, size: 150, color: "hsl(var(--accent) / 0.2)", delay: 2, duration: 18 },
  { x: 20, y: 80, size: 80, color: "hsl(var(--primary) / 0.2)", delay: 4, duration: 20 },
  { x: 90, y: 70, size: 120, color: "hsl(var(--accent) / 0.2)", delay: 6, duration: 16 },
  { x: 50, y: 50, size: 60, color: "hsl(var(--primary) / 0.2)", delay: 8, duration: 14 },
];

export default function Background() {
  return (
    <div className="absolute inset-0 z-0">
      {shapes.map((shape, i) => (
        <Shape key={i} {...shape} />
      ))}
    </div>
  );
}
