import { vec2, vec3 } from "gl-matrix";
import { IUserInput, UserInputKey } from "./interface/IUserInput";
import { ICarHandlingModel } from "./interface/ICarHandlingModel";
import { DebugOutput } from "../controller/DebugOutput";

export class BasicCarHandling implements ICarHandlingModel {

    private gameInput: IUserInput;

    private accelerationRate: number = 1.0 / 20;
    private decelerationRate: number = 2.0 / 20;
    private currentVelocity: vec3 = [0.0, 0.0, 0.0];

    private rotationAccelerationRate: number = 1.0 / 40;
    private rotationRate: number = 0.0;
    private rotationDecelerationRate: number = 0.5 / 40;
    private maxRotationRate: number = 0.1;
    private currentRotation: number = 0.0;

    private handBrakePulled: boolean = false;

    constructor(userInput: IUserInput) {
        this.gameInput = userInput;
    }

    /** Outputs the change in position and rotation vectors for the given time passed with respect to the underlying physics model. */
    updateModel(outPostionChange: vec3, outRotationChange: vec3, timePassed: number): void {
        var acceleration = this.gameInput.GetPressedKeyDuration(UserInputKey.Forward) * (this.accelerationRate) / 1000;
        var deceleration = this.gameInput.GetPressedKeyDuration(UserInputKey.Backward) * (this.decelerationRate) / 1000;
        const inputAcceleration = acceleration;
        const inputDeceleration = deceleration;

        var handbrakeJustPulled = !this.handBrakePulled && this.gameInput.GetPressedKeyDuration(UserInputKey.Handbrake) > 0;
        if (handbrakeJustPulled) 
            this.handBrakePulled = true;
        else if (this.handBrakePulled && this.gameInput.GetPressedKeyDuration(UserInputKey.Handbrake) == 0)
            this.handBrakePulled = false;

        DebugOutput.log("Handbrake Pulled", this.handBrakePulled.toString());

        if (!this.handBrakePulled) {
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
            var lateralFrictionVec: vec3 = [Math.min(Math.abs(lateralVelocityComponent), (timePassed * this.decelerationRate / (inputAcceleration + inputDeceleration > 0 ? 8 : 2)) / 1000), 0, 0];
            if (lateralVelocityComponent < 0) {
                vec3.scale(lateralFrictionVec, lateralFrictionVec, -1);
            }
            vec3.rotateZ(lateralFrictionVec, lateralFrictionVec, vec3.create(), this.currentRotation);
            vec3.sub(this.currentVelocity, this.currentVelocity, lateralFrictionVec);
        } else {
            // Handbrake friction (sliding)
            var handbrakeFrictionVec: vec3 = vec3.create();
            vec3.normalize(handbrakeFrictionVec, this.currentVelocity);
            vec3.scale(handbrakeFrictionVec, handbrakeFrictionVec, Math.min(timePassed * this.decelerationRate / (12 * 300), vec3.len(this.currentVelocity)));
            vec3.sub(this.currentVelocity, this.currentVelocity, handbrakeFrictionVec);
        }

        // Update Output Vectors
        vec3.add(outPostionChange, outPostionChange, this.currentVelocity);

        // Rotation
        if (handbrakeJustPulled) this.rotationRate *= 1.5;
        this.rotationRate += (this.gameInput.GetPressedKeyDuration(UserInputKey.Left) - this.gameInput.GetPressedKeyDuration(UserInputKey.Right)) * this.rotationAccelerationRate / 1000;

        if (handbrakeJustPulled) console.log(`${handbrakeJustPulled} ${this.handBrakePulled}`);

        var maxRotationRate = this.maxRotationRate * vec3.length(this.currentVelocity) * (inputAcceleration > 0 ? 2 : 1) * 5;
        this.rotationRate = Math.min(Math.max(this.rotationRate, -maxRotationRate), maxRotationRate);
        DebugOutput.log("Rotation Rate % of Max", ((this.rotationRate / maxRotationRate) * 100).toFixed(1).toString());

        // Rotation Friction
        var rotationFriction = Math.min(Math.abs(this.rotationRate), timePassed * this.rotationDecelerationRate / 1000);
        if (this.rotationRate < 0) {
            rotationFriction *= -1;
        }
        this.rotationRate -= rotationFriction;

        this.currentRotation += this.rotationRate;

        outRotationChange[2] = this.rotationRate;
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