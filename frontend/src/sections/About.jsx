import { useEffect, useRef } from "react";
import * as THREE from "three";
import Reveal from "../components/Reveal";
import RevealText from "../components/RevealText";
import "./About.css";

function TorusKnot() {
  const mountRef = useRef(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const size = () => ({ w: mount.clientWidth, h: mount.clientHeight || 420 });
    let { w, h } = size();
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 4;

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.2, 0.34, 140, 18),
      new THREE.MeshBasicMaterial({ color: 0xfcbc1d, wireframe: true, transparent: true, opacity: 0.4 })
    );
    scene.add(knot);

    const inner = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.08, 0.24, 90, 16),
      new THREE.MeshPhongMaterial({ color: 0x16162a, emissive: 0x7c6cf0, emissiveIntensity: 0.25, transparent: true, opacity: 0.55 })
    );
    scene.add(inner);

    scene.add(new THREE.AmbientLight(0x7c6cf0, 0.5));
    const pt = new THREE.PointLight(0xfcbc1d, 2.2, 20);
    pt.position.set(3, 3, 3);
    scene.add(pt);

    // orbit dust
    const n = 500;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 1.9 + Math.random() * 1.1, t = Math.random() * Math.PI * 2, p = Math.random() * Math.PI;
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pos[i * 3 + 2] = r * Math.cos(p);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x38d6e0, size: 0.03, transparent: true, opacity: 0.6 }));
    scene.add(dust);

    let raf, t = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      t += reduce ? 0 : 0.007;
      knot.rotation.x = t * 0.4;
      knot.rotation.y = t * 0.6;
      inner.rotation.x = t * 0.4;
      inner.rotation.y = t * 0.6;
      dust.rotation.y = -t * 0.1;
      renderer.render(scene, camera);
    };
    loop();

    const onResize = () => {
      ({ w, h } = size());
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      knot.geometry.dispose();
      inner.geometry.dispose();
      dustGeo.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);
  return <div className="about-canvas" ref={mountRef} aria-hidden="true" />;
}

export default function About({ about }) {
  const stats = [
    { num: "5+", label: "Production-deployed ML projects" },
    { num: "0.843", label: "ROC-AUC, Customer Churn model" },
    { num: "330K", label: "Sample corpus, Toxicity Classifier" },
    { num: "Top 100", label: "ZS Campus Beats 2026 (National)" },
  ];

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="about-grid">
          <Reveal className="about-visual">
            <TorusKnot />
            <div className="about-badge">
              <div className="val">{about.education.graduation}</div>
              <div className="lbl">B.E. · {about.education.institute.split(",")[0]}</div>
            </div>
          </Reveal>

          <div className="about-text">
            <Reveal>
              <div className="eyebrow">About me</div>
            </Reveal>
            <RevealText as="h2" className="section-title" text="Engineering intelligent systems, end to end" />
            {about.summary.slice(0, 3).map((para, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <p className="about-para">{para}</p>
              </Reveal>
            ))}

            <div className="about-stats">
              {stats.map((s, i) => (
                <Reveal key={i} delay={0.15 + i * 0.07} className="stat-card">
                  <div className="num">{s.num}</div>
                  <div className="desc">{s.label}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
