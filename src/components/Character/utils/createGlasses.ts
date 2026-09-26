import * as THREE from "three";

/**
 * Creates silver aviator/navigator wire glasses matching Mehul Singh's photo,
 * and attaches them along with diamond stud earrings directly to the character's head bone.
 */
export function addAccessoriesToCharacter(
  character: THREE.Object3D,
  headBone: THREE.Object3D | null
) {
  let eyesObj: THREE.Object3D | null = null;
  let earObj: THREE.Object3D | null = null;
  let faceObj: THREE.Object3D | null = null;

  character.traverse((child) => {
    const cName = (child.name || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (cName.includes("eye") && !cName.includes("eyebrow")) {
      eyesObj = child;
    }
    if (cName.includes("ear")) {
      earObj = child;
    }
    if (cName === "plane007" || cName.includes("face")) {
      faceObj = child;
    }
  });

  character.updateMatrixWorld(true);

  // Compute reference bounding box for sizing and positioning
  const refObj = eyesObj || faceObj;
  if (!refObj) return;

  const box = new THREE.Box3().setFromObject(refObj);
  const center = new THREE.Vector3();
  box.getCenter(center);
  const size = new THREE.Vector3();
  box.getSize(size);

  // Frame and lens materials
  const frameMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#dedee4"), // sleek silver/chrome metallic wire
    metalness: 0.95,
    roughness: 0.18,
  });

  const lensMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#ffffff"),
    transparent: true,
    opacity: 0.22,
    roughness: 0.05,
    metalness: 0.08,
    clearcoat: 1.0,
  });

  const glassesGroup = new THREE.Group();
  glassesGroup.name = "MehulGlasses";

  // Dimensions based on face/eye scale
  const totalWidth = size.x > 0.5 ? size.x * 1.05 : 1.2;
  const lensWidth = totalWidth * 0.42;
  const lensHeight = lensWidth * 0.78;
  const lensSpacing = totalWidth * 0.28;
  const wireRadius = lensWidth * 0.038;

  function createLensRim(offsetX: number) {
    const rimGroup = new THREE.Group();
    const hw = lensWidth / 2;
    const hh = lensHeight / 2;
    const r = lensWidth * 0.18; // smooth rounded corners

    const shape = new THREE.Shape();
    shape.moveTo(-hw + r, -hh);
    shape.lineTo(hw - r, -hh);
    shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
    shape.lineTo(hw, hh - r);
    shape.quadraticCurveTo(hw, hh, hw - r, hh);
    shape.lineTo(-hw + r, hh);
    shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
    shape.lineTo(-hw, -hh + r);
    shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

    const points = shape.getPoints(32).map((p) => new THREE.Vector3(p.x, p.y, 0));
    points.push(points[0].clone());
    const curve = new THREE.CatmullRomCurve3(points, true);
    const tubeGeo = new THREE.TubeGeometry(curve, 36, wireRadius, 8, true);
    const rimMesh = new THREE.Mesh(tubeGeo, frameMat);
    rimGroup.add(rimMesh);

    // Glass lens
    const lensGeo = new THREE.ShapeGeometry(shape);
    const lensMesh = new THREE.Mesh(lensGeo, lensMat);
    rimGroup.add(lensMesh);

    rimGroup.position.x = offsetX;
    return rimGroup;
  }

  // Left & right wire rims
  glassesGroup.add(createLensRim(-lensSpacing));
  glassesGroup.add(createLensRim(lensSpacing));

  // Center nose bridge wire
  const bridgeCurve = new THREE.LineCurve3(
    new THREE.Vector3(-lensSpacing + lensWidth / 2, 0, 0),
    new THREE.Vector3(lensSpacing - lensWidth / 2, 0, 0)
  );
  glassesGroup.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(bridgeCurve, 8, wireRadius * 0.9, 8, false),
      frameMat
    )
  );

  // Top brow bar (aviator double-bridge style)
  const browCurve = new THREE.LineCurve3(
    new THREE.Vector3(-lensSpacing + lensWidth / 2 - 0.02, lensHeight / 2, 0),
    new THREE.Vector3(lensSpacing - lensWidth / 2 + 0.02, lensHeight / 2, 0)
  );
  glassesGroup.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(browCurve, 8, wireRadius * 0.85, 8, false),
      frameMat
    )
  );

  // Left & right temples (side arms extending back towards ears)
  const templeLength = totalWidth * 0.9;
  const leftTempleCurve = new THREE.LineCurve3(
    new THREE.Vector3(-lensSpacing - lensWidth / 2, lensHeight / 2 - 0.03, 0),
    new THREE.Vector3(-lensSpacing - lensWidth / 2 - 0.05, lensHeight / 2 - 0.03, -templeLength)
  );
  glassesGroup.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(leftTempleCurve, 10, wireRadius * 0.8, 8, false),
      frameMat
    )
  );

  const rightTempleCurve = new THREE.LineCurve3(
    new THREE.Vector3(lensSpacing + lensWidth / 2, lensHeight / 2 - 0.03, 0),
    new THREE.Vector3(lensSpacing + lensWidth / 2 + 0.05, lensHeight / 2 - 0.03, -templeLength)
  );
  glassesGroup.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(rightTempleCurve, 10, wireRadius * 0.8, 8, false),
      frameMat
    )
  );

  // Position glasses slightly in front of eyes
  const forwardZ = box.max.z + 0.04;
  const eyeY = eyesObj ? center.y : center.y + size.y * 0.15;
  glassesGroup.position.set(center.x, eyeY, forwardZ);

  // Attach to headBone so glasses naturally follow head tracking & animation
  if (headBone) {
    headBone.updateMatrixWorld(true);
    glassesGroup.applyMatrix4(headBone.matrixWorld.clone().invert());
    headBone.add(glassesGroup);
  } else {
    character.add(glassesGroup);
  }

  // Diamond stud earrings on earlobes
  if (earObj) {
    const earBox = new THREE.Box3().setFromObject(earObj);
    const earCenter = new THREE.Vector3();
    earBox.getCenter(earCenter);
    const earSize = new THREE.Vector3();
    earBox.getSize(earSize);

    const diamondMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ffffff"),
      metalness: 0.95,
      roughness: 0.1,
    });
    const studGeo = new THREE.OctahedronGeometry(earSize.y * 0.07, 1);

    const leftStud = new THREE.Mesh(studGeo, diamondMat);
    leftStud.position.set(earBox.min.x - 0.02, earBox.min.y + earSize.y * 0.28, earCenter.z);

    const rightStud = new THREE.Mesh(studGeo, diamondMat);
    rightStud.position.set(earBox.max.x + 0.02, earBox.min.y + earSize.y * 0.28, earCenter.z);

    if (headBone) {
      const inv = headBone.matrixWorld.clone().invert();
      leftStud.applyMatrix4(inv);
      rightStud.applyMatrix4(inv);
      headBone.add(leftStud);
      headBone.add(rightStud);
    } else {
      character.add(leftStud);
      character.add(rightStud);
    }
  }
}
