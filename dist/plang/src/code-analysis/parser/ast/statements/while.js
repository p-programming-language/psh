"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhileStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class WhileStatement extends __1.default.Statement {
    constructor(token, condition, body) {
        super();
        this.token = token;
        this.condition = condition;
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitWhileStatement(this);
    }
}
exports.WhileStatement = WhileStatement;
