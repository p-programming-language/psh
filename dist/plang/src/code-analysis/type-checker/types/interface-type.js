"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const type_1 = require("./type");
const type_kind_1 = tslib_1.__importDefault(require("./type-kind"));
const singular_type_1 = tslib_1.__importDefault(require("./singular-type"));
class InterfaceType extends singular_type_1.default {
    constructor(members, indexSignatures, 
    // public readonly typeParameters?: TypeParameter[],
    name = "Object") {
        super(name);
        this.members = members;
        this.indexSignatures = indexSignatures;
        this.kind = type_kind_1.default.Interface;
    }
    toString(colors, indent = 0) {
        let result = (this.name === "Object" ? "" : this.name + " ") + "{";
        if (this.indexSignatures.size > 0 || this.members.size > 0)
            indent += 1;
        for (const [key, value] of this.indexSignatures) {
            result += "\n";
            result += "  ".repeat(indent);
            result += `[${key.toString()}]: ${value instanceof InterfaceType ? value.toString(colors, indent + 1) : value.toString()};`;
        }
        for (const [key, value] of this.members) {
            result += "\n";
            result += "  ".repeat(indent);
            result += `${value instanceof InterfaceType ? value.toString(colors, indent + 1) : (value instanceof type_1.Type ? value.toString().replace(/\"/g, "") : value.valueType.toString())} ${key};`;
        }
        return result + "\n}";
    }
}
exports.default = InterfaceType;
