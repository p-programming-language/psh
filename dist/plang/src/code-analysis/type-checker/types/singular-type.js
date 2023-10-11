"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const range_1 = require("../../../runtime/values/range");
const type_1 = require("./type");
const type_kind_1 = tslib_1.__importDefault(require("./type-kind"));
const union_type_1 = tslib_1.__importDefault(require("./union-type"));
class SingularType extends type_1.Type {
    constructor(name, typeArguments) {
        super();
        this.name = name;
        this.typeArguments = typeArguments;
        this.kind = type_kind_1.default.Singular;
    }
    static fromValue(value) {
        switch (typeof value) {
            case "number": {
                if (value !== Math.floor(value))
                    return new SingularType("float");
                else
                    return new SingularType("int");
            }
            case "boolean":
                return new SingularType("bool");
            default: {
                if (value instanceof Array) {
                    let elementType = new SingularType("undefined");
                    for (const element of value) {
                        const type = SingularType.fromValue(element);
                        if (elementType.isUnion())
                            elementType = new union_type_1.default([...elementType.types, type]);
                        else
                            elementType = type;
                    }
                    return new SingularType("Array", [elementType]);
                }
                else if (value instanceof range_1.Range)
                    return new SingularType("Range");
                return new SingularType(typeof value);
            }
        }
    }
    static fromLiteral(literal) {
        return this.fromValue(literal.value);
    }
    toString(colors) {
        return this.name + (this.typeArguments ? `<${this.typeArguments.map(t => t.toString(colors)).join(", ")}>` : "");
    }
}
exports.default = SingularType;
