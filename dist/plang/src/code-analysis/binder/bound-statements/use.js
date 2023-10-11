"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundUseStatement extends bound_node_1.BoundStatement {
    constructor(keyword, members, location) {
        super();
        this.keyword = keyword;
        this.members = members;
        this.location = location;
    }
    accept(visitor) {
        return visitor.visitUseStatement(this);
    }
    get token() {
        return this.keyword;
    }
}
exports.default = BoundUseStatement;
