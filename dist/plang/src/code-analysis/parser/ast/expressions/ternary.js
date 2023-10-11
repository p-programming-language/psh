"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TernaryExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class TernaryExpression extends __1.default.Expression {
    constructor(token, condition, body, elseBranch) {
        super();
        this.token = token;
        this.condition = condition;
        this.body = body;
        this.elseBranch = elseBranch;
    }
    accept(visitor) {
        return visitor.visitTernaryExpression(this);
    }
}
exports.TernaryExpression = TernaryExpression;
