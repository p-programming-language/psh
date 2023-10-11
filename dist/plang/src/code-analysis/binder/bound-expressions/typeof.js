"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bound_node_1 = require("../bound-node");
const type_sets_1 = require("../../type-checker/types/type-sets");
const union_type_1 = tslib_1.__importDefault(require("../../type-checker/types/union-type"));
const literal_type_1 = tslib_1.__importDefault(require("../../type-checker/types/literal-type"));
class BoundTypeOfExpression extends bound_node_1.BoundExpression {
    constructor(keyword, value) {
        super();
        this.keyword = keyword;
        this.value = value;
        this.type = new union_type_1.default(Array.from(type_sets_1.INTRINSIC_TYPES.values())
            .map(typeName => new literal_type_1.default(typeName)));
    }
    accept(visitor) {
        return visitor.visitTypeOfExpression(this);
    }
    get token() {
        return this.keyword;
    }
}
exports.default = BoundTypeOfExpression;
