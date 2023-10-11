"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundFunctionDeclarationStatement extends bound_node_1.BoundStatement {
    constructor(symbol, parameters, body) {
        super();
        this.symbol = symbol;
        this.parameters = parameters;
        this.body = body;
        this.type = this.symbol.type;
    }
    accept(visitor) {
        return visitor.visitFunctionDeclarationStatement(this);
    }
    get token() {
        return this.symbol.name;
    }
}
exports.default = BoundFunctionDeclarationStatement;
