"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const singular_type_1 = tslib_1.__importDefault(require("../../../../code-analysis/type-checker/types/singular-type"));
const intrinsic_1 = tslib_1.__importDefault(require("../../../values/intrinsic"));
const eval_1 = tslib_1.__importDefault(require("./eval"));
const set_recursion_depth_1 = tslib_1.__importDefault(require("./set-recursion-depth"));
class PLib extends intrinsic_1.default.Lib {
    get propertyTypes() {
        return {
            version: new singular_type_1.default("int")
        };
    }
    get members() {
        return {
            version: this.intrinsics.interpreter.runner.version,
            eval: eval_1.default,
            setRecursionDepth: set_recursion_depth_1.default
        };
    }
}
exports.default = PLib;
