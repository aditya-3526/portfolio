import { motion } from "framer-motion";

/**
 * Masked word-by-word reveal. Each word sits in an overflow-clipped box and
 * rises into place with a stagger when scrolled into view — the "expensive"
 * editorial heading motion.
 *
 * <RevealText as="h2" className="section-title" text="Selected projects" />
 */
const EASE = [0.22, 1, 0.36, 1];

export default function RevealText({
  text,
  as = "span",
  className,
  delay = 0,
  stagger = 0.05,
  duration = 0.85,
  once = true,
}) {
  const Tag = motion[as] || motion.span;
  const words = String(text).split(" ");

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word = {
    hidden: { y: "115%" },
    show: { y: "0%", transition: { duration, ease: EASE } },
  };

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-12% 0px" }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" style={{ display: "inline-block" }}>
          <span
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "top",
              paddingBottom: "0.14em",
              marginBottom: "-0.14em",
            }}
          >
            <motion.span variants={word} style={{ display: "inline-block" }}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
