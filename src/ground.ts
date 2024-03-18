import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import { CreateBox, CreateBoxVertexData } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate.js";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
import type { Scene } from "@babylonjs/core/scene.js";
import type { TransformNode } from "@babylonjs/core/Meshes/transformNode.js";

export class Ground extends Mesh {
    physicsAggregates: PhysicsAggregate[] = [];

    constructor(size: number, scene?: Scene) {
        super("ground", scene);

        const vertexData = CreateBoxVertexData({
            width: size,
            height: size,
            depth: 0.05
        });
        vertexData.applyToMesh(this);

        const physicsAggregate = this.makeStaticAggregate(this, scene);
        this.physicsAggregates.push(physicsAggregate);

        const material = new StandardMaterial("groundMaterial", scene);
        material.diffuseColor = new Color3(0.25, 0.5, 1);
        material.specularColor = Color3.White();
        material.ambientColor = new Color3(0.1, 0, 0);
        this.material = material;

        this._makeWalls(size, material, scene);

        this.receiveShadows = true;
    }

    private _makeWalls(size: number, material: StandardMaterial, scene?: Scene) {
        const northWall = CreateBox("wall", {
            width: size,
            height: 1,
            depth: 1.5
        }, scene);
        northWall.position.y = -size / 2;
        northWall.material = material;
        const northWallPhysicsAggregate = this.makeStaticAggregate(northWall, scene);

        const southWall = CreateBox("wall", {
            width: size,
            height: 1,
            depth: 1.5
        }, scene);
        southWall.position.y = size / 2;
        southWall.material = material;
        const southWallPhysicsAggregate = this.makeStaticAggregate(southWall, scene);

        const eastWall = CreateBox("wall", {
            width: size - 1,
            height: 1,
            depth: 1.5
        }, scene);
        eastWall.rotation.z = Math.PI / 2;
        eastWall.position.x = 0.5 - size / 2;
        eastWall.material = material;
        const eastWallPhysicsAggregate = this.makeStaticAggregate(eastWall, scene);

        const westWall = CreateBox("wall", {
            width: size - 1,
            height: 1,
            depth: 1.5
        }, scene);
        westWall.rotation.z = Math.PI / 2;
        westWall.position.x = size / 2 - 0.5;
        westWall.material = material;
        const westWallPhysicsAggregate = this.makeStaticAggregate(westWall, scene);

        // Attach wall meshes to the root game object.
        northWall.parent = this;
        southWall.parent = this;
        westWall.parent = this;
        eastWall.parent = this;

        this.physicsAggregates.push(northWallPhysicsAggregate);
        this.physicsAggregates.push(southWallPhysicsAggregate);
        this.physicsAggregates.push(eastWallPhysicsAggregate);
        this.physicsAggregates.push(westWallPhysicsAggregate);
    }

    makeStaticAggregate(object: TransformNode, scene?: Scene) {
        return new PhysicsAggregate(object, PhysicsShapeType.BOX, {
            mass: 0,
            restitution: 0.9
        }, scene);
    }
}
