"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class ReturnStatement extends __1.default.Statement {
    constructor(token, expression) {
        super();
        this.token = token;
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitReturnStatement(this);
    }
}
exports.ReturnStatement = ReturnStatement;
