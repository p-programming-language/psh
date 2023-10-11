"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringInterpolationExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class StringInterpolationExpression extends __1.default.Expression {
    constructor(parts) {
        super();
        this.parts = parts;
    }
    accept(visitor) {
        return visitor.visitStringInterpolationExpression(this);
    }
    get token() {
        return this.parts[0].token;
    }
}
exports.StringInterpolationExpression = StringInterpolationExpression;
