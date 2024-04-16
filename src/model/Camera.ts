import { vec3, mat4 } from "gl-matrix";

export class Camera {
    
    position: vec3;
    view: mat4;

    constructor(position: vec3) {
        this.position = position;
    }

    update() {
        this.view = mat4.create();
        mat4.lookAt(this.view, [0,0,0], [0,0,-1], [0,1,0])
    }

    get_view(): mat4 {
        return this.view;
    }
}