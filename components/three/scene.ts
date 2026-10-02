import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createCourt } from "./court";
import { createBall, createRacket, type Quality } from "./racket";
import {
  ballTexture,
  faceTexture,
  fenceTexture,
  gripTexture,
  netTexture,
  turfTexture,
  type SceneFonts,
} from "./textures";

/**
 * Séquence du héros : la raquette en gros plan, la frappe, puis la caméra qui
 * suit la balle et s'élève jusqu'au plan du court vu de dessus — le « tableau
 * tactique » du coach, avec ses cotes et ses joueurs.
 *
 * Tout est piloté par une progression de 0 à 1, lue à chaque image dans
 * `getProgress` (la position de défilement dans la section).
 */

export type PlanLabels = { length: string; width: string; service: string; players: string[] };

export type PadelSceneOptions = {
  canvas: HTMLCanvasElement;
  overlay: SVGSVGElement | null;
  quality: Quality;
  fonts: SceneFonts;
  brand: string;
  labels: PlanLabels;
  /** Portrait : le plan final est tourné d'un quart de tour. */
  getProgress: () => number;
  onFrame?: (p: number) => void;
  onContextLost?: () => void;
};

export type PadelScene = {
  start(): void;
  stop(): void;
  resize(): void;
  setPointer(x: number, y: number): void;
  /** Allège le rendu quand l'appareil peine : définition 1x, ombres moins fréquentes. */
  degrade(): void;
  dispose(): void;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const remap = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const easeIn = (t: number) => t * t * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** Plan SVG du site (200 × 100, 1 unité = 10 cm) → monde, en mètres. */
const plan = (X: number, Y: number, y = 0) => v3(X / 10 - 10, y, Y / 10 - 5);

/** J1 sert, J2 au filet, J3 relance après la vitre, J4 au filet. */
export const PLAYERS = [plan(182, 78), plan(122, 26), plan(17, 27), plan(74, 74)];

/** Repères de la séquence, en progression. */
export const TIMELINE = {
  windUp: [0.12, 0.26] as const,
  drop: [0.18, 0.31] as const,
  swing: [0.26, 0.31] as const,
  follow: [0.31, 0.4] as const,
  flight: [0.31, 0.68] as const,
  plan: [0.76, 0.86] as const,
};

/** Orientation d'une raquette dont la tête pointe vers `head` et la face vers `face`. */
function orient(head: THREE.Vector3, face: THREE.Vector3) {
  const y = head.clone().normalize();
  const z = face.clone().sub(y.clone().multiplyScalar(face.dot(y))).normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

/** Pose de frappe : la tête balaie l'horizontale autour de la main (coup droit). */
function swingPose(phi: number) {
  const head = v3(Math.cos(phi), -0.12, Math.sin(phi));
  const face = v3(Math.sin(phi), 0.14, -Math.cos(phi));
  return orient(head, face);
}

type Key = { p: number; pos: THREE.Vector3; target: THREE.Vector3 };

/** Rend la main au navigateur entre deux étapes lourdes de l'initialisation. */
const pause = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/**
 * Construit la scène par étapes, en rendant la main au navigateur entre
 * chacune : la page reste fluide pendant le chargement de la 3D.
 */
export async function createPadelScene(opts: PadelSceneOptions): Promise<PadelScene> {
  const { canvas, quality } = opts;
  const high = quality === "high";

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: high,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, high ? 1.75 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  // Direction « épurée & nette » : plus de lumière, moins de contraste — un
  // rendu clair, posé, esprit studio/galerie.
  renderer.toneMappingExposure = 1.03;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  const PAPER = new THREE.Color(0xf4f6f9);
  scene.background = PAPER;
  scene.fog = new THREE.Fog(PAPER, 2, 8);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.8;
  await pause();

  // Lumière : ciel doux et généreux, une clé presque neutre qui porte une
  // ombre ample et légère, un contre-jour froid discret. L'ensemble reste
  // clair et peu contrasté (esprit galerie).
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd4ddea, 0.72));
  const key = new THREE.DirectionalLight(0xfff8f0, 1.15);
  key.position.set(7, 15, 9);
  key.castShadow = true;
  key.shadow.mapSize.set(high ? 2048 : 1024, high ? 2048 : 1024);
  key.shadow.radius = high ? 9 : 4;
  key.shadow.camera.left = -13;
  key.shadow.camera.right = 13;
  key.shadow.camera.top = 9;
  key.shadow.camera.bottom = -9;
  key.shadow.camera.near = 2;
  key.shadow.camera.far = 45;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xdce8ff, 0.6);
  rim.position.set(-9, 6, -11);
  scene.add(rim);

  // Objets.
  await pause();
  const turf = turfTexture(anisotropy, high ? 1 : 0.5);
  await pause();
  const textures = {
    face: faceTexture(opts.fonts, opts.brand, anisotropy),
    grip: gripTexture(anisotropy),
    ball: ballTexture(anisotropy),
    turf,
    fence: fenceTexture(anisotropy),
    net: netTexture(anisotropy),
  };
  await pause();
  const court = createCourt({ turfMap: textures.turf, fenceMap: textures.fence, netMap: textures.net, quality });
  scene.add(court.group);

  const { pivot: racket, sweetSpot } = createRacket({ faceMap: textures.face, gripMap: textures.grip, quality });
  scene.add(racket);
  const ball = createBall(textures.ball, quality);
  scene.add(ball);
  await pause();

  // La main du serveur, au fond du court, côté droit (J1).
  const HAND = v3(8.3, 1.28, 2.55);
  const REST = orient(v3(-0.2, 1, 0.19), v3(Math.cos(1.25), 0, Math.sin(1.25)));
  const PHI = { back: 0.85, contact: -1.19, follow: -2.75 };
  const BACK = swingPose(PHI.back);
  const CONTACT = swingPose(PHI.contact);
  const FOLLOW = swingPose(PHI.follow);

  // Point d'impact : le centre de la face, raquette en position de contact.
  racket.position.copy(HAND);
  racket.quaternion.copy(CONTACT);
  racket.updateMatrixWorld(true);
  const S = sweetSpot.getWorldPosition(new THREE.Vector3());

  // Trajectoire : service croisé, rebond, vitre du fond, retour en jeu (J3).
  const B = plan(62, 30, 0.034);
  const G = v3(-9.93, 1.22, -3.3);
  const R = v3(PLAYERS[2].x + 0.35, 0.95, PLAYERS[2].z + 0.25);
  const mid = (a: THREE.Vector3, b: THREE.Vector3, lift: number) =>
    a.clone().add(b).multiplyScalar(0.5).add(v3(0, lift, 0));
  const legs = [
    { curve: new THREE.QuadraticBezierCurve3(S, mid(S, B, 3.1), B), weight: 0.52 },
    { curve: new THREE.QuadraticBezierCurve3(B, mid(B, G, 1.55), G), weight: 0.3 },
    { curve: new THREE.QuadraticBezierCurve3(G, mid(G, R, 0.4), R), weight: 0.18 },
  ];
  const ballAt = (u: number) => {
    let acc = 0;
    for (const leg of legs) {
      if (u <= acc + leg.weight || leg === legs[legs.length - 1]) {
        return leg.curve.getPoint(clamp01((u - acc) / leg.weight));
      }
      acc += leg.weight;
    }
    return R.clone();
  };

  // Tracé au sol, en tirets, qui se déroule derrière la balle.
  const samples: { pos: THREE.Vector3; u: number }[] = [];
  for (let i = 0; i <= 400; i++) {
    const u = i / 400;
    const q = ballAt(u);
    samples.push({ pos: v3(q.x, 0.014, q.z), u });
  }
  const DASH = 0.36;
  const dashes: { pos: THREE.Vector3; angle: number; u: number }[] = [];
  let run = 0;
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1].pos;
    const b = samples[i].pos;
    run += a.distanceTo(b);
    if (run >= DASH) {
      run = 0;
      dashes.push({ pos: b.clone(), angle: Math.atan2(-(b.z - a.z), b.x - a.x), u: samples[i].u });
    }
  }
  const dashMesh = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.2, 0.055),
    new THREE.MeshBasicMaterial({ color: 0xf4f7fb, transparent: true, opacity: 0.92 }),
    dashes.length
  );
  const m4 = new THREE.Matrix4();
  const flat = new THREE.Quaternion().setFromAxisAngle(v3(1, 0, 0), -Math.PI / 2);
  dashes.forEach((d, i) => {
    const heading = new THREE.Quaternion().setFromAxisAngle(v3(0, 1, 0), d.angle);
    m4.compose(d.pos, heading.multiply(flat), v3(1, 1, 1));
    dashMesh.setMatrixAt(i, m4);
  });
  dashMesh.count = 0;
  scene.add(dashMesh);

  // Marques d'impact : au sol, puis sur la vitre.
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xdff24a, side: THREE.DoubleSide });
  const ringEdge = new THREE.MeshBasicMaterial({ color: 0x0d1b2a, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
  const makeMark = () => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.RingGeometry(0.2, 0.27, 40), ringMat));
    g.add(new THREE.Mesh(new THREE.RingGeometry(0.27, 0.3, 40), ringEdge));
    g.scale.setScalar(0.001);
    return g;
  };
  const markFloor = makeMark();
  markFloor.rotation.x = -Math.PI / 2;
  markFloor.position.set(B.x, 0.018, B.z);
  scene.add(markFloor);
  const markGlass = makeMark();
  markGlass.rotation.y = Math.PI / 2;
  markGlass.position.set(G.x + 0.04, G.y, G.z);
  scene.add(markGlass);
  const floorHitU = legs[0].weight;
  const glassHitU = legs[0].weight + legs[1].weight;

  // Joueurs sur le plan final.
  const playerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
  const playerRings = PLAYERS.map((pt) => {
    const r = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.38, 48), playerMat);
    r.rotation.x = -Math.PI / 2;
    r.position.set(pt.x, 0.02, pt.z);
    scene.add(r);
    return r;
  });

  // Caméra.
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400);
  let keys: Key[] = [];
  let finalUp = v3(0, 0, -1);
  let portrait = false;

  const buildKeys = (aspect: number) => {
    portrait = aspect < 0.9;
    const head = HAND.clone().add(v3(0, 0.24, 0));
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    let final: Key;
    if (!portrait) {
      // Court à l'horizontale, décalé à droite : la légende occupe le bas
      // gauche (30 % de la largeur) et la cote de largeur tient à droite.
      const half = 16.2;
      const d = Math.max(half / (t * aspect), 7.4 / t);
      const shift = 10 - 0.4 * half;
      finalUp = v3(0, 0, -1);
      final = { p: 0.86, pos: v3(-shift, d, 0.001), target: v3(-shift, 0, 0) };
    } else {
      // Court à la verticale, remonté au-dessus de la légende.
      const d = Math.max(7.6 / (t * aspect), 15.6 / t);
      finalUp = v3(-1, 0, 0);
      final = { p: 0.86, pos: v3(3.5, d, 0.001), target: v3(3.5, 0, 0) };
    }
    // Portrait : la raquette sous le texte d'accueil, centrée dans la largeur ;
    // puis, le texte parti, un léger recul la remonte au-dessus de la légende.
    const shot = portrait
      ? { pos: head.clone().add(v3(1.077, 0.12, 1.221)), target: head.clone().add(v3(-0.044, 0.17, 0.041)) }
      : { pos: head.clone().add(v3(0.84, 0.1, 0.88)), target: head.clone().add(v3(-0.11, -0.04, 0.1)) };
    keys = [
      { p: 0, ...shot },
      portrait
        ? {
            p: 0.14,
            pos: shot.pos.clone().add(v3(0.26, 0.06, 0.18)),
            target: shot.target.clone().add(v3(0.02, -0.12, -0.02)),
          }
        : {
            p: 0.14,
            pos: shot.pos.clone().add(v3(0.06, 0.02, -0.12)),
            target: shot.target.clone().add(v3(0.02, -0.03, -0.04)),
          },
      portrait
        ? { p: 0.29, pos: v3(9.75, 2.5, 3.4), target: v3(6.6, 0.85, 1.85) }
        : { p: 0.29, pos: v3(9.8, 2.25, 3.95), target: v3(5.6, 0.62, 1.25) },
      { p: 0.47, pos: v3(8.2, 6.4, 4.4), target: v3(-1.6, 0.3, -1.0) },
      { p: 0.66, pos: v3(3.4, 14, 5.2), target: v3(-1.0, 0, -0.4) },
      final,
      { ...final, p: 1 },
    ];
  };

  const posCurve = () => new THREE.CatmullRomCurve3(keys.map((k) => k.pos), false, "centripetal");
  const targetCurve = () => new THREE.CatmullRomCurve3(keys.map((k) => k.target), false, "centripetal");
  let posPath = posCurve();
  let targetPath = targetCurve();

  const keyParam = (p: number) => {
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i];
      const b = keys[i + 1];
      if (p <= b.p) {
        const local = remap(p, a.p, b.p);
        return (i + local) / (keys.length - 1);
      }
    }
    return 1;
  };

  // Cotes et repères du plan, dessinés en SVG par-dessus le canvas.
  const overlay = opts.overlay;
  const NS = "http://www.w3.org/2000/svg";
  type Cote = { line: SVGLineElement; t1: SVGLineElement; t2: SVGLineElement; text: SVGTextElement; a: THREE.Vector3; b: THREE.Vector3; at: THREE.Vector3 };
  const cotes: Cote[] = [];
  const playerTexts: SVGTextElement[] = [];
  if (overlay) {
    overlay.replaceChildren();
    const mk = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string>) => {
      const el = document.createElementNS(NS, tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      overlay.appendChild(el);
      return el;
    };
    const cote = (a: THREE.Vector3, b: THREE.Vector3, at: THREE.Vector3, label: string) => {
      const style = { stroke: "#526073", "stroke-width": "1" };
      const c: Cote = {
        line: mk("line", style),
        t1: mk("line", style),
        t2: mk("line", style),
        text: mk("text", { fill: "#526073", "font-size": "12", "text-anchor": "middle", "dominant-baseline": "middle", class: "font-mono" }),
        a,
        b,
        at,
      };
      c.text.textContent = label;
      cotes.push(c);
    };
    cote(v3(-10, 0, -5.9), v3(10, 0, -5.9), v3(0, 0, -6.6), opts.labels.length);
    cote(v3(10.9, 0, -5), v3(10.9, 0, 5), v3(11.8, 0, 0), opts.labels.width);
    cote(v3(0, 0, 5.9), v3(6.95, 0, 5.9), v3(3.475, 0, 6.6), opts.labels.service);
    PLAYERS.forEach((_, i) => {
      const t = mk("text", { fill: "#ffffff", "font-size": "12", "dominant-baseline": "middle", class: "font-mono" });
      t.textContent = opts.labels.players[i] ?? `J${i + 1}`;
      playerTexts.push(t);
    });
  }

  let width = 1;
  let height = 1;
  const toScreen = (v: THREE.Vector3) => {
    const n = v.clone().project(camera);
    return { x: ((n.x + 1) / 2) * width, y: ((1 - n.y) / 2) * height };
  };

  const updateOverlay = (amount: number) => {
    if (!overlay) return;
    overlay.style.opacity = amount.toFixed(3);
    if (amount <= 0) return;
    for (const c of cotes) {
      const a = toScreen(c.a);
      const b = toScreen(c.b);
      const at = toScreen(c.at);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const nx = (-dy / len) * 6;
      const ny = (dx / len) * 6;
      c.line.setAttribute("x1", a.x.toFixed(1));
      c.line.setAttribute("y1", a.y.toFixed(1));
      c.line.setAttribute("x2", b.x.toFixed(1));
      c.line.setAttribute("y2", b.y.toFixed(1));
      for (const [tick, q] of [
        [c.t1, a],
        [c.t2, b],
      ] as const) {
        tick.setAttribute("x1", (q.x - nx).toFixed(1));
        tick.setAttribute("y1", (q.y - ny).toFixed(1));
        tick.setAttribute("x2", (q.x + nx).toFixed(1));
        tick.setAttribute("y2", (q.y + ny).toFixed(1));
      }
      c.text.setAttribute("x", at.x.toFixed(1));
      c.text.setAttribute("y", at.y.toFixed(1));
    }
    PLAYERS.forEach((pt, i) => {
      const s = toScreen(v3(pt.x, 0, pt.z));
      playerTexts[i].setAttribute("x", (s.x + 14).toFixed(1));
      playerTexts[i].setAttribute("y", (s.y - 12).toFixed(1));
    });
  };

  // Mise à jour d'une image.
  const pointer = new THREE.Vector2();
  const upA = v3(0, 1, 0);
  const tmpUp = new THREE.Vector3();
  const update = (p: number, time: number) => {
    // Caméra.
    const param = keyParam(p);
    camera.position.copy(posPath.getPoint(param));
    const target = targetPath.getPoint(param);
    const upMix = smooth(remap(p, 0.6, 0.86));
    tmpUp.copy(upA).lerp(finalUp, upMix).normalize();
    camera.up.copy(tmpUp);
    camera.lookAt(target);

    // Brouillard : le court sort du papier à mesure que la caméra recule.
    const fog = scene.fog as THREE.Fog;
    const reveal = smooth(remap(p, 0.17, 0.58));
    fog.near = lerp(2.2, 80, reveal);
    fog.far = lerp(4.6, 260, reveal);

    // Raquette.
    const idle = 1 - smooth(remap(p, 0, 0.08));
    const handOffset = v3(0, 0, 0);
    let q: THREE.Quaternion;
    if (p < TIMELINE.windUp[0]) {
      q = REST.clone();
    } else if (p < TIMELINE.swing[0]) {
      q = REST.clone().slerp(BACK, easeInOut(remap(p, TIMELINE.windUp[0], TIMELINE.windUp[1])));
    } else if (p < TIMELINE.swing[1]) {
      q = BACK.clone().slerp(CONTACT, easeIn(remap(p, TIMELINE.swing[0], TIMELINE.swing[1])));
      handOffset.x = -0.12 * remap(p, TIMELINE.swing[0], TIMELINE.swing[1]);
    } else {
      const f = easeOut(remap(p, TIMELINE.follow[0], TIMELINE.follow[1]));
      q = CONTACT.clone().slerp(FOLLOW, f);
      handOffset.x = -0.12 - 0.1 * f;
    }
    if (idle > 0) {
      // Flottement d'attente volontairement discret : une présence vivante,
      // pas une agitation. Le pointeur n'incline la raquette que très peu.
      const wobble = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          (Math.sin(time * 0.6) * 0.028 + pointer.y * 0.1) * idle,
          (Math.sin(time * 0.4) * 0.085 + pointer.x * 0.2) * idle,
          Math.sin(time * 0.5) * 0.018 * idle
        )
      );
      q.premultiply(wobble);
      handOffset.y += Math.sin(time * 0.8) * 0.009 * idle;
    }
    racket.quaternion.copy(q);
    racket.position.copy(HAND).add(handOffset);

    // Balle.
    if (p < TIMELINE.drop[0]) {
      ball.visible = false;
    } else if (p < TIMELINE.flight[0]) {
      ball.visible = true;
      const d = easeIn(remap(p, TIMELINE.drop[0], TIMELINE.swing[1]));
      ball.position.copy(S).add(v3(0, lerp(0.9, 0, d), 0));
      ball.rotation.set(time * 0.4, time * 0.3, 0);
    } else {
      ball.visible = true;
      const u = remap(p, TIMELINE.flight[0], TIMELINE.flight[1]);
      ball.position.copy(ballAt(u));
      ball.rotation.set(u * 38, u * 12, 0);
    }

    // Tracé au sol et impacts.
    const u = remap(p, TIMELINE.flight[0], TIMELINE.flight[1]);
    let visible = 0;
    while (visible < dashes.length && dashes[visible].u <= u) visible++;
    dashMesh.count = visible;
    markFloor.scale.setScalar(Math.max(0.001, easeOut(remap(u, floorHitU, floorHitU + 0.08))));
    markGlass.scale.setScalar(Math.max(0.001, easeOut(remap(u, glassHitU, glassHitU + 0.08))));

    // Plan final : joueurs et cotes.
    const planAmount = smooth(remap(p, TIMELINE.plan[0], TIMELINE.plan[1]));
    playerMat.opacity = planAmount;
    for (const r of playerRings) r.visible = planAmount > 0.01;
    camera.updateMatrixWorld();
    updateOverlay(planAmount);
  };

  // Boucle.
  let raf = 0;
  let running = false;
  let current = clamp01(opts.getProgress());
  let lastTime = performance.now();
  let degraded = false;
  let frameCount = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    frameCount++;
    if (degraded && frameCount % 4 === 0) renderer.shadowMap.needsUpdate = true;
    const dt = Math.min(0.1, (now - lastTime) / 1000);
    lastTime = now;
    const target = clamp01(opts.getProgress());
    // Lissage plus long : la caméra glisse et rattrape le défilement en
    // douceur, sans à-coup — mouvement posé, haut de gamme.
    current += (target - current) * (1 - Math.exp(-dt * 5.5));
    if (Math.abs(target - current) < 0.0004) current = target;
    update(current, now / 1000);
    renderer.render(scene, camera);
    opts.onFrame?.(current);
  };

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(r.width));
    height = Math.max(1, Math.round(r.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    buildKeys(camera.aspect);
    posPath = posCurve();
    targetPath = targetCurve();
    if (overlay) {
      overlay.setAttribute("viewBox", `0 0 ${width} ${height}`);
      overlay.setAttribute("width", String(width));
      overlay.setAttribute("height", String(height));
    }
  };
  resize();

  const onLost = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    running = false;
    opts.onContextLost?.();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  // Shaders compilés hors du fil principal quand le pilote le permet
  // (KHR_parallel_shader_compile) : la première image ne fige plus la page.
  await pause();
  update(current, performance.now() / 1000);
  // Sans l'extension, three.js préviendrait dans la console et compilerait de
  // toute façon d'un bloc : autant le faire directement.
  if (renderer.extensions.has("KHR_parallel_shader_compile")) {
    try {
      await renderer.compileAsync(scene, camera);
    } catch {
      // Compilation au premier rendu.
    }
  } else {
    renderer.compile(scene, camera);
  }

  return {
    start() {
      if (running) return;
      running = true;
      lastTime = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    resize,
    setPointer(x: number, y: number) {
      pointer.set(x, y);
    },
    degrade() {
      if (degraded) return;
      degraded = true;
      renderer.setPixelRatio(Math.min(renderer.getPixelRatio(), 1));
      renderer.shadowMap.autoUpdate = false;
      renderer.shadowMap.needsUpdate = true;
      resize();
    },
    dispose() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onLost);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      Object.values(textures).forEach((t) => t.dispose());
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      overlay?.replaceChildren();
    },
  };
}
