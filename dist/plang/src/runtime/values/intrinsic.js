"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const to_camel_case_1 = tslib_1.__importDefault(require("to-camel-case"));
const util_1 = tslib_1.__importDefault(require("util"));
const callable_1 = require("./callable");
const constructable_1 = require("./constructable");
const range_1 = require("./range");
const utility_1 = require("../../utility");
const singular_type_1 = tslib_1.__importDefault(require("../../code-analysis/type-checker/types/singular-type"));
const interface_type_1 = tslib_1.__importDefault(require("../../code-analysis/type-checker/types/interface-type"));
const literal_type_1 = tslib_1.__importDefault(require("../../code-analysis/type-checker/types/literal-type"));
const value_1 = tslib_1.__importDefault(require("./value"));
const function_1 = tslib_1.__importDefault(require("./function"));
const function_type_1 = tslib_1.__importDefault(require("../../code-analysis/type-checker/types/function-type"));
const class_type_1 = tslib_1.__importDefault(require("../../code-analysis/type-checker/types/class-type"));
const JsFunction = Function;
var Intrinsic;
(function (Intrinsic) {
    let Kind;
    (function (Kind) {
        Kind[Kind["Lib"] = 0] = "Lib";
        Kind[Kind["Function"] = 1] = "Function";
        Kind[Kind["Class"] = 2] = "Class";
    })(Kind = Intrinsic.Kind || (Intrinsic.Kind = {}));
    class Collection extends value_1.default {
    }
    class Class extends constructable_1.Constructable {
        constructor(intrinsics, parentName) {
            super();
            this.intrinsics = intrinsics;
            this.parentName = parentName;
            this.type = 1 /* ConstructableType.IntrinsicClass */;
            this.address = (0, utility_1.generateAddress)();
        }
        get typeSignature() {
            var _a, _b;
            const members = new Map(Object.entries(this.memberSignatures)
                .map(([name, sig]) => [new literal_type_1.default(name), sig]));
            members.set(new literal_type_1.default("construct"), {
                modifiers: [],
                valueType: new function_type_1.default(new Map(Object.entries(this.constructorArgumentTypes)), new interface_type_1.default(new Map(Array.from(members.entries())
                    .filter(([_, sig]) => sig.modifiers.length === 0) // all *public* instance-level signatures (not private, non protected, not static)
                    .map(([name, sig]) => [name, {
                        valueType: sig.valueType,
                        mutable: sig.mutable
                    }])), new Map)),
                mutable: false
            });
            return new class_type_1.default(this.name.split(".").at(-1), members, ((_a = this.mixins) !== null && _a !== void 0 ? _a : []).map(mixin => mixin.typeSignature), (_b = this.superclass) === null || _b === void 0 ? void 0 : _b.typeSignature);
        }
        [util_1.default.inspect.custom]() {
            return this.toString();
        }
        toString() {
            return `<Intrinsic.Class: ${this.address}>`;
        }
        get constructorArity() {
            const nonNullableArguments = Array.from(Object.values(this.constructorArgumentTypes))
                .filter(argumentType => !argumentType.isAssignableTo(new singular_type_1.default("undefined")));
            const start = nonNullableArguments.length;
            const finish = Array.from(Object.values(this.constructorArgumentTypes)).length;
            return start === finish ? start : new range_1.Range(start, finish);
        }
    }
    Class.intrinsicKind = 2 /* Kind.Class */;
    Intrinsic.Class = Class;
    class ValueExtension extends Collection {
        constructor(value) {
            super();
            this.value = value;
        }
    }
    Intrinsic.ValueExtension = ValueExtension;
    class Lib extends Collection {
        constructor(intrinsics, parentName) {
            super();
            this.intrinsics = intrinsics;
            this.parentName = parentName;
            this.name = (this.parentName ? this.parentName + "." : "") + (0, to_camel_case_1.default)(this.constructor.name.replace(/Lib/g, ""));
            this.address = (0, utility_1.generateAddress)();
            if (!("interpreter" in intrinsics))
                throw new Error("Somehow we thought this Lib was a Function");
        }
        inject() {
            const members = Object.entries(this.members);
            for (const [name, value] of members)
                if (value instanceof JsFunction && "intrinsicKind" in value && value.intrinsicKind === 0 /* Intrinsic.Kind.Lib */)
                    this.intrinsics.defineLib(name, value);
                else if (value instanceof Intrinsic.Lib)
                    this.intrinsics.defineLibFromInstance(name, value);
                else if (value instanceof JsFunction && "intrinsicKind" in value && value.intrinsicKind === 2 /* Intrinsic.Kind.Class */)
                    this.intrinsics.defineClass(name, value);
                else if (value instanceof Intrinsic.Class)
                    this.intrinsics.defineClassFromInstance(name, value);
                else if (value instanceof JsFunction && "intrinsicKind" in value && value.intrinsicKind === 1 /* Intrinsic.Kind.Function */)
                    this.intrinsics.defineFunction(name, value);
                else if (value instanceof Intrinsic.Function)
                    this.intrinsics.defineFunctionFromInstance(name, value);
                else
                    this.intrinsics.define(name, value, this.propertyTypes[name]);
        }
        get typeSignature() {
            const typeTracker = this.intrinsics.interpreter.runner.host.typeTracker;
            return new interface_type_1.default(new Map(Array.from(Object.entries(this.members)).map(([propName, propValue]) => {
                let valueType;
                if (propValue instanceof function_1.default)
                    valueType = new function_type_1.default(new Map(propValue.definition.parameters.map(param => [param.identifier.name.lexeme, (0, utility_1.getTypeFromTypeRef)(typeTracker, param.typeRef)])), (0, utility_1.getTypeFromTypeRef)(typeTracker, propValue.definition.returnType));
                else if (propValue instanceof Intrinsic.Function || propValue instanceof Intrinsic.Class || propValue instanceof Intrinsic.Lib)
                    valueType = propValue.typeSignature;
                else if (propValue instanceof JsFunction && "intrinsicKind" in propValue && propValue.intrinsicKind === 1 /* Intrinsic.Kind.Function */)
                    valueType = new propValue(this.intrinsics.interpreter).typeSignature;
                else if ((propValue instanceof JsFunction && "intrinsicKind" in propValue) && (propValue.intrinsicKind === 0 /* Intrinsic.Kind.Lib */ || propValue.intrinsicKind === 2 /* Intrinsic.Kind.Class */))
                    valueType = new propValue(this.intrinsics).typeSignature;
                else
                    valueType = singular_type_1.default.fromValue(propValue);
                return [new literal_type_1.default(propName), {
                        valueType,
                        mutable: false
                    }];
            })), new Map, this.constructor.name);
        }
        [util_1.default.inspect.custom]() {
            return this.toString();
        }
        toString() {
            return `<Intrinsic.Lib: ${this.address}>`;
        }
    }
    Lib.intrinsicKind = 0 /* Kind.Lib */;
    Intrinsic.Lib = Lib;
    class Function extends callable_1.Callable {
        constructor(interpreter) {
            super();
            this.interpreter = interpreter;
            this.type = 1 /* CallableType.IntrinsicFunction */;
        }
        get typeSignature() {
            return new function_type_1.default(new Map(Object.entries(this.argumentTypes)), this.returnType);
        }
        get arity() {
            const nonNullableArguments = Array.from(Object.values(this.argumentTypes))
                .filter(argumentType => !argumentType.isAssignableTo(new singular_type_1.default("undefined")));
            const start = nonNullableArguments.length;
            const finish = Array.from(Object.values(this.argumentTypes)).length;
            return start === finish ? start : new range_1.Range(start, finish);
        }
        [util_1.default.inspect.custom]() {
            return this.toString();
        }
        toString() {
            return `<Intrinsic.Function: ${this.address}>`;
        }
    }
    Function.intrinsicKind = 1 /* Kind.Function */;
    Intrinsic.Function = Function;
})(Intrinsic || (Intrinsic = {}));
exports.default = Intrinsic;
