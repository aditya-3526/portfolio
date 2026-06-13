import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import Reveal from "../components/Reveal";
import RevealText from "../components/RevealText";
import Magnetic from "../components/Magnetic";
import "./Contact.css";

export default function Contact({ about }) {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="contact-inner">
          <Reveal>
            <div className="eyebrow center">Contact</div>
          </Reveal>
          <RevealText as="h2" className="contact-title" text="Let's build something" />
          <Reveal>
            <p className="contact-tagline">
              I'm open to ML/AI Engineering, SDE, Data Analyst, and Business
              Analyst roles — and always happy to talk research or side
              projects.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <a className="contact-email" href={`mailto:${about.email}`}>
              {about.email}
            </a>
          </Reveal>

          <Reveal delay={0.2} className="contact-socials">
            <a href={about.github} target="_blank" rel="noreferrer" className="social" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href={about.linkedin} target="_blank" rel="noreferrer" className="social" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href={about.huggingface} target="_blank" rel="noreferrer" className="social" aria-label="HuggingFace">
              🤗
            </a>
            <a href={`mailto:${about.email}`} className="social" aria-label="Email">
              <Mail size={20} />
            </a>
          </Reveal>

          <Reveal delay={0.28}>
            <Magnetic strength={0.4}>
              <a href={about.linkedin} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ marginTop: 12 }}>
                Connect on LinkedIn <ArrowUpRight size={15} />
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>

      <footer className="footer">
        <span>© {new Date().getFullYear()} {about.name}</span>
        <span>{about.education.institute.split(",")[0]} — Graduating {about.education.graduation}</span>
      </footer>
    </section>
  );
}
