"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParenthesizedExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class ParenthesizedExpression extends __1.default.Expression {
    constructor(expression) {
        super();
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitParenthesizedExpression(this);
    }
    get token() {
        return this.expression.token;
    }
}
exports.ParenthesizedExpression = ParenthesizedExpression;
