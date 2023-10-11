"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundPropertyDeclarationStatement extends bound_node_1.BoundStatement {
    constructor(modifiers, name, type, mutable, initializer) {
        super();
        this.modifiers = modifiers;
        this.name = name;
        this.type = type;
        this.mutable = mutable;
        this.initializer = initializer;
    }
    accept(visitor) {
        return visitor.visitPropertyDeclarationStatement(this);
    }
    get token() {
        return this.name;
    }
}
exports.default = BoundPropertyDeclarationStatement;
