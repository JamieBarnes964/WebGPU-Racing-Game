import { vec2, vec3 } from "gl-matrix";
import { IUserInput, UserInputKey } from "./interface/IUserInput";
import { ICarHandlingModel } from "./interface/ICarHandlingModel";

export class BasicCarHandling implements ICarHandlingModel {

    private gameInput: IUserInput;

    private accelerationRate: number = 1.0 / 20;
    private decelerationRate: number = 2.0 / 20;
    private currentVelocity: vec3 = [0.0, 0.0, 0.0];

    private rotationRate: number = 1.0 / 20;
    private currentRotation: number = 0.0;

    constructor(userInput: IUserInput) {
        this.gameInput = userInput;
    }

    /** Outputs the change in position and rotation vectors for the given time passed with respect to the underlying physics model. */
    updateModel(outPostionChange: vec3, outRotationChange: vec3, timePassed: number): void {
        var acceleration = this.gameInput.GetPressedKeyDuration(UserInputKey.Forward) * (this.accelerationRate) / 1000;
        var deceleration = this.gameInput.GetPressedKeyDuration(UserInputKey.Backward) * (this.decelerationRate) / 1000;

        // Idle Deceleration
        if (acceleration === 0 && deceleration === 0) {
            if (this.get_forward_speed() > 0)
                deceleration = Math.min(timePassed * this.decelerationRate / 10000, this.get_forward_speed());
            else 
                acceleration = Math.min(timePassed * this.accelerationRate / 10000, -this.get_forward_speed());
        }

        // Acceleration
        var changeVec: vec3 = [0, (acceleration > deceleration || this.get_forward_speed() > 0 ? 1: -1), 0];
        vec3.rotateZ(changeVec, changeVec, vec3.create(), this.currentRotation);
        vec3.scale(changeVec, changeVec, acceleration - deceleration);
        vec3.add(this.currentVelocity, this.currentVelocity, changeVec);

        // Lateral Friction
        var lateralVelocityComponent = this.get_lateral_speed();
        var lateralFrictionVec: vec3 = [Math.min(Math.abs(lateralVelocityComponent), (timePassed * this.decelerationRate / (acceleration + deceleration > 0 ? 8 : 1)) / 300), 0, 0];
        if (lateralVelocityComponent < 0) {
            vec3.scale(lateralFrictionVec, lateralFrictionVec, -1);
        }
        vec3.rotateZ(lateralFrictionVec, lateralFrictionVec, vec3.create(), this.currentRotation);
        vec3.sub(this.currentVelocity, this.currentVelocity, lateralFrictionVec);


        vec3.add(outPostionChange, outPostionChange, this.currentVelocity);

        var rotationChange = (this.gameInput.GetPressedKeyDuration(UserInputKey.Left) - this.gameInput.GetPressedKeyDuration(UserInputKey.Right)) * this.rotationRate * (1 / (Math.max(Math.abs(vec3.len(this.currentVelocity)) / 4, 0.02))) / 1000;
        this.currentRotation += rotationChange;

        outRotationChange[2] = rotationChange;
    }

    /** Gets the forward speed in relation to the car's rotation. */
    private get_forward_speed(): number {
        var forwardVec: vec3 = [0, 1, 0];
        vec3.rotateZ(forwardVec, forwardVec, vec3.create(), this.currentRotation);
        return vec3.dot(forwardVec, this.currentVelocity) / vec3.len(forwardVec);
    }

    /** Gets the lateral speed in relation to the car's rotation. */
    private get_lateral_speed(): number {
        var lateralVec: vec3 = [1, 0, 0];
        vec3.rotateZ(lateralVec, lateralVec, vec3.create(), this.currentRotation);
        return vec3.dot(lateralVec, this.currentVelocity) / vec3.len(lateralVec);
    }
}