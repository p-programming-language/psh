"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundClassDeclarationStatement extends bound_node_1.BoundStatement {
    constructor(keyword, symbol, body, mixins, superclass) {
        super();
        this.keyword = keyword;
        this.symbol = symbol;
        this.body = body;
        this.mixins = mixins;
        this.superclass = superclass;
        this.type = this.symbol.type;
    }
    accept(visitor) {
        return visitor.visitClassStatement(this);
    }
    get token() {
        return this.symbol.name;
    }
}
exports.default = BoundClassDeclarationStatement;
