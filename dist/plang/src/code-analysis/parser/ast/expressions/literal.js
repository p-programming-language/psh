"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteralExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class LiteralExpression extends __1.default.Expression {
    constructor(token) {
        super();
        this.token = token;
    }
    accept(visitor) {
        return visitor.visitLiteralExpression(this);
    }
}
exports.LiteralExpression = LiteralExpression;
