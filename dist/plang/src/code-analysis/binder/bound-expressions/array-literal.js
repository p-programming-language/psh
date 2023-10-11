"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundArrayLiteralExpression extends bound_node_1.BoundExpression {
    constructor(token, elements, type) {
        super();
        this.token = token;
        this.elements = elements;
        this.type = type;
    }
    accept(visitor) {
        return visitor.visitArrayLiteralExpression(this);
    }
}
exports.default = BoundArrayLiteralExpression;
