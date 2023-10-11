"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundIdentifierExpression extends bound_node_1.BoundExpression {
    constructor(name, type) {
        super();
        this.name = name;
        this.type = type;
    }
    accept(visitor) {
        return visitor.visitIdentifierExpression(this);
    }
    get token() {
        return this.name;
    }
}
exports.default = BoundIdentifierExpression;
