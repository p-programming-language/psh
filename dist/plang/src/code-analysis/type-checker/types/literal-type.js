"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
const type_kind_1 = tslib_1.__importDefault(require("./type-kind"));
const singular_type_1 = tslib_1.__importDefault(require("./singular-type"));
class LiteralType extends singular_type_1.default {
    constructor(value) {
        super(util_1.default.inspect(value, { colors: false }).replace(/'/g, '"'));
        this.value = value;
        this.kind = type_kind_1.default.Literal;
    }
    toString(colors) {
        return util_1.default.inspect(this.value, { colors }).replace(/'/g, '"');
    }
}
exports.default = LiteralType;
