import * as THREE from "three";
import {
  FACE_DEPTH,
  HANDLE_LENGTH,
  HANDLE_RADIUS,
  HOLE_RADIUS,
  OUTLINE,
  THROAT,
  THROAT_BOTTOM,
  holeCenters,
  type Contour,
} from "@/lib/racket-geometry";

export type Quality = "high" | "low";

/** Position de la main sur le manche, origine du pivot de frappe. */
export const HAND_Y = THROAT_BOTTOM - HANDLE_LENGTH * 0.55;

function trace(c: Contour, target: THREE.Shape | THREE.Path) {
  target.moveTo(c.from.x, c.from.y);
  for (const s of c.segments) target.bezierCurveTo(s.c1.x, s.c1.y, s.c2.x, s.c2.y, s.to.x, s.to.y);
}

/**
 * Le dos du tamis reprend la face avant : on miroite ses coordonnées de
 * texture pour que la marque se lise aussi de ce côté.
 */
function mirrorBackFace(geo: THREE.ExtrudeGeometry) {
  const cap = geo.groups.find((g) => g.materialIndex === 0);
  if (!cap) return;
  const normal = geo.getAttribute("normal");
  const uv = geo.getAttribute("uv");
  for (let i = cap.start; i < cap.start + cap.count; i++) {
    if (normal.getZ(i) < -0.5) uv.setX(i, -uv.getX(i));
  }
  uv.needsUpdate = true;
}

export function createRacket({
  faceMap,
  gripMap,
  quality,
}: {
  faceMap: THREE.Texture;
  gripMap: THREE.Texture;
  quality: Quality;
}) {
  const model = new THREE.Group();

  // Tamis : contour extrudé, gorge et perforations comprises.
  const shape = new THREE.Shape();
  trace(OUTLINE, shape);
  const throat = new THREE.Path();
  trace(THROAT, throat);
  shape.holes.push(throat);
  for (const h of holeCenters()) {
    const hole = new THREE.Path();
    hole.absarc(h.x, h.y, HOLE_RADIUS, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }

  const bevel = 0.003;
  const depth = FACE_DEPTH - bevel * 2;
  const headGeo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: 0.0016,
    bevelSegments: quality === "high" ? 3 : 2,
    curveSegments: quality === "high" ? 18 : 9,
    steps: 1,
  });
  headGeo.translate(0, 0, -depth / 2);
  mirrorBackFace(headGeo);

  const faceMat = new THREE.MeshPhysicalMaterial({
    map: faceMap,
    roughness: 0.34,
    metalness: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.14,
  });
  const frameMat = new THREE.MeshPhysicalMaterial({
    color: 0x0d1b2a,
    roughness: 0.3,
    metalness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });
  const head = new THREE.Mesh(headGeo, [faceMat, frameMat]);
  head.castShadow = true;
  model.add(head);

  // Manche et surgrip.
  const gripMat = new THREE.MeshStandardMaterial({ map: gripMap, roughness: 0.82 });
  const grip = new THREE.Mesh(
    new THREE.CylinderGeometry(HANDLE_RADIUS, HANDLE_RADIUS * 1.04, HANDLE_LENGTH, quality === "high" ? 40 : 20),
    gripMat
  );
  grip.position.y = THROAT_BOTTOM + 0.004 - HANDLE_LENGTH / 2;
  grip.castShadow = true;
  model.add(grip);

  // Bague bleu gazon à la jonction gorge / manche.
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(HANDLE_RADIUS + 0.0006, 0.0028, 12, 48),
    new THREE.MeshPhysicalMaterial({ color: 0x1f55a8, roughness: 0.25, clearcoat: 1 })
  );
  collar.rotation.x = Math.PI / 2;
  collar.position.y = THROAT_BOTTOM - 0.002;
  model.add(collar);

  // Bouchon du manche.
  const gripBottom = grip.position.y - HANDLE_LENGTH / 2;
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.0215, 0.0205, 0.014, 40), frameMat);
  cap.position.y = gripBottom - 0.006;
  cap.castShadow = true;
  model.add(cap);

  // Dragonne : une boucle de cordon qui pend du bouchon.
  const yB = gripBottom - 0.013;
  const strap = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, yB, 0),
        new THREE.Vector3(0.016, yB - 0.03, 0.012),
        new THREE.Vector3(0.03, yB - 0.085, 0.004),
        new THREE.Vector3(0.006, yB - 0.122, -0.01),
        new THREE.Vector3(-0.022, yB - 0.09, -0.006),
        new THREE.Vector3(-0.012, yB - 0.035, 0.01),
        new THREE.Vector3(0, yB - 0.002, 0.002),
      ]),
      quality === "high" ? 96 : 48,
      0.0026,
      8,
      false
    ),
    new THREE.MeshStandardMaterial({ color: 0x17417f, roughness: 0.55 })
  );
  model.add(strap);

  // Repère du centre de la face avant : sert à placer la balle à l'impact.
  const sweetSpot = new THREE.Object3D();
  sweetSpot.position.set(0, 0.01, FACE_DEPTH / 2 + 0.034);
  model.add(sweetSpot);

  // Le pivot est à la main : la frappe tourne autour du manche.
  model.position.y = -HAND_Y;
  const pivot = new THREE.Group();
  pivot.add(model);

  return { pivot, sweetSpot };
}

export function createBall(map: THREE.Texture, quality: Quality) {
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.0335, quality === "high" ? 40 : 24, quality === "high" ? 28 : 16),
    new THREE.MeshStandardMaterial({ map, roughness: 0.92 })
  );
  ball.castShadow = true;
  return ball;
}
