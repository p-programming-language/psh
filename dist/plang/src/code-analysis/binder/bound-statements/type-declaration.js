"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundTypeDeclarationStatement extends bound_node_1.BoundStatement {
    constructor(symbol) {
        super();
        this.symbol = symbol;
        this.type = this.symbol.type;
    }
    accept(visitor) {
        return visitor.visitTypeDeclarationStatement(this);
    }
    get token() {
        return this.symbol.name;
    }
}
exports.default = BoundTypeDeclarationStatement;
