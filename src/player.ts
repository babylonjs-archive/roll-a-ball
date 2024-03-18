import { Animation } from "@babylonjs/core/Animations/animation.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import { CreateSphereVertexData } from "@babylonjs/core/Meshes/Builders/sphereBuilder.js";
import { FresnelParameters } from "@babylonjs/core/Materials/fresnelParameters.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js"
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate.js";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import type { IAnimationKey } from "@babylonjs/core/Animations/animationKey.js";
import type { Scene } from "@babylonjs/core/scene.js";
import type { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator.js";

export class Player extends Mesh {
    physicsAggregate: PhysicsAggregate;
    direction: Vector3;

    constructor(diameter: number, shadows: ShadowGenerator, scene?: Scene) {
        super("cube", scene);

        const vertexData = CreateSphereVertexData({ diameter });
        vertexData.applyToMesh(this);

        const material = new StandardMaterial("player material", scene);

        material.diffuseColor = new Color3(0.3, 0, 0.8);
        material.emissiveColor = new Color3(0.3, 0, 0.8);
        material.alpha = 0.6;
        material.specularPower = 16;
        material.specularColor = new Color3(0.7, 0.7, 1);

        // Fresnel
        material.reflectionFresnelParameters = new FresnelParameters();

        material.emissiveFresnelParameters = new FresnelParameters();
        material.emissiveFresnelParameters.bias = 0.6;
        material.emissiveFresnelParameters.power = 4;
        material.emissiveFresnelParameters.leftColor = Color3.White();
        material.emissiveFresnelParameters.rightColor = Color3.Black();

        material.opacityFresnelParameters = new FresnelParameters();
        material.opacityFresnelParameters.leftColor = Color3.White();
        material.opacityFresnelParameters.rightColor = Color3.Black();

        this.material = material;
        shadows.getShadowMap()?.renderList?.push(this);

        this.physicsAggregate = new PhysicsAggregate(
            this,
            PhysicsShapeType.SPHERE,
            {
                mass: 5,
                friction: 0.9,
                restitution: 0.9
            },
            scene
        );

        this.direction = Vector3.Zero();

        window.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case "W":
                    this.direction = new Vector3(0, 0, -1);
                    break;
                case "A":
                    this.direction = new Vector3(1, 0, 0);
                    break;
                case "S":
                    this.direction = new Vector3(0, 0, 1);
                    break;
                case "D":
                    this.direction = new Vector3(-1, 0, 0);
                    break;
            }
        });
        window.addEventListener("keyup", () => {
            this.direction = Vector3.Zero();
        });

        // Move the player.
        this.getScene().registerBeforeRender(() => {
            this.physicsAggregate.body.applyImpulse(this.direction, this.position);
        });
    }
}
