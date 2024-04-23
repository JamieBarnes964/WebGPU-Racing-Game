import { App } from "./controller/App";
import { DebugOutput } from "./controller/DebugOutput";

const canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("gfx-main");
const debugText : HTMLLabelElement = <HTMLLabelElement> document.getElementById("debug_info");

DebugOutput.set(debugText);
const app = new App(canvas);
app.initialise().then(() => app.run());