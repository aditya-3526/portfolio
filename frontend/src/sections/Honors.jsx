import { Trophy, Award, Medal } from "lucide-react";
import Reveal from "../components/Reveal";
import RevealText from "../components/RevealText";
import "./Honors.css";

const ICONS = [Trophy, Medal, Award];

export default function Honors({ honors, involvements }) {
  return (
    <section id="honors" className="section honors">
      <div className="container">
        <Reveal>
          <div className="eyebrow">Recognition</div>
        </Reveal>
        <RevealText as="h2" className="section-title" text="Honors & involvement" />

        <div className="honors-grid">
          {honors.map((h, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={h.title} delay={i * 0.07} className="honor-card">
                <div className="honor-icon">
                  <Icon size={20} />
                </div>
                <div className="honor-award">{h.award}</div>
                <h3 className="honor-title">{h.title}</h3>
                <p className="honor-detail">{h.detail}</p>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <h3 className="involve-head">Beyond the work</h3>
        </Reveal>
        <div className="involve-list">
          {involvements.map((x, i) => (
            <Reveal key={x.title} delay={i * 0.06} className="involve-item">
              <div className="involve-title">{x.title}</div>
              <div className="involve-role">{x.role}</div>
              <p className="involve-detail">{x.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
