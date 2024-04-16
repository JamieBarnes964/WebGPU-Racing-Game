import { mat4 } from "gl-matrix";

export interface ISceneObject {
    update(elapsedTime: number): void;
    get_model(): mat4;
}