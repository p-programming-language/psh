"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundRangeLiteralExpression extends bound_node_1.BoundExpression {
    constructor(operator, minimum, maximum, type) {
        super();
        this.operator = operator;
        this.minimum = minimum;
        this.maximum = maximum;
        this.type = type;
    }
    accept(visitor) {
        return visitor.visitRangeLiteralExpression(this);
    }
    get token() {
        return this.operator;
    }
}
exports.default = BoundRangeLiteralExpression;
