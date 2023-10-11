"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundVariableAssignmentStatement extends bound_node_1.BoundStatement {
    constructor(symbol, value) {
        super();
        this.symbol = symbol;
        this.value = value;
        this.type = this.value.type;
    }
    accept(visitor) {
        return visitor.visitVariableAssignmentStatement(this);
    }
    get token() {
        return this.symbol.name;
    }
}
exports.default = BoundVariableAssignmentStatement;
