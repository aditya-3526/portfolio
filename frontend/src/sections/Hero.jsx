import { motion } from "framer-motion";
import { ArrowDown, Sparkles, ArrowUpRight } from "lucide-react";
import ParticleMorph from "../components/ParticleMorph";
import Magnetic from "../components/Magnetic";
import { scrollToId } from "../lib/smoothScroll";
import "./Hero.css";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 1.0 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero({ about }) {
  return (
    <section id="hero" className="hero">
      <ParticleMorph />
      <div className="hero-veil" />
      <div className="hero-grid-lines" aria-hidden="true" />

      {/* Accessible name — the visual title is rendered as particles. */}
      <h1 className="sr-only">{about.name} — {about.title}</h1>

      <motion.div className="hero-inner" variants={container} initial="hidden" animate="show">
        {/* top zone — sits just above the centered particle name */}
        <div className="hero-top">
          <motion.div className="hero-tag" variants={item}>
            <Sparkles size={13} /> {about.title}
          </motion.div>
        </div>

        {/* bottom zone — sits just below the centered particle name */}
        <div className="hero-bottom">
          <motion.p className="hero-role" variants={item}>
            Building <span>intelligent systems</span> at the intersection of ML,
            data, and software engineering.
          </motion.p>

          <motion.div className="hero-cta" variants={item}>
            <Magnetic strength={0.4}>
              <button className="btn btn-gold" onClick={() => scrollToId("projects")}>
                View my work <ArrowUpRight size={16} />
              </button>
            </Magnetic>
            <Magnetic strength={0.4}>
              <button className="btn btn-ghost" onClick={() => scrollToId("contact")}>
                Get in touch
              </button>
            </Magnetic>
          </motion.div>

          <motion.div className="hero-meta" variants={item}>
            <span>{about.education.institute.split(",")[0]}</span>
            <span className="dot">•</span>
            <span>Graduating {about.education.graduation}</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.button
        className="hero-scroll"
        onClick={() => scrollToId("about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        aria-label="Scroll to about"
      >
        <span>Scroll</span>
        <span className="hero-scroll-line"><ArrowDown size={13} /></span>
      </motion.button>
    </section>
  );
}
