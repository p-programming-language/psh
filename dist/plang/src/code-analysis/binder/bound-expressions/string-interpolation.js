"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bound_node_1 = require("../bound-node");
const singular_type_1 = tslib_1.__importDefault(require("../../type-checker/types/singular-type"));
class BoundStringInterpolationExpression extends bound_node_1.BoundExpression {
    constructor(parts) {
        super();
        this.parts = parts;
        this.type = new singular_type_1.default("string");
    }
    accept(visitor) {
        return visitor.visitStringInterpolationExpression(this);
    }
    get token() {
        return this.parts[0].token;
    }
}
exports.default = BoundStringInterpolationExpression;
