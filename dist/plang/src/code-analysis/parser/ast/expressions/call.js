"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class CallExpression extends __1.default.Expression {
    constructor(callee, args) {
        super();
        this.callee = callee;
        this.args = args;
    }
    accept(visitor) {
        return visitor.visitCallExpression(this);
    }
    get token() {
        return this.callee.token;
    }
}
exports.CallExpression = CallExpression;
