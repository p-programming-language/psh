"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassBodyStatement = void 0;
const block_1 = require("./block");
class ClassBodyStatement extends block_1.BlockStatement {
    accept(visitor) {
        return visitor.visitClassBodyStatement(this);
    }
}
exports.ClassBodyStatement = ClassBodyStatement;
