"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
const range_1 = require("./range");
const method_declaration_1 = require("../../code-analysis/parser/ast/statements/method-declaration");
const constructable_1 = require("./constructable");
const utility_1 = require("../../utility");
const class_instance_1 = tslib_1.__importDefault(require("./class-instance"));
const scope_1 = tslib_1.__importDefault(require("../scope"));
class PClass extends constructable_1.Constructable {
    constructor(definition, closure, typeTracker) {
        super();
        this.definition = definition;
        this.closure = closure;
        this.typeTracker = typeTracker;
        this.type = 0 /* ConstructableType.Class */;
        this.name = this.definition.name.lexeme;
        this.address = (0, utility_1.generateAddress)();
        this.nullableCtorParameters = this.ctorParameters.filter(param => param.initializer !== undefined || (0, utility_1.getTypeFromTypeRef)(this.typeTracker, param.typeRef).isNullable());
    }
    construct(interpreter, ...args) {
        const scope = new scope_1.default(this.closure);
        if (this.classConstructor) {
            const constructorFn = interpreter.evaluate(this.classConstructor);
            constructorFn.call(interpreter, ...args);
        }
        // TODO: extend with superclass and mixins
        // TODO: add class members to class instance
        return new class_instance_1.default(this, scope, interpreter, args);
    }
    get constructorArity() {
        const start = this.ctorParameters.length - this.nullableCtorParameters.length;
        const finish = this.ctorParameters.length;
        return start === finish ? start : new range_1.Range(start, finish);
    }
    get classConstructor() {
        return this.definition.body.members
            .find((member) => member instanceof method_declaration_1.MethodDeclarationStatement && member.name.lexeme === "construct");
    }
    get ctorParameters() {
        var _a, _b;
        return (_b = (_a = this.classConstructor) === null || _a === void 0 ? void 0 : _a.parameters) !== null && _b !== void 0 ? _b : [];
    }
    [util_1.default.inspect.custom]() {
        return this.toString();
    }
    toString() {
        return `<Class: ${this.address}>`;
    }
}
exports.default = PClass;
