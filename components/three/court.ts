import * as THREE from "three";
import type { Quality } from "./racket";

/**
 * Court de padel réglementaire, en mètres : 20 × 10, filet au centre (88 cm
 * au milieu, 92 cm aux poteaux), vitres de 3 m aux deux fonds et sur les quatre
 * premiers mètres des côtés, grillage au milieu des côtés.
 * Axe x : la longueur (filet en x = 0). Axe z : la largeur.
 */
export function createCourt({
  turfMap,
  fenceMap,
  netMap,
  quality,
}: {
  turfMap: THREE.Texture;
  fenceMap: THREE.Texture;
  netMap: THREE.Texture;
  quality: Quality;
}) {
  const group = new THREE.Group();

  // Abords du court, à peine plus sombres que le papier de la page.
  const apron = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 26),
    new THREE.MeshStandardMaterial({ color: 0xe1e8f0, roughness: 1 })
  );
  apron.rotation.x = -Math.PI / 2;
  apron.position.y = -0.004;
  apron.receiveShadow = true;
  group.add(apron);

  const turf = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 10),
    new THREE.MeshStandardMaterial({ map: turfMap, roughness: 0.92 })
  );
  turf.rotation.x = -Math.PI / 2;
  turf.receiveShadow = true;
  group.add(turf);

  // Vitres.
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe4f2ff,
    transparent: true,
    opacity: 0.16,
    roughness: 0.06,
    metalness: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
    envMapIntensity: 1.6,
  });
  for (const sx of [-1, 1]) {
    const back = new THREE.Mesh(new THREE.PlaneGeometry(10, 3), glassMat);
    back.position.set(sx * 10, 1.5, 0);
    back.rotation.y = Math.PI / 2;
    group.add(back);
    for (const sz of [-1, 1]) {
      const side = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), glassMat);
      side.position.set(sx * 8, 1.5, sz * 5);
      group.add(side);
    }
  }

  // Grillage du milieu des côtés.
  fenceMap.repeat.set(12 / 0.4, 3 / 0.4);
  const fenceMat = new THREE.MeshStandardMaterial({
    map: fenceMap,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    roughness: 0.8,
    metalness: 0.3,
  });
  for (const sz of [-1, 1]) {
    const fence = new THREE.Mesh(new THREE.PlaneGeometry(12, 3), fenceMat);
    fence.position.set(0, 1.5, sz * 5);
    group.add(fence);
  }

  // Montants et lisses en acier.
  const steel = new THREE.MeshStandardMaterial({ color: 0x0d1b2a, roughness: 0.45, metalness: 0.5 });
  const post = new THREE.BoxGeometry(0.07, 3.04, 0.07);
  const addPost = (x: number, z: number) => {
    const m = new THREE.Mesh(post, steel);
    m.position.set(x, 1.52, z);
    m.castShadow = quality === "high";
    group.add(m);
  };
  for (const sx of [-1, 1]) {
    for (const z of [-5, -3, -1, 1, 3, 5]) addPost(sx * 10, z);
    for (const x of [8, 6, 3]) {
      addPost(sx * x, -5);
      addPost(sx * x, 5);
    }
  }
  addPost(0, -5);
  addPost(0, 5);
  const railSide = new THREE.BoxGeometry(20, 0.05, 0.05);
  const railBack = new THREE.BoxGeometry(0.05, 0.05, 10);
  for (const sz of [-1, 1]) {
    const r = new THREE.Mesh(railSide, steel);
    r.position.set(0, 3.04, sz * 5);
    group.add(r);
  }
  for (const sx of [-1, 1]) {
    const r = new THREE.Mesh(railBack, steel);
    r.position.set(sx * 10, 3.04, 0);
    group.add(r);
  }

  // Filet et poteaux.
  netMap.repeat.set(10 / 0.25, 1);
  const net = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 0.9),
    new THREE.MeshStandardMaterial({
      map: netMap,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      roughness: 0.9,
    })
  );
  net.position.set(0, 0.45, 0);
  net.rotation.y = Math.PI / 2;
  group.add(net);
  const netPost = new THREE.CylinderGeometry(0.035, 0.035, 0.94, 16);
  for (const sz of [-1, 1]) {
    const m = new THREE.Mesh(netPost, steel);
    m.position.set(0, 0.47, sz * 5.05);
    group.add(m);
  }

  return { group };
}
