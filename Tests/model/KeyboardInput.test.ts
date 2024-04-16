import { KeyboardInput } from "../../src/model/KeyboardInput"
import { UserInputKey } from "../../src/model/interface/IUserInput";

var mockTime: number = Date.now();

function mockTimeSource(): number {
    return mockTime;
}

describe("KeyboardInput", () => {

    test("GetPressedKeyDuration does not throw", () => {
        const keyboardInput = new KeyboardInput(mockTimeSource);
        expect(() => {
            keyboardInput.GetPressedKeyDuration(UserInputKey.Forward);
        }).not.toThrow();
    });

    test("GetPressedKeyDuration after init returns 0", () => {
        const keyboardInput = new KeyboardInput(mockTimeSource);
        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Forward)).toBe(0);
    });

    test("GetPressedKeyDuration 1 second after key down returns 1000", () => {
        const keyboardInput = new KeyboardInput(mockTimeSource);

        keyboardInput.KeyDown(UserInputKey.Forward);
        
        mockTime += 1000;

        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Forward)).toBe(1000);
    });

    test("GetPressedKeyDuration 1 second after key down and 1 second after key up returns 1000", () => {
        const keyboardInput = new KeyboardInput(mockTimeSource);

        keyboardInput.KeyDown(UserInputKey.Forward);
        
        mockTime += 1000;
        keyboardInput.KeyUp(UserInputKey.Forward);

        mockTime += 1000;

        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Forward)).toBe(1000);
    });

    test("GetPressedKeyDuration after 2x(key down => 1s => key up => 1s) returns 2000", () => {
        const keyboardInput = new KeyboardInput(mockTimeSource);

        keyboardInput.KeyDown(UserInputKey.Forward);
        mockTime += 1000;
        keyboardInput.KeyUp(UserInputKey.Forward);
        mockTime += 1000;

        keyboardInput.KeyDown(UserInputKey.Forward);
        mockTime += 1000;
        keyboardInput.KeyUp(UserInputKey.Forward);
        mockTime += 1000;

        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Forward)).toBe(2000);
    });

    test("GetPressedKeyDuration returns 0 on second call after 1 second after key down", () => {
        const keyboardInput = new KeyboardInput(mockTimeSource);

        keyboardInput.KeyDown(UserInputKey.Forward);
        mockTime += 1000;

        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Forward)).toBe(1000);
        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Forward)).toBe(0);
    });

    test("GetPressedKeyDuration 1 second first call after key down returns 1000", () => {
        const keyboardInput = new KeyboardInput(mockTimeSource);

        keyboardInput.KeyDown(UserInputKey.Forward);
        mockTime += 1000;

        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Forward)).toBe(1000);

        mockTime += 1000;

        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Forward)).toBe(1000);
    });

    test("GetPressedKeyDuration returns 0 1 second after first call after key down and key up", () => {
        const keyboardInput = new KeyboardInput(mockTimeSource);

        keyboardInput.KeyDown(UserInputKey.Forward);
        mockTime += 1000;
        keyboardInput.KeyUp(UserInputKey.Forward);

        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Forward)).toBe(1000);

        mockTime += 1000;

        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Forward)).toBe(0);
    });

    test("GetPressedKeyDuration KeyUp when no KeyDown", () => {
        const keyboardInput = new KeyboardInput(mockTimeSource);

        keyboardInput.KeyUp(UserInputKey.Forward);

        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Forward)).toBe(0);
    });

    test("GetPressedKeyDuration key down 1s key down 1s key up 1s returns 2000", () => {
        const keyboardInput = new KeyboardInput(mockTimeSource);

        keyboardInput.KeyDown(UserInputKey.Forward);
        mockTime += 1000;
        keyboardInput.KeyDown(UserInputKey.Forward);
        mockTime += 1000;
        keyboardInput.KeyUp(UserInputKey.Forward);
        mockTime += 1000;

        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Forward)).toBe(2000);
    });

    test("GetPressedKeyDuration 2 keys for 2s with 1s overlap both return 2s", () => {
        const keyboardInput = new KeyboardInput(mockTimeSource);

        keyboardInput.KeyDown(UserInputKey.Forward);

        mockTime += 1000;

        keyboardInput.KeyDown(UserInputKey.Backward);

        mockTime += 1000;

        keyboardInput.KeyUp(UserInputKey.Forward);

        mockTime += 1000;

        keyboardInput.KeyUp(UserInputKey.Backward);

        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Forward)).toBe(2000);
        expect(keyboardInput.GetPressedKeyDuration(UserInputKey.Backward)).toBe(2000);
    });
});

