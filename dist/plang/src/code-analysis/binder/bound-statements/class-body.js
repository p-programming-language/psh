"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundClassBodyStatement extends bound_node_1.BoundStatement {
    constructor(token, members) {
        super();
        this.token = token;
        this.members = members;
    }
    accept(visitor) {
        return visitor.visitClassBodyStatement(this);
    }
}
exports.default = BoundClassBodyStatement;
