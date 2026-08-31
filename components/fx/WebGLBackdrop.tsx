"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Bright, energetic animated backdrop for the hero: a full-screen fragment
 * shader producing flowing, domain-warped colour blobs in the padel palette
 * (electric blue, teal, lime over a light base). Modern "living gradient"
 * — sporty and luminous, no water. Fades out subtly as the user scrolls.
 *
 * Fully procedural, no textures, works out of the box.
 */
export default function WebGLBackdrop() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const mount = mountRef.current!;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Certains Android d'entrée de gamme, le mode économie d'énergie et les
    // navigateurs sans WebGL font échouer la création du contexte. Sans ce
    // garde-fou, l'exception remonte depuis l'effet et React démonte la racine
    // cliente : page blanche. Ici, le dégradé CSS du hero prend simplement le
    // relais.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uRes: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uBase: { value: new THREE.Color(0xeef3fa) },
      uBlue: { value: new THREE.Color(0x1b4de4) },
      uTeal: { value: new THREE.Color(0x00c2a8) },
      uLime: { value: new THREE.Color(0xcdff3a) },
    };

    const vertexShader = /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = /* glsl */ `
      precision highp float;
      uniform float uTime;
      uniform vec2 uRes;
      uniform vec3 uBase;
      uniform vec3 uBlue;
      uniform vec3 uTeal;
      uniform vec3 uLime;
      varying vec2 vUv;

      // Smooth value noise.
      vec2 hash(vec2 p){
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }
      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(dot(hash(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)),
              dot(hash(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
          mix(dot(hash(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)),
              dot(hash(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x),
          u.y);
      }

      void main() {
        vec2 uv = vUv;
        float aspect = uRes.x / uRes.y;
        vec2 p = vec2(uv.x * aspect, uv.y);
        float t = uTime * 0.06;

        // Domain warp for flowing motion.
        float n1 = noise(p * 2.2 + vec2(t, t * 0.7));
        float n2 = noise(p * 2.2 + vec2(-t * 0.8, t) + n1 * 1.5);
        float n3 = noise(p * 3.4 + vec2(t * 1.2, -t) + n2 * 1.2);

        // Start from the light base and layer translucent colour blobs.
        vec3 col = uBase;
        col = mix(col, uBlue, smoothstep(0.15, 0.75, n1) * 0.55);
        col = mix(col, uTeal, smoothstep(0.25, 0.85, n2) * 0.45);
        col = mix(col, uLime, smoothstep(0.55, 0.95, n3) * 0.30);

        // Keep the upper area lighter (airy, sporty) and add a soft vignette.
        col = mix(col, uBase, smoothstep(0.55, 1.0, uv.y) * 0.45);
        float vig = smoothstep(1.25, 0.2, length((uv - 0.5) * vec2(aspect, 1.0)));
        col = mix(uBase, col, vig);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    let fade = 1;
    const onScroll = () => {
      const vh = window.innerHeight;
      const d = Math.min(1, Math.max(0, window.scrollY / vh));
      fade = 1 - d * 0.6;
      mount.style.opacity = String(fade);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Sur iOS, l'apparition/disparition de la barre d'URL déclenche un `resize`
    // à chaque micro-défilement. Réallouer le framebuffer à chaque fois saccade
    // le défilement : on ne réagit donc qu'aux changements de largeur.
    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
      // `setSize` réalloue le tampon, donc l'efface. Sans boucle d'animation
      // pour le repeindre — c'est le cas en mouvement réduit — le fond serait
      // resté vide après une rotation de l'écran.
      if (reduced) renderer.render(scene, camera);
    };
    window.addEventListener("resize", onResize);

    // Le temps est accumulé à la main plutôt que lu sur `Clock.getElapsedTime()` :
    // `Clock.start()` remet le compteur à zéro, et le nuancier repartirait donc
    // du début à chaque retour du hero dans le champ. Ici il reprend où il en
    // était, sans que les pauses ne se voient.
    const clock = new THREE.Clock(false);
    let elapsed = 0;
    let frame = 0;
    let running = false;

    const animate = () => {
      elapsed += clock.getDelta();
      uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      clock.start();
      frame = requestAnimationFrame(animate);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
      clock.stop();
    };

    // Mouvement réduit : une seule image, figée. Rendre 60 fois par seconde une
    // image identique coûtait autant que l'animation elle-même.
    if (reduced) {
      uniforms.uTime.value = 6.0;
      renderer.render(scene, camera);
    }

    // Le hero ne fait qu'un écran de haut : sans cela, le nuancier continuait de
    // se calculer plein écran pendant que le visiteur lisait la FAQ. C'est la
    // cause principale des saccades relevées en bas de page sur mobile.
    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(mount);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      material.dispose();
      quad.geometry.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0"
    />
  );
}
