"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundIfStatement extends bound_node_1.BoundStatement {
    constructor(token, condition, body, elseBranch) {
        super();
        this.token = token;
        this.condition = condition;
        this.body = body;
        this.elseBranch = elseBranch;
    }
    accept(visitor) {
        return visitor.visitIfStatement(this);
    }
}
exports.default = BoundIfStatement;
