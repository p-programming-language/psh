"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bound_node_1 = require("../bound-node");
const singular_type_1 = tslib_1.__importDefault(require("../../type-checker/types/singular-type"));
class BoundIsExpression extends bound_node_1.BoundExpression {
    constructor(value, typeToCheck, operator) {
        super();
        this.value = value;
        this.typeToCheck = typeToCheck;
        this.operator = operator;
        this.type = new singular_type_1.default("bool");
    }
    accept(visitor) {
        return visitor.visitIsExpression(this);
    }
    get token() {
        return this.operator;
    }
}
exports.default = BoundIsExpression;
