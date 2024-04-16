import { IUserInput, UserInputKey } from "./interface/IUserInput";

export class KeyboardInput implements IUserInput {
    
    private timeSource: () => number;
    private keyDownTime: Map<UserInputKey, number> = new Map();
    private keyPressDuration: Map<UserInputKey, number> = new Map();

    constructor(timeSource: () => number) {
        this.timeSource = timeSource;
    }

    KeyDown(key: UserInputKey) {
        if (!this.keyDownTime.has(key) || (this.keyDownTime.has(key) && this.keyDownTime.get(key) == -1))
            this.keyDownTime.set(key, this.timeSource());
    }

    KeyUp(key: UserInputKey) {
        const keyDownTime = this.keyDownTime.get(key) ?? -1;
        if (keyDownTime !== -1) {
            var keyDuration = this.keyPressDuration.get(key)
            this.keyPressDuration.set(key, (keyDuration ?? 0) + this.timeSource() - keyDownTime);
            this.keyDownTime.set(key, -1);
        }
    }

    GetPressedKeyDuration(key: UserInputKey): number {
        if (this.keyDownTime.has(key) && this.keyDownTime.get(key) != -1) {
            this.KeyUp(key);
            this.KeyDown(key);
        }

        const totalPressDuration = this.keyPressDuration.get(key) ?? 0;
        this.keyPressDuration.set(key, 0);

        return totalPressDuration;
    }

}