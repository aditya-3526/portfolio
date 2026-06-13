import { motion } from "framer-motion";

/**
 * Reveal-on-scroll wrapper. Fades + slides children into view once.
 * Usage: <Reveal delay={0.1}><div/></Reveal>
 */
export default function Reveal({ children, delay = 0, y = 36, className, as = "div" }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
