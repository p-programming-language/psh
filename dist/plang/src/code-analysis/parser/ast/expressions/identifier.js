"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class IdentifierExpression extends __1.default.Expression {
    constructor(name) {
        super();
        this.name = name;
    }
    accept(visitor) {
        return visitor.visitIdentifierExpression(this);
    }
    get token() {
        return this.name;
    }
}
exports.IdentifierExpression = IdentifierExpression;
