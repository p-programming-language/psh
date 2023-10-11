"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundCompoundAssignmentExpression extends bound_node_1.BoundExpression {
    constructor(left, right, operator) {
        super();
        this.left = left;
        this.right = right;
        this.operator = operator;
        this.type = this.left.type;
    }
    accept(visitor) {
        return visitor.visitCompoundAssignmentExpression(this);
    }
    get token() {
        return this.left.token;
    }
}
exports.default = BoundCompoundAssignmentExpression;
