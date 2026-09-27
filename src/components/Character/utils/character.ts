import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { addAccessoriesToCharacter } from "./createGlasses"; import { personaliseCharacter } from "./curlyHair";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        // Material definitions for character clothing and realistic skin tone matching Mehul's photo
        const skinMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#be7b52"), // warm natural South Asian tan skin tone matching photo
          roughness: 0.52,
          metalness: 0.04,
        });

        const shirtMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#181920"), // deep black coat from photo
          roughness: 0.85,
          metalness: 0.06,
        });

        const pantMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#14151a"), // tailored dark charcoal trousers
          roughness: 0.85,
          metalness: 0.05,
        });

        const shoeMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#f4f4f8"), // clean designer white sneakers
          roughness: 0.35,
          metalness: 0.1,
        });

        const soleMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#25262c"), // dark contrast sneaker sole
          roughness: 0.7,
          metalness: 0.1,
        });

        const hairMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#111012"), // natural dark espresso curls matching photo
          roughness: 0.48,
          metalness: 0.1,
        });

        const eyebrowMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#0c0c0e"), // defined dark eyebrows
          roughness: 0.5,
          metalness: 0.0,
        });

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;

            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;

                const rawName = child.name || "";
                const cleanName = rawName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

                if (cleanName.includes("shirt") || cleanName.includes("bodyshirt")) {
                  child.material = shirtMaterial.clone();
                } else if (cleanName.includes("pant")) {
                  child.material = pantMaterial.clone();
                } else if (cleanName.includes("shoe")) {
                  child.material = shoeMaterial.clone();
                } else if (cleanName.includes("sole")) {
                  child.material = soleMaterial.clone();
                } else if (
                  cleanName === "plane007" ||
                  cleanName.includes("face") ||
                  cleanName === "ear001" ||
                  cleanName.includes("ear") ||
                  cleanName === "neck" ||
                  cleanName === "hand" ||
                  cleanName.includes("hand")
                ) {
                  // Face, ears, neck, hands: warm realistic skin tone
                  child.material = skinMaterial.clone();
                } else if (cleanName.includes("hair")) {
                  child.material = hairMaterial.clone();
                } else if (cleanName.includes("eyebrow")) {
                  child.material = eyebrowMaterial.clone();
                }

                // Delete vertex colors so they don't force the mesh to appear chalk-white
                if (child.geometry && child.geometry.attributes && child.geometry.attributes.color) {
                  child.geometry.deleteAttribute("color");
                }
                if (child.material) {
                  child.material.vertexColors = false;
                  child.material.needsUpdate = true;
                }
              }
            });

            // Add silver aviator glasses and diamond studs matching photo
            const headBone =
              character.getObjectByName("spine006") ||
              character.getObjectByName("spine.006") ||
              null;
            addAccessoriesToCharacter(character, headBone); personaliseCharacter(character);

            // Compile shaders after all materials and accessories are mounted
            await renderer.compileAsync(character, camera, scene);

            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
