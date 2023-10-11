"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionTypeExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class UnionTypeExpression extends __1.default.TypeRef {
    constructor(types) {
        super();
        this.types = types;
    }
    get token() {
        return this.types[0].token;
    }
}
exports.UnionTypeExpression = UnionTypeExpression;
