"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundExpressionStatement extends bound_node_1.BoundStatement {
    constructor(expression) {
        super();
        this.expression = expression;
        this.type = this.expression.type;
    }
    accept(visitor) {
        return visitor.visitExpressionStatement(this);
    }
    get token() {
        return this.expression.token;
    }
}
exports.default = BoundExpressionStatement;
