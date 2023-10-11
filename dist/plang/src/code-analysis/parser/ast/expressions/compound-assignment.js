"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompoundAssignmentExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class CompoundAssignmentExpression extends __1.default.Expression {
    constructor(left, right, operator) {
        super();
        this.left = left;
        this.right = right;
        this.operator = operator;
    }
    accept(visitor) {
        return visitor.visitCompoundAssignmentExpression(this);
    }
    get token() {
        return this.left.token;
    }
}
exports.CompoundAssignmentExpression = CompoundAssignmentExpression;
