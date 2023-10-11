"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
const type_kind_1 = tslib_1.__importDefault(require("./type-kind"));
const singular_type_1 = tslib_1.__importDefault(require("./singular-type"));
class Type {
    isSingular() {
        return this.kind === type_kind_1.default.Singular
            || this.kind === type_kind_1.default.Literal
            || this.kind === type_kind_1.default.Array
            || this.kind === type_kind_1.default.Interface;
    }
    isLiteral() {
        return this.kind === type_kind_1.default.Literal;
    }
    isUnion() {
        return this.kind === type_kind_1.default.Union;
    }
    isArray() {
        return this.kind === type_kind_1.default.Array;
    }
    isFunction() {
        return this.kind === type_kind_1.default.Function;
    }
    isInterface() {
        return this.kind === type_kind_1.default.Interface;
    }
    isClass() {
        return this.kind === type_kind_1.default.Class;
    }
    isUndefined() {
        return this.isSingular()
            && (this.name === "undefined"
                || this.name === "void");
    }
    isNull() {
        return this.isSingular() && this.name === "null";
    }
    isNullable() {
        return this.isNull() || this.isUndefined() || (this.isUnion() && this.types.some(t => t.isNullable()));
    }
    isAny() {
        return this.isSingular() && this.name === "any";
    }
    is(other) {
        if (this.isAny())
            return other.isAny();
        if (this.isUnion())
            return this.types.every(type => type.is(other));
        return this.isAssignableTo(other);
    }
    isAssignableTo(other) {
        if (other.isSingular() && other.name === "any")
            return true;
        if (this.isLiteral())
            return other.isLiteral() ? other.value === this.value : other.isAssignableTo(singular_type_1.default.fromValue(this.value));
        if (this.isUnion())
            return this.types.some(type => type.isAssignableTo(other));
        if (this.isUndefined())
            return other.isUndefined();
        if (this.isNull())
            return other.isNull();
        if (this.isInterface()) {
            if (other.isUnion())
                return other.isAssignableTo(this);
            if (!other.isInterface() && !other.isClass())
                return false;
            if (!other.isInterface())
                return other.getInstanceType().isAssignableTo(this);
            const otherProperties = new Map(Array.from(this.members.entries())
                .map(([key, signature]) => [key.value, signature]));
            const propertiesAreAssignable = Array.from(this.members.entries())
                .map(([key, signature]) => [key.value, signature])
                .every(([key, { valueType }]) => (otherProperties.has(key) && otherProperties.get(key).valueType.isAssignableTo(valueType))
                || Array.from(other.indexSignatures.values()).some(type => type.isAssignableTo(valueType)));
            const indexSignaturesAreAssignable = Array.from(this.indexSignatures.entries())
                .every(([keyType, valueType]) => other.indexSignatures.has(keyType) && valueType.isAssignableTo(other.indexSignatures.get(keyType)));
            return propertiesAreAssignable && indexSignaturesAreAssignable;
        }
        if (this.isClass()) {
            if (other.isUnion())
                return other.isAssignableTo(this);
            if (!other.isClass() && !other.isInterface())
                return false;
            if (!other.isClass())
                return other.isAssignableTo(this.getInstanceType());
            const otherProperties = new Map(Array.from(this.members.entries())
                .map(([key, signature]) => [key.value, signature]));
            return Array.from(this.members.entries())
                .map(([key, signature]) => [key.value, signature])
                .every(([key, { valueType }]) => (otherProperties.has(key) && otherProperties.get(key).valueType.isAssignableTo(valueType)));
        }
        if (this.isArray()) {
            if (other.isUnion())
                return other.isAssignableTo(this);
            if (!other.isArray())
                return false;
            return this.elementType.isAssignableTo(other.elementType);
        }
        if (this.isSingular())
            if (this.name === "Array") {
                if (other.isSingular() ? other.name !== "Array" : !other.isArray())
                    return false;
                if (other.isSingular() ? (other.typeArguments !== undefined && other.typeArguments.length < 1) : false)
                    return false;
                const elementType = this.isArray() ? this.elementType : this.typeArguments[0];
                return other.isArray() ?
                    other.elementType.is(elementType)
                    : elementType.is(other.typeArguments[0]);
            }
            else if (other.isSingular()) {
                if (this.name === "any")
                    return true;
                if (other.isLiteral())
                    return other.isAssignableTo(this);
                if (this.typeArguments) {
                    if (!other.typeArguments)
                        return false;
                    return this.typeArguments.every((arg, i) => arg.isAssignableTo(other.typeArguments[i]));
                }
                return this.name === other.name;
            }
            else
                return other.isAssignableTo(this);
        if (this.isFunction()) {
            if (!other.isFunction())
                return false;
            const parametersAreAssignable = Array.from(this.parameterTypes.entries())
                .every(([key, paramType]) => other.parameterTypes.has(key) && paramType.isAssignableTo(other.parameterTypes.get(key)));
            return parametersAreAssignable && this.returnType.isAssignableTo(other.returnType);
        }
        return false;
    }
    toString(colors = false) {
        return util_1.default.inspect(this, { colors });
    }
}
exports.Type = Type;
