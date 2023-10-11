"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const to_camel_case_1 = tslib_1.__importDefault(require("to-camel-case"));
const utility_1 = require("../../../../../utility");
const singular_type_1 = tslib_1.__importDefault(require("../../../../../code-analysis/type-checker/types/singular-type"));
const intrinsic_1 = tslib_1.__importDefault(require("../../../../values/intrinsic"));
class EnvLib extends intrinsic_1.default.Lib {
    get propertyTypes() {
        return {};
    }
    get members() {
        const libName = this.name;
        return {
            get: class Get extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = (0, utility_1.optional)(new singular_type_1.default("string"));
                    this.argumentTypes = { name: new singular_type_1.default("string") };
                }
                call(name) {
                    return process.env[name];
                }
            },
            set: class Set extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${libName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("void");
                    this.argumentTypes = {
                        name: new singular_type_1.default("string"),
                        value: new singular_type_1.default("string")
                    };
                }
                call(name, value) {
                    process.env[name] = value;
                }
            }
        };
    }
}
exports.default = EnvLib;
