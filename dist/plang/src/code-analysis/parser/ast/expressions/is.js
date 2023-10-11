"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class IsExpression extends __1.default.Expression {
    constructor(value, typeRef, inversed, operator) {
        super();
        this.value = value;
        this.typeRef = typeRef;
        this.inversed = inversed;
        this.operator = operator;
    }
    accept(visitor) {
        return visitor.visitIsExpression(this);
    }
    get token() {
        return this.operator;
    }
}
exports.IsExpression = IsExpression;
