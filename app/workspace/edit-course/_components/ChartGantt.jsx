"use client";

import { motion, useAnimation } from "framer-motion"; // Remplacement de "motion/react" par "framer-motion"

const frameVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 1 },
};

const lineVariants = {
  visible: { pathLength: 1, opacity: 1 },
  hidden: { pathLength: 0, opacity: 0 },
};

const ChartGantt = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
  ...props
}) => {
  const controls = useAnimation();

  const handleHoverStart = async () => {
    await controls.start((i) => ({
      pathLength: 0,
      opacity: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }));
    await controls.start((i) => ({
      pathLength: 1,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.3 },
    }));
  };

  const handleHoverEnd = () => {
    controls.start("visible");
  };

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
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
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
        className="stroke-red-400"
        {...props}
      >
        <motion.path
          variants={lineVariants}
          initial="visible"
          animate={controls}
          custom={3}
          d="M10 6h8"
        />
        <motion.path
          variants={lineVariants}
          initial="visible"
          animate={controls}
          custom={2}
          d="M12 16h6"
        />
        <motion.path variants={frameVariants} d="M3 3v16a2 2 0 0 0 2 2h16" />
        <motion.path
          variants={lineVariants}
          initial="visible"
          animate={controls}
          custom={1}
          d="M8 11h7"
        />
      </svg>
    </div>
  );
};

export default ChartGantt;
