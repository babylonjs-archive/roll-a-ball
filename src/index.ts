import HavokPhysics from "@babylonjs/havok";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight.js";
import { Engine } from "@babylonjs/core/Engines/engine.js";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin.js";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
import { Scene } from "@babylonjs/core";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";

import { Cube } from "./cube.js";
import { Ground } from "./ground.js";
import { Player } from "./player.js";

import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Physics/physicsEngineComponent";

const NUM_OF_CUBES = 10;
const GROUND_SIZE = 20;

window.addEventListener("DOMContentLoaded", async () => {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    const info = document.getElementById("info") as HTMLParagraphElement;
    if (!canvas) {
        throw new Error("gameCanvas not found");
    } else if (!info) {
        throw new Error("info not found");
    }
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    scene.ambientColor = Color3.White();

    const camera = new ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 3,
        25,
        Vector3.Zero(),
        scene
    );
    camera.setTarget(Vector3.Zero());
    camera.attachControl(engine.getRenderingCanvas(), true);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.name = "light";
    const dirLight = new DirectionalLight("dirLight", new Vector3(0, -1, -1), scene);
    dirLight.position = new Vector3(0, 20, 0);
    const shadows = new ShadowGenerator(1024, dirLight);
    shadows.useBlurExponentialShadowMap = true;
    shadows.setTransparencyShadow(true);

    const havokInstance = await HavokPhysics();
    const hk = new HavokPlugin(true, havokInstance);
    scene.enablePhysics(new Vector3(0, -9.8, 0), hk);

    const ground = new Ground(GROUND_SIZE, scene);
    ground.rotation.x = Math.PI / 2;

    const cubes: Cube[] = [];
    for (let i = 0; i < NUM_OF_CUBES; i++) {
        const cube = new Cube(0.35, shadows, scene);
        cube.position.y = 0.5;
        cube.rotation.x = Math.PI / 4;
        cube.rotation.z = Math.PI / 4;
        const max = GROUND_SIZE / 2 - 1.5;
        const min = -GROUND_SIZE / 2 + 1.5;
        cube.position.x = Math.random() * (max - min) + min;
        cube.position.z = Math.random() * (max - min) + min;
        cubes.push(cube);
    }

    const player = new Player(1, shadows, scene);
    player.position = new Vector3(0, 1, 0);

    scene.registerBeforeRender(() => {
        let idx;
        cubes.forEach(((cube, i) => {
            if (cube.intersectsMesh(player)) {
                cube.dispose();
                idx = i;
            }
        }));
        if (idx !== undefined) {
            cubes.splice(idx, 1);
        }
        info.innerText = `Cubes left: ${cubes.length}`;
    });

    engine.runRenderLoop(() => {
        scene.render();
    });
});
