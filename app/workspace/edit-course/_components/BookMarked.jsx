"use client";

import { motion, useAnimation } from "framer-motion"; // Remplacement de "motion/react" par "framer-motion"

const bookmarkVariants = {
  normal: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  animate: {
    y: [2, -4, 0],
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15,
      mass: 1,
    },
  },
};

const staticVariants = {
  normal: {
    opacity: 1,
  },
  animate: {
    opacity: 1,
  },
};

const BookMarked = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
  ...props
}) => {
  const controls = useAnimation();

  return (
    <div
      style={{
        cursor: "pointer",
        userSelect: "none",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-green-400"
        {...props}
      >
        {/* Bouncing bookmark */}
        <motion.path
          d="M10 2v8l3-3 3 3V2"
          variants={bookmarkVariants}
          animate={controls}
          initial="normal"
        />
        {/* Static book part */}
        <motion.path
          d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
          variants={staticVariants}
          animate={controls}
          initial="normal"
        />
      </svg>
    </div>
  );
};

export default BookMarked;
