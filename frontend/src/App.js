import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Cursor from "./components/Cursor";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Honors from "./sections/Honors";
import Contact from "./sections/Contact";
import { fetchPortfolio } from "./utils/api";
import { initSmoothScroll, destroySmoothScroll } from "./lib/smoothScroll";
import fallback from "./data/fallbackContent";

export default function App() {
  // Start with fallback so the site renders instantly; swap in live data when it arrives.
  const [data, setData] = useState(fallback);

  useEffect(() => {
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchPortfolio()
      .then((live) => {
        // Only adopt live data if it actually has content.
        if (!cancelled && live && live.about && Array.isArray(live.projects) && live.projects.length) {
          setData({
            about: live.about,
            skills: live.skills?.length ? live.skills : fallback.skills,
            projects: live.projects,
            experience: live.experience?.length ? live.experience : fallback.experience,
            involvements: live.involvements?.length ? live.involvements : fallback.involvements,
            honors: live.honors?.length ? live.honors : fallback.honors,
          });
        }
      })
      .catch(() => {
        /* keep fallback — backend not running yet */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Cursor />
      <Navbar />
      <div className="grain" aria-hidden="true" />
      <main>
        <Hero about={data.about} />
        <About about={data.about} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <Experience experience={data.experience} />
        <Honors honors={data.honors} involvements={data.involvements} />
        <Contact about={data.about} />
      </main>
    </>
  );
}
