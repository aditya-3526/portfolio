import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Magnetic from "./Magnetic";
import { scrollToId } from "../lib/smoothScroll";
import "./Navbar.css";

const LINKS = [
  ["About", "about"],
  ["Skills", "skills"],
  ["Projects", "projects"],
  ["Experience", "experience"],
  ["Honors", "honors"],
  ["Contact", "contact"],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active-section highlight via IntersectionObserver
  useEffect(() => {
    const ids = LINKS.map(([, id]) => id);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <motion.nav
        className={scrolled ? "nav scrolled" : "nav"}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.2 }}
      >
        <a href="#hero" className="nav-logo" onClick={(e) => go(e, "hero")}>
          AA<span>_</span>
        </a>

        <ul className="nav-links">
          {LINKS.map(([label, id]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={active === id ? "active" : ""}
                onClick={(e) => go(e, id)}
              >
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>

        <Magnetic strength={0.45} className="nav-cta-wrap">
          <a href="#contact" className="nav-cta" onClick={(e) => go(e, "contact")}>
            Let's talk
          </a>
        </Magnetic>

        <button
          className="nav-burger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
        >
          <span className={menuOpen ? "open" : ""} />
        </button>

        {menuOpen && (
          <motion.ul
            className="nav-mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {LINKS.map(([label, id]) => (
              <li key={id}>
                <a href={`#${id}`} onClick={(e) => go(e, id)}>
                  {label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </motion.nav>
    </>
  );
}
