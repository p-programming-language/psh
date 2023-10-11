"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const to_camel_case_1 = tslib_1.__importDefault(require("to-camel-case"));
const singular_type_1 = tslib_1.__importDefault(require("../../../code-analysis/type-checker/types/singular-type"));
const array_type_1 = tslib_1.__importDefault(require("../../../code-analysis/type-checker/types/array-type"));
const intrinsic_1 = tslib_1.__importDefault(require("../../values/intrinsic"));
const union_type_1 = tslib_1.__importDefault(require("../../../code-analysis/type-checker/types/union-type"));
const extensionName = "string";
class StringExtension extends intrinsic_1.default.ValueExtension {
    get propertyTypes() {
        return {
            length: new singular_type_1.default("int")
        };
    }
    get members() {
        const value = this.value;
        return {
            length: value.length,
            repeat: class Repeat extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${extensionName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("string");
                    this.argumentTypes = { times: new singular_type_1.default("int") };
                }
                call(times) {
                    return value.repeat(times);
                }
            },
            split: class Split extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${extensionName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new array_type_1.default(new singular_type_1.default("string"));
                    this.argumentTypes = {
                        separator: new singular_type_1.default("string"),
                        limit: new union_type_1.default([
                            new singular_type_1.default("int"),
                            new singular_type_1.default("undefined")
                        ])
                    };
                }
                call(separator, limit) {
                    return value.split(separator, limit);
                }
            }
        };
    }
}
exports.default = StringExtension;
