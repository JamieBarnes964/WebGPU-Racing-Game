import { mat4 } from "gl-matrix";

export interface RenderData {
    view_transform: mat4;
    model_transforms: Float32Array;
}