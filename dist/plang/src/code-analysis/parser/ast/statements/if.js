"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class IfStatement extends __1.default.Statement {
    constructor(token, condition, body, elseBranch) {
        super();
        this.token = token;
        this.condition = condition;
        this.body = body;
        this.elseBranch = elseBranch;
    }
    accept(visitor) {
        return visitor.visitIfStatement(this);
    }
}
exports.IfStatement = IfStatement;
