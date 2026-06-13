import { Brain, BarChart3, Code2, Sparkles, Briefcase, Server } from "lucide-react";
import Reveal from "../components/Reveal";
import RevealText from "../components/RevealText";
import "./Skills.css";

const ICONS = {
  brain: Brain,
  chart: BarChart3,
  code: Code2,
  sparkles: Sparkles,
  briefcase: Briefcase,
  server: Server,
};

export default function Skills({ skills }) {
  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="skills-head">
          <Reveal>
            <div className="eyebrow">Capabilities</div>
            <RevealText as="h2" className="section-title" text="What I work with" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="section-sub" style={{ maxWidth: 340 }}>
              A full-stack ML practitioner — from raw data and model training to
              fine-tuning and production deployment.
            </p>
          </Reveal>
        </div>

        <div className="skills-grid">
          {skills.map((group, i) => {
            const Icon = ICONS[group.icon] || Code2;
            return (
              <Reveal key={group.category} delay={i * 0.06} className="skill-card">
                <div className="skill-icon">
                  <Icon size={22} />
                </div>
                <h3 className="skill-title">{group.category}</h3>
                <div className="skill-tags">
                  {group.items.map((it) => (
                    <span key={it} className="skill-tag">
                      {it}
                    </span>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
