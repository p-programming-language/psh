"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectLiteralExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class ObjectLiteralExpression extends __1.default.Expression {
    constructor(token, properties) {
        super();
        this.token = token;
        this.properties = properties;
    }
    accept(visitor) {
        return visitor.visitObjectLiteralExpression(this);
    }
}
exports.ObjectLiteralExpression = ObjectLiteralExpression;
