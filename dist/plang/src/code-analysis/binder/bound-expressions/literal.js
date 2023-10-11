"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundLiteralExpression extends bound_node_1.BoundExpression {
    constructor(token, type) {
        super();
        this.token = token;
        this.type = type;
    }
    accept(visitor) {
        return visitor.visitLiteralExpression(this);
    }
}
exports.default = BoundLiteralExpression;
