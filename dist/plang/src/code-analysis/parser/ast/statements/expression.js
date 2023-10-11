"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class ExpressionStatement extends __1.default.Statement {
    constructor(expression) {
        super();
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitExpressionStatement(this);
    }
    get token() {
        return this.expression.token;
    }
}
exports.ExpressionStatement = ExpressionStatement;
