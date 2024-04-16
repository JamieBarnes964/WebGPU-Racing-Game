import { Camera } from "./Camera";
import { RenderData } from "./definitions";
import { Car } from "./Car";
import { BasicCarHandling } from "./BasicCarHandling";
import { ICarHandlingModel } from "./interface/ICarHandlingModel";
import { IUserInput, UserInputKey } from "./interface/IUserInput";
import { KeyboardInput } from "./KeyboardInput";

export class Scene {

    keyInputHandler: IUserInput;
    playerHandlingModel: ICarHandlingModel;
    playerCar: Car;
    object_data: Float32Array;
    camera: Camera;

    constructor() {
        this.object_data = new Float32Array(16 * 1024);

        this.keyInputHandler = new KeyboardInput(() => Date.now());
        this.playerHandlingModel = new BasicCarHandling(this.keyInputHandler);
        this.playerCar = new Car([0,0,0], [0,0,0], this.playerHandlingModel)

        this.camera = new Camera(
            [0, 0, 0]
        );
    }

    update(elapsedTime: number) {
        this.playerCar.update(elapsedTime);
        var model = this.playerCar.get_model();
        for (var j: number = 0; j < 16; j++) {
            this.object_data[j] = <number>model.at(j);
        }

        this.camera.update();
    }

    get_player(): Camera {
        return this.camera;
    }
    
    get_renderables(): RenderData {
        return {
            view_transform: this.camera.get_view(),
            model_transforms: this.object_data,
        };
    }

    handle_keypress(inputKey: UserInputKey) {
        this.keyInputHandler.KeyDown(inputKey);
    }

    handle_keyrelease(inputKey: UserInputKey) {
        this.keyInputHandler.KeyUp(inputKey);
    }
}