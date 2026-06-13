import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/**
 * GPGPU-style particle morph. Tens of thousands of GPU points fly in from a
 * scattered cloud and assemble into the name, drift with curl-like simplex
 * turbulence, repel from the cursor, and explode outward as the hero scrolls
 * away. Rendered through an UnrealBloom composer for the premium glow.
 *
 * Implemented as a single Points cloud with a custom morph shader (no FBO
 * ping-pong needed) so it stays rock-solid and 60fps.
 */

const SIMPLEX = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

export default function ParticleMorph() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const W = () => mount.clientWidth;
    const H = () => mount.clientHeight || window.innerHeight;

    // particle count scales with screen — dense text on desktop, lighter on mobile
    const COUNT = W() < 720 ? 14000 : W() < 1200 ? 19000 : 24000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x07070c, 1);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W() / H(), 0.1, 100);
    camera.position.z = 7;

    // visible world dimensions on the z=0 plane
    const view = () => {
      const vh = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
      return { vw: vh * camera.aspect, vh };
    };

    const palette = [
      new THREE.Color("#fcbc1d"),
      new THREE.Color("#ffd25e"),
      new THREE.Color("#7c6cf0"),
      new THREE.Color("#38d6e0"),
    ];

    // ── sample the name into target positions via an offscreen canvas ──
    const sampleText = () => {
      const aspect = W() / H();
      const SH = 190;
      const SW = Math.round(SH * aspect);
      const c = document.createElement("canvas");
      c.width = SW;
      c.height = SH;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fs = Math.min(SH * 0.3, (SW / 7.2));
      ctx.font = `800 ${fs}px Syne, "Arial Black", sans-serif`;
      const cx = SW / 2;
      const cy = SH / 2;
      ctx.fillText("ADITYA", cx, cy - fs * 0.55);
      ctx.fillText("ARYAN", cx, cy + fs * 0.55);
      const data = ctx.getImageData(0, 0, SW, SH).data;
      const pts = [];
      for (let y = 0; y < SH; y += 1) {
        for (let x = 0; x < SW; x += 1) {
          if (data[(y * SW + x) * 4 + 3] > 130) pts.push([x, y]);
        }
      }
      return { pts, SW, SH };
    };

    let geometry, material, points, composer, bloom;

    const build = () => {
      const { pts, SW, SH } = sampleText();
      const { vw, vh } = view();
      const fit = 0.86;

      const position = new Float32Array(COUNT * 3); // text target
      const aOrigin = new Float32Array(COUNT * 3); // scattered start
      const aColor = new Float32Array(COUNT * 3);
      const aSize = new Float32Array(COUNT);
      const aRnd = new Float32Array(COUNT);

      for (let i = 0; i < COUNT; i++) {
        const p = pts.length ? pts[(Math.random() * pts.length) | 0] : [SW / 2, SH / 2];
        const jx = (Math.random() - 0.5) * (vw / SW) * 1.1;
        const jy = (Math.random() - 0.5) * (vh / SH) * 1.1;
        const tx = (p[0] / SW - 0.5) * vw * fit + jx;
        const ty = -(p[1] / SH - 0.5) * vh * fit + jy;
        position[i * 3] = tx;
        position[i * 3 + 1] = ty;
        position[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

        // scattered origin: random point in a big sphere shell
        const r = 6 + Math.random() * 9;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        aOrigin[i * 3] = r * Math.sin(ph) * Math.cos(th);
        aOrigin[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
        aOrigin[i * 3 + 2] = r * Math.cos(ph) - 4;

        // color: gold-dominant field with sparse violet / cyan accents
        const roll = Math.random();
        let col;
        if (roll < 0.72) col = palette[0].clone().lerp(palette[1], Math.random());
        else if (roll < 0.89) col = palette[2];
        else col = palette[3];
        const b = 0.5 + Math.random() * 0.35;
        aColor[i * 3] = col.r * b;
        aColor[i * 3 + 1] = col.g * b;
        aColor[i * 3 + 2] = col.b * b;

        aSize[i] = 0.45 + Math.random() * 1.15;
        aRnd[i] = Math.random();
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
      geometry.setAttribute("aOrigin", new THREE.BufferAttribute(aOrigin, 3));
      geometry.setAttribute("aColor", new THREE.BufferAttribute(aColor, 3));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));
      geometry.setAttribute("aRnd", new THREE.BufferAttribute(aRnd, 1));

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uAssemble: { value: reduce ? 1 : 0 },
          uScatter: { value: 0 },
          uMouse: { value: new THREE.Vector2(999, 999) },
          uMouseStrength: { value: 0.9 },
          uSize: { value: 1.0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.8) },
        },
        vertexShader: `
          uniform float uTime, uAssemble, uScatter, uSize, uPixelRatio, uMouseStrength;
          uniform vec2 uMouse;
          attribute vec3 aOrigin; attribute vec3 aColor; attribute float aSize; attribute float aRnd;
          varying vec3 vColor; varying float vAlpha;
          ${SIMPLEX}
          void main(){
            vColor = aColor;
            float assemble = smoothstep(0.0, 1.0, uAssemble);
            vec3 pos = mix(aOrigin, position, assemble);

            float flow = (1.0 - assemble) * 0.8 + uScatter * 1.3 + 0.05;
            vec3 np = pos * 0.16 + vec3(aRnd * 6.0, 0.0, uTime * 0.12);
            vec3 turb = vec3(snoise(np), snoise(np + 21.7), snoise(np + 8.3));
            pos += turb * flow;

            vec3 dir = normalize(pos + vec3(aRnd - 0.5, aRnd * 0.7, 1.0));
            pos += dir * uScatter * (2.4 + aRnd * 3.0);

            float md = distance(pos.xy, uMouse);
            float push = smoothstep(2.2, 0.0, md) * uMouseStrength * assemble * (1.0 - uScatter);
            pos.xy += normalize(pos.xy - uMouse + 0.001) * push;

            vAlpha = (1.0 - uScatter * 0.92) * (0.22 + assemble * 0.4);

            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = aSize * uSize * (1.0 + push * 0.6) * (26.0 / -mv.z);
          }
        `,
        fragmentShader: `
          varying vec3 vColor; varying float vAlpha;
          void main(){
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(vColor, a * vAlpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);
    };

    build();

    // ── postprocessing: bloom ──
    composer = new EffectComposer(renderer);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    composer.setSize(W(), H());
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(W(), H()), 0.32, 0.6, 0.22);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // rebuild once webfonts are ready so the text samples at the right metrics
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!points) return;
        scene.remove(points);
        geometry.dispose();
        material.dispose();
        build();
      });
    }

    // ── interaction ──
    const target = new THREE.Vector2(999, 999);
    const onMove = (e) => {
      const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
      const { vw, vh } = view();
      target.set((ndcX * vw) / 2, (ndcY * vh) / 2);
    };
    const onLeave = () => target.set(999, 999);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    // ── animation ──
    const clock = new THREE.Clock();
    let raf;
    const startDelay = 0.35;
    const assembleDur = 2.6;
    const render = () => {
      raf = requestAnimationFrame(render);
      const t = clock.getElapsedTime();

      if (!reduce) {
        // assemble tween (easeOutCubic)
        const a = THREE.MathUtils.clamp((t - startDelay) / assembleDur, 0, 1);
        material.uniforms.uAssemble.value = 1 - Math.pow(1 - a, 3);

        // scatter from scroll within the hero
        const scatter = THREE.MathUtils.clamp(window.scrollY / (H() * 0.9), 0, 1);
        material.uniforms.uScatter.value = scatter;

        material.uniforms.uTime.value = t;
        material.uniforms.uMouse.value.lerp(target, 0.08);
        points.rotation.y = Math.sin(t * 0.08) * 0.06;
        points.rotation.x = Math.cos(t * 0.06) * 0.03;
      }
      composer.render();
    };
    render();

    // ── resize ──
    let rt;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        const w = W();
        const h = H();
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
        bloom.setSize(w, h);
        // rebuild text targets for the new aspect
        scene.remove(points);
        geometry.dispose();
        material.dispose();
        build();
      }, 220);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      geometry?.dispose();
      material?.dispose();
      composer?.dispose?.();
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
