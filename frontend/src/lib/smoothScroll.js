import Lenis from "lenis";

/**
 * Global Lenis smooth-scroll singleton. Apple-style inertia scrolling that
 * also drives a synced RAF loop. Anchor links and section navigation route
 * through `scrollToId` so the easing stays consistent everywhere.
 */
let lenis = null;
let rafId = null;

export function initSmoothScroll() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Touch devices keep native scrolling — Lenis on mobile can feel laggy.
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (reduce || coarse || lenis) return lenis;

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });

  const raf = (time) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  return lenis;
}

export function destroySmoothScroll() {
  if (rafId) cancelAnimationFrame(rafId);
  if (lenis) lenis.destroy();
  lenis = null;
  rafId = null;
}

export function getLenis() {
  return lenis;
}

/** Scroll to a section id (e.g. "projects"), routing through Lenis when active. */
export function scrollToId(id, opts = {}) {
  const target = id === "hero" ? 0 : document.getElementById(id);
  if (target == null && id !== "hero") return;
  if (lenis) {
    lenis.scrollTo(target, { offset: -80, duration: 1.25, ...opts });
  } else {
    const el = id === "hero" ? document.body : target;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
