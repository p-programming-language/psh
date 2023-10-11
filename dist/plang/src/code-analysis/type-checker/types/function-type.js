"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const type_kind_1 = tslib_1.__importDefault(require("./type-kind"));
const singular_type_1 = tslib_1.__importDefault(require("./singular-type"));
class FunctionType extends singular_type_1.default {
    constructor(parameterTypes, returnType) {
        super("Function");
        this.parameterTypes = parameterTypes;
        this.returnType = returnType;
        this.kind = type_kind_1.default.Function;
    }
    toString(colors) {
        const parameterList = Array.from(this.parameterTypes.entries())
            .map(([name, type]) => `${type.toString(colors)} ${name}`)
            .join(", ");
        return `(${parameterList}) :: ${this.returnType.toString(colors)}`;
    }
}
exports.default = FunctionType;
