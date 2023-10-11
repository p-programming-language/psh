"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const type_kind_1 = tslib_1.__importDefault(require("./type-kind"));
const singular_type_1 = tslib_1.__importDefault(require("./singular-type"));
const interface_type_1 = tslib_1.__importDefault(require("./interface-type"));
class ClassType extends singular_type_1.default {
    constructor(name, members, mixinTypes, superclassType
    // public readonly typeParameters?: TypeParameter[]
    ) {
        super(name);
        this.members = members;
        this.mixinTypes = mixinTypes;
        this.superclassType = superclassType;
        this.kind = type_kind_1.default.Class;
    }
    getInstanceType() {
        return new interface_type_1.default(new Map(Array.from(this.members.entries())
            .filter(([_, sig]) => sig.modifiers.length === 0) // all public instance-level signatures (not private, non protected, not static)
            .map(([name, sig]) => [name, {
                valueType: sig.valueType,
                mutable: sig.mutable
            }])), new Map);
    }
    toString() {
        return `class ${this.name}`;
    }
}
exports.default = ClassType;
