"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bound_node_1 = require("../bound-node");
const union_type_1 = tslib_1.__importDefault(require("../../type-checker/types/union-type"));
class BoundTernaryExpression extends bound_node_1.BoundExpression {
    constructor(token, condition, body, elseBranch) {
        super();
        this.token = token;
        this.condition = condition;
        this.body = body;
        this.elseBranch = elseBranch;
        this.type = new union_type_1.default([this.body.type, this.elseBranch.type]);
    }
    accept(visitor) {
        return visitor.visitTernaryExpression(this);
    }
}
exports.default = BoundTernaryExpression;
