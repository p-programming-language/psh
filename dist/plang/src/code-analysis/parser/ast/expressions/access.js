"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class AccessExpression extends __1.default.Expression {
    constructor(token, object, index) {
        super();
        this.token = token;
        this.object = object;
        this.index = index;
    }
    accept(visitor) {
        return visitor.visitIndexExpression(this);
    }
}
exports.AccessExpression = AccessExpression;
