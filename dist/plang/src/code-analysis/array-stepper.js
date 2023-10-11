"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayStepper {
    constructor(input) {
        this.input = input;
        this.position = 0;
    }
    peek(offset = 1) {
        const peekPosition = this.position + offset;
        return peekPosition + 1 > this.input.length ? undefined : this.input[peekPosition];
    }
    get isFinished() {
        return this.position + 1 > this.input.length;
    }
    get current() {
        return this.peek(0);
    }
}
exports.default = ArrayStepper;
