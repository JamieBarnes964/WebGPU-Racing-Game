export enum UserInputKey {
    Forward,
    Backward,
    Right,
    Left,
    Handbrake,
}

export interface IUserInput {
    GetPressedKeyDuration(key: UserInputKey): number;
    KeyDown(key: UserInputKey): void;
    KeyUp(key: UserInputKey): void;
}