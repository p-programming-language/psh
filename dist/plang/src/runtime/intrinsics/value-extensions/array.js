"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const to_camel_case_1 = tslib_1.__importDefault(require("to-camel-case"));
const singular_type_1 = tslib_1.__importDefault(require("../../../code-analysis/type-checker/types/singular-type"));
const intrinsic_1 = tslib_1.__importDefault(require("../../values/intrinsic"));
const array_type_1 = tslib_1.__importDefault(require("../../../code-analysis/type-checker/types/array-type"));
const extensionName = "Array";
class ArrayExtension extends intrinsic_1.default.ValueExtension {
    constructor(value, elementType) {
        super(value);
        this.elementType = elementType;
    }
    get propertyTypes() {
        return {
            length: new singular_type_1.default("int")
        };
    }
    get members() {
        const { value, elementType } = this;
        const thisType = new array_type_1.default(elementType);
        return {
            length: value.length,
            join: class Join extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${extensionName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = new singular_type_1.default("string");
                    this.argumentTypes = { separator: new singular_type_1.default("string") };
                }
                call(separator) {
                    return value.join(separator);
                }
            },
            append: class Append extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${extensionName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = thisType;
                    this.argumentTypes = { element: elementType };
                }
                call(element) {
                    value.push(element);
                    return value;
                }
            },
            prepend: class Prepend extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${extensionName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = thisType;
                    this.argumentTypes = { element: elementType };
                }
                call(element) {
                    value.unshift(element);
                    return value;
                }
            },
            combine: class Combine extends intrinsic_1.default.Function {
                constructor() {
                    super(...arguments);
                    this.name = `${extensionName}.${(0, to_camel_case_1.default)(this.constructor.name)}`;
                    this.returnType = thisType;
                    this.argumentTypes = { other: thisType };
                }
                call(other) {
                    return value.concat(other);
                }
            }
        };
    }
}
exports.default = ArrayExtension;
