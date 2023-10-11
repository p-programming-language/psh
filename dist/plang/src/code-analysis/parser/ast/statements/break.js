"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreakStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class BreakStatement extends __1.default.Statement {
    constructor(token) {
        super();
        this.token = token;
    }
    accept(visitor) {
        return visitor.visitBreakStatement(this);
    }
}
exports.BreakStatement = BreakStatement;
