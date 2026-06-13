import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Magnetic hover wrapper — the child eases toward the cursor while hovered,
 * then springs back. Disabled on coarse/touch pointers.
 *
 * <Magnetic strength={0.4}><button/></Magnetic>
 */
export default function Magnetic({ children, strength = 0.35, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });

  const fine =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const onMove = (e) => {
    if (!fine) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy, display: "inline-flex" }}
    >
      {children}
    </motion.div>
  );
}
