"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundMethodDeclarationStatement extends bound_node_1.BoundStatement {
    constructor(modifiers, name, type, parameters, body) {
        super();
        this.modifiers = modifiers;
        this.name = name;
        this.type = type;
        this.parameters = parameters;
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitMethodDeclarationStatement(this);
    }
    get token() {
        return this.name;
    }
}
exports.default = BoundMethodDeclarationStatement;
