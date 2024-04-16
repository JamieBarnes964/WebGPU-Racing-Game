export enum UserInputKey {
    Forward,
    Backward,
    Right,
    Left,
}

export interface IUserInput {
    GetPressedKeyDuration(key: UserInputKey): number;
    KeyDown(key: UserInputKey): void;
    KeyUp(key: UserInputKey): void;
}