import { vec2, vec3 } from "gl-matrix";

export interface ICarHandlingModel {
    updateModel(outPostionChange: vec3, outRotationChange: vec3, timePassed: number): void;
}