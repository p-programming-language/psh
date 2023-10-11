"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundPropertyAssignmentExpression extends bound_node_1.BoundExpression {
    constructor(access, value) {
        super();
        this.access = access;
        this.value = value;
        this.type = this.value.type;
    }
    accept(visitor) {
        return visitor.visitPropertyAssignmentExpression(this);
    }
    get token() {
        return this.access.token;
    }
}
exports.default = BoundPropertyAssignmentExpression;
