"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundWhileStatement extends bound_node_1.BoundStatement {
    constructor(token, condition, body) {
        super();
        this.token = token;
        this.condition = condition;
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitWhileStatement(this);
    }
}
exports.default = BoundWhileStatement;
