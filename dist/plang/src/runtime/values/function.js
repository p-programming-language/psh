"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
const range_1 = require("./range");
const callable_1 = require("./callable");
const utility_1 = require("../../utility");
const hooked_exceptions_1 = tslib_1.__importDefault(require("../hooked-exceptions"));
const scope_1 = tslib_1.__importDefault(require("../scope"));
const MAX_FN_PARAMS = 255;
class PFunction extends callable_1.Callable {
    constructor(definition, closure, typeTracker) {
        super();
        this.definition = definition;
        this.closure = closure;
        this.typeTracker = typeTracker;
        this.name = this.definition.name.lexeme;
        this.type = 0 /* CallableType.Function */;
        this.nullableParameters = this.parameters.filter(param => param.initializer !== undefined || (0, utility_1.getTypeFromTypeRef)(this.typeTracker, param.typeRef).isNullable());
    }
    call(interpreter, ...args) {
        var _a;
        const scope = new scope_1.default(this.closure);
        for (const param of this.parameters) {
            const defaultValue = param.initializer ? interpreter.evaluate(param.initializer) : undefined;
            const value = (_a = args[this.parameters.indexOf(param)]) !== null && _a !== void 0 ? _a : defaultValue;
            scope.define(param.identifier.name, value, {
                mutable: param.mutable
            });
        }
        interpreter.startRecursion(this.definition.token);
        try {
            interpreter.executeBlock(this.definition.body, scope);
        }
        catch (e) {
            if (e instanceof hooked_exceptions_1.default.Return)
                return e.value;
            throw e;
        }
        interpreter.endRecursion();
    }
    get arity() {
        const start = this.parameters.length - this.nullableParameters.length;
        const finish = this.parameters.length;
        return start === finish ? start : new range_1.Range(start, finish);
    }
    [util_1.default.inspect.custom]() {
        return this.toString();
    }
    toString() {
        return `<Function: ${this.address}>`;
    }
    get parameters() {
        return this.definition.parameters;
    }
}
exports.default = PFunction;
