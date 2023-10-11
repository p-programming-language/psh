"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayLiteralExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class ArrayLiteralExpression extends __1.default.Expression {
    constructor(token, elements) {
        super();
        this.token = token;
        this.elements = elements;
    }
    accept(visitor) {
        return visitor.visitArrayLiteralExpression(this);
    }
}
exports.ArrayLiteralExpression = ArrayLiteralExpression;
