"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundEveryStatement extends bound_node_1.BoundStatement {
    constructor(token, elementDeclarations, iterable, body) {
        super();
        this.token = token;
        this.elementDeclarations = elementDeclarations;
        this.iterable = iterable;
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitEveryStatement(this);
    }
}
exports.default = BoundEveryStatement;
