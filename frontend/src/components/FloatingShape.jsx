import { motion } from "framer-motion";

/**
 * FloatingShape component
 * Renders an animated floating blurred circle used as a decorative background element.
 *
 * Props:
 * - color: Tailwind CSS color class (e.g., "bg-green-500")
 * - size: Tailwind width and height classes (e.g., "w-64 h-64")
 * - top: top position in percentage or pixels (e.g., "10%")
 * - left: left position in percentage or pixels (e.g., "20%")
 * - delay: animation delay in seconds
 */
const FloatingShape = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      className={`absolute ${color} ${size} rounded-full opacity-20 blur-xl`}
      style={{ top, left }} // Custom positioning via inline styles
      animate={{
        // Animate vertically and horizontally in a loop + rotation
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20, // Total animation duration
        ease: "linear", // Smooth continuous motion
        repeat: Infinity, // Infinite loop
        delay: delay, // Delay before animation starts (customizable per shape)
      }}
      aria-hidden="true" // Hides from assistive technologies (purely decorative)
    />
  );
};

export default FloatingShape;
