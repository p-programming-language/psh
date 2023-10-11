"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const utility_1 = require("../../utility");
const syntax_type_1 = tslib_1.__importDefault(require("../../code-analysis/tokenization/syntax-type"));
const singular_type_1 = tslib_1.__importDefault(require("../../code-analysis/type-checker/types/singular-type"));
class Intrinsics {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }
    inject() {
        this.define("filename$", this.interpreter.fileName, new singular_type_1.default("string"));
        this.define("dirname$", path_1.default.dirname(this.interpreter.fileName), new singular_type_1.default("string"));
    }
    define(name, value, type) {
        const identifier = (0, utility_1.fakeToken)(syntax_type_1.default.Identifier, name, undefined);
        this.interpreter.resolver.define(identifier);
        this.interpreter.binder.defineSymbol(identifier, type);
        this.interpreter.globals.define(identifier, value, {
            mutable: false
        });
    }
    defineFunction(name, IntrinsicFunction) {
        const fn = new IntrinsicFunction(this.interpreter);
        this.defineFunctionFromInstance(name, fn);
    }
    defineFunctionFromInstance(name, fn) {
        this.define(name, fn, fn.typeSignature);
    }
    defineLib(name, IntrinsicLib) {
        const lib = new IntrinsicLib(this);
        this.defineLibFromInstance(name, lib);
    }
    defineLibFromInstance(name, lib) {
        const mappedLib = Object.entries(lib.members)
            .map(([memberName, memberValue]) => {
            let value;
            if (memberValue instanceof Function && "intrinsicKind" in memberValue && memberValue.intrinsicKind === 1 /* Intrinsic.Kind.Function */)
                value = new memberValue(this.interpreter);
            else if ((memberValue instanceof Function && "intrinsicKind" in memberValue) && (memberValue.intrinsicKind === 0 /* Intrinsic.Kind.Lib */ || memberValue.intrinsicKind === 2 /* Intrinsic.Kind.Class */))
                value = new memberValue(this, lib.name);
            else
                value = memberValue;
            return [memberName, value];
        });
        this.define(name, Object.fromEntries(mappedLib), lib.typeSignature);
    }
    defineClass(name, IntrinsicClass) {
        const _class = new IntrinsicClass(this);
        this.defineClassFromInstance(name, _class);
    }
    defineClassFromInstance(name, _class) {
        this.define(name, _class, _class.typeSignature);
    }
}
exports.default = Intrinsics;
