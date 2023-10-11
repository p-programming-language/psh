"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeLiteralExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class RangeLiteralExpression extends __1.default.Expression {
    constructor(minimum, maximum, operator) {
        super();
        this.minimum = minimum;
        this.maximum = maximum;
        this.operator = operator;
    }
    accept(visitor) {
        return visitor.visitRangeLiteralExpression(this);
    }
    get token() {
        return this.operator;
    }
}
exports.RangeLiteralExpression = RangeLiteralExpression;
