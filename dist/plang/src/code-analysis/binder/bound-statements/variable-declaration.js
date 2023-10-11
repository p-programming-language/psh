"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundVariableDeclarationStatement extends bound_node_1.BoundStatement {
    constructor(symbol, mutable, initializer) {
        super();
        this.symbol = symbol;
        this.mutable = mutable;
        this.initializer = initializer;
        this.type = this.symbol.type;
    }
    accept(visitor) {
        return visitor.visitVariableDeclarationStatement(this);
    }
    get token() {
        return this.symbol.name;
    }
}
exports.default = BoundVariableDeclarationStatement;
