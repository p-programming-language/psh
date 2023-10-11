"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundBinaryExpression extends bound_node_1.BoundExpression {
    constructor(left, right, operator) {
        super();
        this.left = left;
        this.right = right;
        this.operator = operator;
        this.type = this.operator.resultType;
    }
    accept(visitor) {
        return visitor.visitBinaryExpression(this);
    }
    get token() {
        return this.left.token;
    }
}
exports.default = BoundBinaryExpression;
