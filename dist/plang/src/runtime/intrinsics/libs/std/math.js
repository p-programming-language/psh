"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const to_camel_case_1 = tslib_1.__importDefault(require("to-camel-case"));
const singular_type_1 = tslib_1.__importDefault(require("../../../../code-analysis/type-checker/types/singular-type"));
const union_type_1 = tslib_1.__importDefault(require("../../../../code-analysis/type-checker/types/union-type"));
const intrinsic_1 = tslib_1.__importDefault(require("../../../values/intrinsic"));
const NUMBER_TYPE = new union_type_1.default([
    new singular_type_1.default("int"),
    new singular_type_1.default("float")
]);
class MathLib extends intrinsic_1.default.Lib {
    get propertyTypes() {
        return {
            pi: new singular_type_1.default("float"),
            e: new singular_type_1.default("float")
        };
    }
    get members() {
        const libName = this.name;
        return {
            pi: Math.PI,
            e: Math.E,
            inf: Infinity,
            random: class Random extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("float");
                    this.argumentTypes = {};
                }
                call() {
                    return Math.random();
                }
            },
            sin: class Sin extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("float");
                    this.argumentTypes = { n: NUMBER_TYPE };
                }
                call(n) {
                    return Math.sin(n);
                }
            },
            cos: class Cos extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("float");
                    this.argumentTypes = { n: NUMBER_TYPE };
                }
                call(n) {
                    return Math.cos(n);
                }
            },
            tan: class Tan extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("float");
                    this.argumentTypes = { n: NUMBER_TYPE };
                }
                call(n) {
                    return Math.tan(n);
                }
            },
            sinh: class Sinh extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("float");
                    this.argumentTypes = { n: NUMBER_TYPE };
                }
                call(n) {
                    return Math.sin(n);
                }
            },
            cosh: class Cosh extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("float");
                    this.argumentTypes = { n: NUMBER_TYPE };
                }
                call(n) {
                    return Math.cosh(n);
                }
            },
            tanh: class Tanh extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("float");
                    this.argumentTypes = { n: NUMBER_TYPE };
                }
                call(n) {
                    return Math.tanh(n);
                }
            }
        };
    }
}
exports.default = MathLib;
