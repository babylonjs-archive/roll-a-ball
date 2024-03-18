import { Animation } from "@babylonjs/core/Animations/animation.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import { CreateBoxVertexData } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
import type { IAnimationKey } from "@babylonjs/core/Animations/animationKey.js";
import { Scene } from "@babylonjs/core/scene.js";
import type { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator.js";

export class Cube extends Mesh {
    constructor(size: number, shadows: ShadowGenerator, scene?: Scene) {
        super("cube", scene);
        const vertexData = CreateBoxVertexData({ size });
        vertexData.applyToMesh(this);

        const material = new StandardMaterial("cubeMaterial", scene);
        material.emissiveColor = new Color3(0.7, 0, 0.5);
        material.specularColor = new Color3(0, 1, 0);

        this.material = material;
        shadows.getShadowMap()?.renderList?.push(this);

        const animation = new Animation("animCube", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

        const keys: IAnimationKey[] = [
            {
                frame: 0,
                value: 0
            },
            {
                frame: 30,
                value: Math.PI / 2
            },
            {
                frame: 60,
                value: Math.PI
            },
            {
                frame: 90,
                value: 3 * Math.PI / 2
            },
            {
                frame: 120,
                value: 2 * Math.PI
            }
        ];
        animation.setKeys(keys);

        this.animations.push(animation);
        scene?.beginAnimation(this, 0, 120, true, 1.0);
    }
}
