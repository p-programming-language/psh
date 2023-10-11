"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnaryExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class UnaryExpression extends __1.default.Expression {
    constructor(operator, operand) {
        super();
        this.operator = operator;
        this.operand = operand;
    }
    accept(visitor) {
        return visitor.visitUnaryExpression(this);
    }
    get token() {
        return this.operator;
    }
}
exports.UnaryExpression = UnaryExpression;
