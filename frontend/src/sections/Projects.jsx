import { useRef } from "react";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import Reveal from "../components/Reveal";
import RevealText from "../components/RevealText";
import Magnetic from "../components/Magnetic";
import "./Projects.css";

function ProjectCard({ project, index }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    const rx = (px - 0.5) * 11; // rotateY
    const ry = -(py - 0.5) * 11; // rotateX
    el.style.transform = `perspective(900px) rotateX(${ry}deg) rotateY(${rx}deg) translateY(-6px) scale(1.012)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
  };

  return (
    <Reveal delay={(index % 2) * 0.08} className="project-card-wrap">
      <article
        className="project-card"
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-cursor
      >
        <div className="project-sheen" aria-hidden="true" />
        <div className="project-top">
          <span className="project-num">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="project-cat">{project.category}</span>
        </div>

        <h3 className="project-name">{project.name}</h3>
        <p className="project-blurb">{project.blurb}</p>

        <div className="project-metrics">
          {project.metrics.map((m) => (
            <div key={m.label} className="metric">
              <div className="metric-val">{m.value}</div>
              <div className="metric-lbl">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="project-stack">
          {project.stack.map((s) => (
            <span key={s} className="stack-pill">
              {s}
            </span>
          ))}
        </div>

        <div className="project-links">
          {project.links?.live && (
            <a href={project.links.live} target="_blank" rel="noreferrer" className="project-link primary">
              Live demo <ExternalLink size={14} />
            </a>
          )}
          {project.links?.repo && (
            <a href={project.links.repo} target="_blank" rel="noreferrer" className="project-link">
              <Github size={14} /> Code
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export default function Projects({ projects }) {
  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="projects-head">
          <div>
            <Reveal>
              <div className="eyebrow">Work</div>
            </Reveal>
            <RevealText as="h2" className="section-title" text="Selected projects" />
          </div>
          <Reveal delay={0.1}>
            <Magnetic strength={0.3}>
              <a href="https://github.com/aditya-3526" target="_blank" rel="noreferrer" className="btn btn-ghost">
                All on GitHub <ArrowUpRight size={15} />
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <div className="projects-grid">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug || p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
