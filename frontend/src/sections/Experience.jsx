import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../components/Reveal";
import RevealText from "../components/RevealText";
import "./Experience.css";

export default function Experience({ experience }) {
  const [active, setActive] = useState(0);
  const cur = experience[active];

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <Reveal>
          <div className="eyebrow">Experience</div>
        </Reveal>
        <RevealText as="h2" className="section-title" text="Where I've worked & led" />

        <div className="exp-layout">
          <Reveal className="exp-tabs">
            {experience.map((e, i) => (
              <button
                key={i}
                className={`exp-tab ${i === active ? "active" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="exp-tab-role">{e.role}</span>
                <span className="exp-tab-org">{e.org}</span>
              </button>
            ))}
          </Reveal>

          <div className="exp-panel-wrap">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="exp-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <h3 className="exp-role">{cur.role}</h3>
                <div className="exp-org-line">
                  {cur.org} <span>— {cur.orgDetail}</span>
                </div>
                <div className="exp-period">{cur.period}</div>
                <ul className="exp-bullets">
                  {cur.bullets.map((b, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                    >
                      {b}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
