"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const type_1 = require("./type");
const type_kind_1 = tslib_1.__importDefault(require("./type-kind"));
class UnionType extends type_1.Type {
    constructor(types) {
        super();
        this.types = types;
        this.kind = type_kind_1.default.Union;
    }
    toString(colors) {
        return [...new Set(this.types.map(t => t.toString(colors)))]
            .join(" | ")
            .replace(/ \| undefined/g, "?");
    }
}
exports.default = UnionType;
