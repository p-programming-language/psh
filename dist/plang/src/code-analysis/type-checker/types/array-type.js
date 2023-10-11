"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const type_kind_1 = tslib_1.__importDefault(require("./type-kind"));
const singular_type_1 = tslib_1.__importDefault(require("./singular-type"));
class ArrayType extends singular_type_1.default {
    constructor(elementType) {
        super("Array");
        this.elementType = elementType;
        this.kind = type_kind_1.default.Array;
    }
    toString(colors) {
        return this.elementType.toString(colors) + "[]";
    }
}
exports.default = ArrayType;
