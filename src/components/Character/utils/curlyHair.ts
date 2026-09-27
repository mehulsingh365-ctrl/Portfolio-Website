import * as THREE from "three";
import { MeshSurfaceSampler } from "three-stdlib";
/**
 * Personalises the character: skin fade on the sides/back, curls on top with a
 * fringe over the forehead, and diamond studs on both earlobes.
 * Runs once after the model loads; the original model file is not modified.
 */
export function personaliseCharacter(c: THREE.Object3D) {
  c.updateMatrixWorld(true);
  addFade(c);
  addStuds(c);
  addCurls(c);
}
function addCurls(c: THREE.Object3D) {
  const hair = c.getObjectByName("hair") as THREE.Mesh | undefined;
  if (!hair || !hair.isMesh) return;
  const s = new THREE.Vector3(); hair.getWorldScale(s);
  const k = 1 / ((s.x + s.y + s.z) / 3); // world size -> hair-local size
  const inv = new THREE.Matrix4().copy(hair.matrixWorld).invert();
  const sampler = new MeshSurfaceSampler(hair).build();
  const p = new THREE.Vector3(), n = new THREE.Vector3(), wp = new THREE.Vector3(), wn = new THREE.Vector3();
  const nm = new THREE.Matrix3().getNormalMatrix(hair.matrixWorld);
  const box = new THREE.Box3().setFromObject(hair);
  const top = box.max.y, bottom = box.min.y, H = top - bottom;
  const torus = new THREE.TorusGeometry(1, 0.5, 6, 10);
  const blob = new THREE.IcosahedronGeometry(1, 1);
  const mat = new THREE.MeshStandardMaterial({ color: "#141214", roughness: 0.45, metalness: 0.08 });
  const COUNT = 4000;
  const tor = new THREE.InstancedMesh(torus, mat, COUNT), bl = new THREE.InstancedMesh(blob, mat, COUNT);
  tor.name = "hairCurls"; bl.name = "hairCurlVolume";
  let ti = 0, bi = 0, seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const q = new THREE.Quaternion(), e = new THREE.Euler(), M = new THREE.Matrix4(), sc = new THREE.Vector3();
  for (let tries = 0; tries < 40000 && ti < COUNT - 700; tries++) {
    sampler.sample(p, n);
    wp.copy(p).applyMatrix4(hair.matrixWorld); wn.copy(n).applyMatrix3(nm).normalize();
    if (wn.y < -0.35) continue;                       // skip underside
    const h = (wp.y - bottom) / H;                    // 0 = bottom, 1 = top of hair
    const isFront = wp.z > 0.35 && wn.z > 0.2;        // forehead hairline
    const side = Math.abs(wn.x) > 0.6;
    if (wn.z < -0.35 && h < 0.6) continue;            // back is faded
    if (side && h < 0.6) continue;                    // sides are faded
    if (isFront && h < 0.5) continue;                 // keep the forehead / temples clear
    if (wp.z > 0.2 && Math.abs(wp.x) > 0.8 && h < 0.72) continue;
    // density & size: full on top, smaller and tighter towards the fade and hairline
    const t = Math.min(Math.max((h - 0.55) / 0.25, 0), 1);
    const vol = isFront ? 0.75 + 0.25 * t : 0.3 + 0.7 * t;
    if (rnd() > 0.35 + 0.65 * vol) continue;
    const r = (0.045 + 0.035 * rnd()) * (0.7 + 0.45 * vol);
    // sit on the scalp: small push out, a little more on the crown for volume
    const lift = r * (0.05 + (wn.y > 0.5 ? 0.9 : 0.35) * vol);
    wp.addScaledVector(wn, lift);
    const lp = wp.clone().applyMatrix4(inv);
    e.set(rnd() * Math.PI * 2, rnd() * Math.PI * 2, rnd() * Math.PI * 2); q.setFromEuler(e);
    sc.setScalar(r * k); M.compose(lp, q, sc); tor.setMatrixAt(ti++, M);
    if (bi < COUNT && rnd() < 0.7) {    // filler blobs so curls read as a dense mass
      wp.addScaledVector(wn, -r * 0.9); const lb = wp.applyMatrix4(inv);
      sc.setScalar(r * 1.05 * k); M.compose(lb, q, sc); bl.setMatrixAt(bi++, M);
    }
  }
  // Hairline fringe: find the lowest front hair point in thin vertical slices and
  // lay a dense row of curls along it, nudged down/forward so it overlaps the forehead.
  const bins = new Map<number, { p: THREE.Vector3; n: THREE.Vector3 }>();
  for (let k2 = 0; k2 < 30000; k2++) {
    sampler.sample(p, n);
    wp.copy(p).applyMatrix4(hair.matrixWorld); wn.copy(n).applyMatrix3(nm).normalize();
    if (wn.z < 0.25 || wp.z < 0.3) continue;
    const key = Math.round(wp.x / 0.06);
    const cur = bins.get(key);
    if (!cur || wp.y < cur.p.y) bins.set(key, { p: wp.clone(), n: wn.clone() });
  }
  for (const { p: hp, n: hn } of bins.values()) {
    if (Math.abs(hp.x) > 0.85) continue;
    for (let row = 0; row < 3 && ti < COUNT; row++) {
      const r = 0.05 + 0.03 * rnd();
      const pos2 = hp.clone()
        .add(new THREE.Vector3((rnd() - 0.5) * 0.05, 0.03 - row * 0.055, 0.02 + row * 0.012))
        .addScaledVector(hn, r * 0.35);
      e.set(rnd() * 6.28, rnd() * 6.28, rnd() * 6.28); q.setFromEuler(e);
      sc.setScalar(r * k); M.compose(pos2.applyMatrix4(inv), q, sc); tor.setMatrixAt(ti++, M);
    }
  }
  // Fringe ringlets: curly strands falling from the hairline over the forehead.
  // Each strand is a short chain of coils that follows the forehead surface.
  const face = c.getObjectByName("Plane007") as THREE.SkinnedMesh | undefined;
  if (face && face.isSkinnedMesh) { face.computeBoundingBox(); face.computeBoundingSphere(); }
  const ray = new THREE.Raycaster();
  const onSkin = (x: number, y: number) => {
    if (!face) return null;
    ray.set(new THREE.Vector3(x, y, 5), new THREE.Vector3(0, 0, -1));
    const hit = ray.intersectObject(face, false)[0];
    return hit ? hit.point : null;
  };
  const keys = [...bins.keys()].sort((a2, b2) => a2 - b2);
  for (const key of keys) {
    const { p: hp } = bins.get(key)!;
    const ax = Math.abs(hp.x);
    if (ax > 0.62) continue;
    // longer strands towards the middle, a little asymmetric like a natural fringe
    const len = Math.round(2 + 3.2 * (1 - ax / 0.62) * (0.6 + 0.6 * rnd()) + (hp.x < 0 ? 0.6 : 0));
    let y = hp.y + 0.02, x = hp.x;
    for (let j = 0; j < len && ti < COUNT; j++) {
      const r = 0.055 - j * 0.005 + 0.012 * rnd();
      const skinP = onSkin(x, y);
      const zBase = skinP ? skinP.z : hp.z;
      const pos2 = new THREE.Vector3(x + Math.sin(j * 2.1 + key) * 0.025, y, zBase + r * 0.9 + 0.012);
      e.set(1.2 + (rnd() - 0.5) * 0.9, (rnd() - 0.5) * 0.8, rnd() * 6.28); q.setFromEuler(e);
      sc.setScalar(r * k); M.compose(pos2.applyMatrix4(inv), q, sc); tor.setMatrixAt(ti++, M);
      y -= r * 1.25; x += (rnd() - 0.5) * 0.03;
    }
  }
  tor.count = ti; bl.count = bi;
  [tor, bl].forEach((m) => { m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; hair.add(m); });
}

function addFade(c: THREE.Object3D) {
  // Turn the smooth base hair into a skin fade: tight to the head and skin-coloured
  // at the bottom of the sides/back, blending to dark near the top where the curls start.
  const hair = c.getObjectByName("hair") as THREE.Mesh | undefined;
  if (!hair || !hair.isMesh) return;
  hair.updateMatrixWorld(true);
  const g = hair.geometry, pos = g.attributes.position;
  const inv = new THREE.Matrix4().copy(hair.matrixWorld).invert();
  const box = new THREE.Box3().setFromObject(hair);
  const bottom = box.min.y, top = box.max.y, H = top - bottom;
  const ctr = box.getCenter(new THREE.Vector3());
  const skin = new THREE.Color("#b3724c"), stubble = new THREE.Color("#3a2a24"), dark = new THREE.Color("#121012");
  const col = new Float32Array(pos.count * 3), w = new THREE.Vector3(), cc = new THREE.Color();
  const ss = (a: number, b: number, x: number) => { const t = Math.min(Math.max((x - a) / (b - a), 0), 1); return t * t * (3 - 2 * t); };
  for (let i = 0; i < pos.count; i++) {
    w.fromBufferAttribute(pos, i).applyMatrix4(hair.matrixWorld);
    const h = (w.y - bottom) / H;
    // pull the lower sides/back in toward the head (short clipper length)
    const tight = 1 - ss(0.35, 0.72, h);
    const dx = w.x - ctr.x, dz = w.z - ctr.z;
    const shrink = 1 - 0.07 * tight;
    w.x = ctr.x + dx * shrink; w.z = ctr.z + dz * (dz < 0 ? shrink : 1);
    const lw = w.clone().applyMatrix4(inv); pos.setXYZ(i, lw.x, lw.y, lw.z);
    // colour: skin -> stubble -> dark
    const a = ss(0.08, 0.38, h), b = ss(0.38, 0.62, h);
    cc.copy(skin).lerp(stubble, a).lerp(dark, b);
    col.set([cc.r, cc.g, cc.b], i * 3);
  }
  pos.needsUpdate = true; g.computeVertexNormals();
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  hair.material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75, metalness: 0.02 });
}

function addStuds(c: THREE.Object3D) {
  // Diamond studs on both earlobes, attached to the head bone so they move with the head.
  const ear = c.getObjectByName("Ear001") as THREE.SkinnedMesh | undefined;
  const head = c.getObjectByName("spine006") || c.getObjectByName("hair");
  if (!ear || !ear.isSkinnedMesh || !head) return;
  ear.computeBoundingBox(); ear.computeBoundingSphere();
  c.updateMatrixWorld(true);
  const pos = ear.geometry.attributes.position, v = new THREE.Vector3();
  const sides: Record<string, THREE.Vector3[]> = { L: [], R: [] };
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i); ear.applyBoneTransform(i, v); v.applyMatrix4(ear.matrixWorld);
    (v.x < 0 ? sides.L : sides.R).push(v.clone());
  }
  const ray = new THREE.Raycaster();
  // Brilliant-cut diamond: faceted, mirror-like, with a rainbow "fire" (iridescence)
  const diamond = new THREE.MeshPhysicalMaterial({
    color: "#f4f8ff", metalness: 0.45, roughness: 0.06, flatShading: true,
    clearcoat: 1, clearcoatRoughness: 0, iridescence: 0.35, iridescenceIOR: 1.8,
    iridescenceThicknessRange: [200, 800], envMapIntensity: 1.8,
    emissive: "#e8eeff", emissiveIntensity: 0.18,
  });
  const setting = new THREE.MeshStandardMaterial({ color: "#e8e8ee", metalness: 1, roughness: 0.25, envMapIntensity: 1 });
  // brilliant-cut profile (table on top, crown, girdle, pointed pavilion), 8 facets around
  const cut = (r: number) => new THREE.LatheGeometry([
    new THREE.Vector2(0.0001, -0.95 * r), new THREE.Vector2(1.0 * r, -0.15 * r),
    new THREE.Vector2(1.0 * r, 0.0), new THREE.Vector2(0.62 * r, 0.42 * r),
    new THREE.Vector2(0.0001, 0.42 * r)], 8);
  for (const [side, pts] of Object.entries(sides)) {
    if (!pts.length) continue;
    const box = new THREE.Box3().setFromPoints(pts), size = box.getSize(new THREE.Vector3());
    // earlobe = lowest part of the ear; aim at its centre from the outer-front
    const lobeY = box.min.y + size.y * 0.2;
    const lobe = pts.filter((p) => p.y < lobeY);
    const ctr = lobe.reduce((a, p) => a.add(p), new THREE.Vector3()).multiplyScalar(1 / lobe.length);
    const sx = side === "L" ? -1 : 1;
    const dir = new THREE.Vector3(sx * 0.8, 0, 0.75).normalize();
    ray.set(ctr.clone().addScaledVector(dir, 3), dir.clone().negate());
    const hit = ray.intersectObject(ear, false)[0];
    const at = hit ? hit.point : ctr.clone().addScaledVector(dir, size.x * 0.5);
    const nrm = dir.clone();
    const rad = size.y * 0.07;
    const g = new THREE.Group();
    const gem = new THREE.Mesh(cut(rad), diamond);
    gem.rotation.x = Math.PI / 2; gem.rotation.y = Math.PI / 8; gem.position.z = rad * 0.1;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(rad * 1.08, rad * 0.9, rad * 0.25, 16), setting);
    base.rotation.x = Math.PI / 2; base.position.z = -rad * 0.05;
    g.add(base, gem);
    g.position.copy(at).addScaledVector(nrm, rad * 0.3);
    g.lookAt(at.clone().addScaledVector(nrm, 2));
    g.name = "diamondStud" + side;
    g.updateMatrixWorld(true);
    head.attach(g);
  }
}
