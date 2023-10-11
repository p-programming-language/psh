"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class BinaryExpression extends __1.default.Expression {
    constructor(left, right, operator) {
        super();
        this.left = left;
        this.right = right;
        this.operator = operator;
    }
    accept(visitor) {
        return visitor.visitBinaryExpression(this);
    }
    get token() {
        return this.operator;
    }
}
exports.BinaryExpression = BinaryExpression;
