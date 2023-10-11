"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundVariableAssignmentExpression extends bound_node_1.BoundExpression {
    constructor(symbol, value) {
        super();
        this.symbol = symbol;
        this.value = value;
        this.type = this.value.type;
    }
    accept(visitor) {
        return visitor.visitVariableAssignmentExpression(this);
    }
    get token() {
        return this.symbol.name;
    }
}
exports.default = BoundVariableAssignmentExpression;
