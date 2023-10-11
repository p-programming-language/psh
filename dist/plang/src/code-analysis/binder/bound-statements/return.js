"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundReturnStatement extends bound_node_1.BoundStatement {
    constructor(token, expression) {
        super();
        this.token = token;
        this.expression = expression;
        this.type = this.expression.type;
    }
    accept(visitor) {
        return visitor.visitReturnStatement(this);
    }
}
exports.default = BoundReturnStatement;
