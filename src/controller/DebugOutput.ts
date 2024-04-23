export class DebugOutput {
    private static instance: DebugOutput;
    private static Label: HTMLLabelElement;
    private static metrics: Map<string, string> = new Map();
    
    public static set(Label: HTMLLabelElement) {
        DebugOutput.Label = Label;
    }
    
    public static log(metric: string, data: string): void {
        DebugOutput.metrics.set(metric, data);
        DebugOutput.update();
    }

    private static update(): void {
        if (!DebugOutput.Label) return;

        DebugOutput.Label.innerHTML = "";
        DebugOutput.metrics.forEach((value, key) => {
            DebugOutput.Label.innerHTML += `${key}: ${value}<br>`;
        });
    }
}