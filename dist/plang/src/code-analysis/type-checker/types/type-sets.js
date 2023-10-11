"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTRINSIC_TYPES = exports.INTRINSIC_EXTENDED_LITERAL_TYPES = exports.INTRINSIC_EXTENDED_LITERAL_VALUE_TYPES = exports.INDEXABLE_LITERAL_TYPES = exports.INDEX_TYPE = void 0;
const tslib_1 = require("tslib");
const array_type_1 = tslib_1.__importDefault(require("./array-type"));
const singular_type_1 = tslib_1.__importDefault(require("./singular-type"));
const union_type_1 = tslib_1.__importDefault(require("./union-type"));
exports.INDEX_TYPE = new union_type_1.default([
    new singular_type_1.default("string"),
    new singular_type_1.default("int")
]);
exports.INDEXABLE_LITERAL_TYPES = [
    new singular_type_1.default("string"),
    new singular_type_1.default("Range")
];
exports.INTRINSIC_EXTENDED_LITERAL_VALUE_TYPES = [
    ...exports.INDEXABLE_LITERAL_TYPES.map(t => t.name),
    "Array"
];
exports.INTRINSIC_EXTENDED_LITERAL_TYPES = exports.INTRINSIC_EXTENDED_LITERAL_VALUE_TYPES
    .map(name => new singular_type_1.default(name))
    .concat(new array_type_1.default(new singular_type_1.default("any")));
exports.INTRINSIC_TYPES = new Set([
    "int", "float", "string", "bool",
    "undefined", "null", "void",
    "any", "Array", "Range"
]);
