"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
class Scope {
    constructor(enclosing) {
        this.enclosing = enclosing;
        this.variablesDefined = new Map;
        this.variableValues = new Map;
        this.variableOptions = new Map;
    }
    checkImmutability(name) {
        const isMutable = this.variableOptions.get(name.lexeme).mutable;
        const isDefined = this.variablesDefined.get(name.lexeme);
        if (!isMutable && isDefined)
            throw new errors_1.RuntimeError(`Attempt to assign to immutable variable '${name.lexeme}'`, name);
    }
    assign(name, value) {
        if (this.variableValues.has(name.lexeme)) {
            this.checkImmutability(name);
            this.variableValues.set(name.lexeme, value);
            this.variablesDefined.set(name.lexeme, typeof value !== "undefined");
            return;
        }
        if (this.enclosing !== undefined)
            return this.enclosing.assign(name, value);
    }
    assignAt(distance, name, value) {
        const scope = this.ancestor(distance);
        scope === null || scope === void 0 ? void 0 : scope.checkImmutability(name);
        scope === null || scope === void 0 ? void 0 : scope.variableValues.set(name.lexeme, value);
        this.variablesDefined.set(name.lexeme, typeof value !== "undefined");
    }
    get(name) {
        if (this.variableValues.has(name.lexeme))
            return this.variableValues.get(name.lexeme);
        if (this.enclosing !== undefined)
            return this.enclosing.get(name);
    }
    getAt(name, distance) {
        var _a;
        return (_a = this.ancestor(distance)) === null || _a === void 0 ? void 0 : _a.variableValues.get(name.lexeme);
    }
    define(name, value, options) {
        this.variableValues.set(name.lexeme, value);
        this.variableOptions.set(name.lexeme, options);
        this.variablesDefined.set(name.lexeme, typeof value !== "undefined");
    }
    ancestor(distance) {
        let env = this;
        for (let i = 0; i < distance; i++)
            env = env.enclosing;
        return env;
    }
}
exports.default = Scope;
