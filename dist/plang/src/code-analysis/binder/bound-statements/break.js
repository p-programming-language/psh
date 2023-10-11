"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundBreakStatement extends bound_node_1.BoundStatement {
    constructor(token) {
        super();
        this.token = token;
    }
    accept(visitor) {
        return visitor.visitBreakStatement(this);
    }
}
exports.default = BoundBreakStatement;
