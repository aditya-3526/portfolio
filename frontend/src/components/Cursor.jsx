import { useEffect, useRef, useState } from "react";
import "./Cursor.css";

/**
 * Custom cursor: a precise dot that tracks instantly, and a ring that trails
 * with easing. The ring swells over interactive elements ([data-cursor],
 * a, button) and collapses while pressing. Only mounts on fine-pointer
 * devices so touch/mobile keep their native behaviour.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  // Decide once whether to mount the custom cursor at all.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine) setEnabled(true);
  }, []);

  // Wire up tracking only after the cursor nodes actually exist.
  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    const isInteractive = (el) =>
      el?.closest?.(
        "a, button, [data-cursor], input, textarea, .project-card, .skill-card"
      );

    const over = (e) => {
      if (isInteractive(e.target)) ring.classList.add("hover");
    };
    const out = (e) => {
      if (isInteractive(e.target)) ring.classList.remove("hover");
    };
    const down = () => ring.classList.add("down");
    const up = () => ring.classList.remove("down");
    const leave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const enter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
