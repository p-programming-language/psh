"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsInExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class IsInExpression extends __1.default.Expression {
    constructor(value, object, inversed, operator) {
        super();
        this.value = value;
        this.object = object;
        this.inversed = inversed;
        this.operator = operator;
    }
    accept(visitor) {
        return visitor.visitIsInExpression(this);
    }
    get token() {
        return this.operator;
    }
}
exports.IsInExpression = IsInExpression;
