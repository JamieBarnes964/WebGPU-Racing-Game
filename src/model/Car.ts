import { mat4, vec3 } from "gl-matrix";
import { ISceneObject } from "./interface/ISceneObject";
import { ICarHandlingModel } from "./interface/ICarHandlingModel";

export class Car implements ISceneObject {

    private position: vec3;
    private rotation: vec3;
    private handlingModel: ICarHandlingModel;

    private model: mat4;

    constructor(startPosition: vec3, startRotation: vec3, handlingModel: ICarHandlingModel) {
        this.position = startPosition;
        this.rotation = startRotation;
        this.handlingModel = handlingModel;
    }

    update(elapsedTime: number): void {
        this.model = mat4.create();

        var positionChange = vec3.create();
        var rotationChange = vec3.create();

        this.handlingModel.updateModel(positionChange, rotationChange, elapsedTime);
        
        vec3.add(this.position, this.position, positionChange);
        vec3.add(this.rotation, this.rotation, rotationChange);

        mat4.translate(this.model, this.model, this.position);
        mat4.rotateZ(this.model, this.model, this.rotation[2]);
    }

    get_model(): mat4 {
        return this.model;
    }

}