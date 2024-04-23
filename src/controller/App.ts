import { Renderer } from "../view/Renderer";
import { Scene } from "../model/Scene";
import $ from "jquery";
import { UserInputKey } from "../model/interface/IUserInput";
import { DebugOutput } from "./DebugOutput";

export class App {
    
    canvas: HTMLCanvasElement;
    renderer: Renderer;
    scene: Scene;

    keyLabel: HTMLElement;
    mouseXLabel: HTMLElement;
    mouseYLabel: HTMLElement;

    lastFrameEndTime: number = 0;

    keyInputMap: Map<string, UserInputKey> = new Map([
        ["KeyW", UserInputKey.Forward],
        ["KeyS", UserInputKey.Backward],
        ["KeyA", UserInputKey.Left],
        ["KeyD", UserInputKey.Right],
        ["Space", UserInputKey.Handbrake]
    ]);

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);

        this.scene = new Scene();

        $(document).on("keydown", (event) => {this.handle_keypress(event)});
        $(document).on("keyup", (event) => {this.handle_keyrelease(event)});
    }

    async initialise() {
        await this.renderer.Initialize();
        this.lastFrameEndTime = Date.now();
    }

    run = () => {
        var running: boolean = true;

        DebugOutput.log("FPS", (1000 / (Date.now() - this.lastFrameEndTime)).toFixed(1).toString());
        this.scene.update(Date.now() - this.lastFrameEndTime);

        this.renderer.render(
            this.scene.get_renderables()
        );

        this.lastFrameEndTime = Date.now();

        if (running) {
            requestAnimationFrame(this.run);
        }
    }

    handle_keypress(event: JQuery.KeyDownEvent) {
        if (this.keyInputMap.has(event.code)) {
            this.scene.handle_keypress(<UserInputKey>this.keyInputMap.get(event.code));
        }
    }

    handle_keyrelease(event: JQuery.KeyUpEvent) {
        if (this.keyInputMap.has(event.code)) {
            this.scene.handle_keyrelease(<UserInputKey>this.keyInputMap.get(event.code));
        }
    }
}