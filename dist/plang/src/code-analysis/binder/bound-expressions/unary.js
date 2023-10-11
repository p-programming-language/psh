"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundUnaryExpression extends bound_node_1.BoundExpression {
    constructor(operand, operator) {
        super();
        this.operand = operand;
        this.operator = operator;
        this.type = this.operator.resultType;
    }
    accept(visitor) {
        return visitor.visitUnaryExpression(this);
    }
    get token() {
        return this.operand.token;
    }
}
exports.default = BoundUnaryExpression;
