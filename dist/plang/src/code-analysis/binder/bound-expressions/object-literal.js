"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundObjectLiteralExpression extends bound_node_1.BoundExpression {
    constructor(token, properties, type) {
        super();
        this.token = token;
        this.properties = properties;
        this.type = type;
    }
    accept(visitor) {
        return visitor.visitObjectLiteralExpression(this);
    }
}
exports.default = BoundObjectLiteralExpression;
