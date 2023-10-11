"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const to_camel_case_1 = tslib_1.__importDefault(require("to-camel-case"));
const singular_type_1 = tslib_1.__importDefault(require("../../../../code-analysis/type-checker/types/singular-type"));
const intrinsic_1 = tslib_1.__importDefault(require("../../../values/intrinsic"));
class SetRecursionDepth extends intrinsic_1.default.Function {
    constructor() {
        super(...arguments);
        this.name = (0, to_camel_case_1.default)(this.constructor.name);
        this.returnType = new singular_type_1.default("void");
        this.argumentTypes = { depth: new singular_type_1.default("int") };
    }
    call(depth) {
        this.interpreter.maxRecursionDepth = depth;
    }
}
exports.default = SetRecursionDepth;
