import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Ambient 3D particle field with mouse-reactive parallax and a wave shader.
 * Pure Three.js (no R3F) so it stays light. Cleans itself up on unmount and
 * respects prefers-reduced-motion.
 */
export default function ParticleField() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      62,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

    // ── particles ──
    const count = 2600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const palette = [
      new THREE.Color("#fcbc1d"),
      new THREE.Color("#7c6cf0"),
      new THREE.Color("#38d6e0"),
    ];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;
      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
      sizes[i] = Math.random() * 2 + 0.4;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uTime;
        uniform vec2 uMouse;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.z += sin(pos.x * 0.4 + uTime) * 0.25 + cos(pos.y * 0.4 + uTime * 0.7) * 0.25;
          float d = distance(pos.xy, uMouse * 11.0);
          pos.xy += normalize(pos.xy - uMouse * 11.0) * max(0.0, (3.2 - d) * 0.06);
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * (300.0 / -mv.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = dot(uv, uv);
          if (d > 0.25) discard;
          float a = 1.0 - smoothstep(0.12, 0.25, d);
          gl_FragColor = vec4(vColor, a * 0.75);
        }
      `,
      transparent: true,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, material);
    scene.add(points);

    // sparse connection lines
    const linePts = [];
    for (let i = 0; i < 70; i++) {
      const a = Math.floor(Math.random() * count) * 3;
      const b = Math.floor(Math.random() * count) * 3;
      linePts.push(
        new THREE.Vector3(positions[a], positions[a + 1], positions[a + 2])
      );
      linePts.push(
        new THREE.Vector3(positions[b], positions[b + 1], positions[b + 2])
      );
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x7c6cf0,
      transparent: true,
      opacity: 0.06,
    });
    scene.add(new THREE.LineSegments(lineGeo, lineMat));

    // ── interaction ──
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += reduceMotion ? 0 : 0.004;
      material.uniforms.uTime.value = t;
      material.uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouse.x, mouse.y),
        0.05
      );
      points.rotation.y = t * 0.025 + mouse.x * 0.12;
      points.rotation.x = mouse.y * 0.06;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      material.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
