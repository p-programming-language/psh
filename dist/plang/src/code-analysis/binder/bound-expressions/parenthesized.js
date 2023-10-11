"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundParenthesizedExpression extends bound_node_1.BoundExpression {
    constructor(expression) {
        super();
        this.expression = expression;
        this.type = this.expression.type;
    }
    accept(visitor) {
        return visitor.visitParenthesizedExpression(this);
    }
    get token() {
        return this.expression.token;
    }
}
exports.default = BoundParenthesizedExpression;
