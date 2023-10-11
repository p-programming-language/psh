"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utility_1 = require("../../utility");
const value_1 = tslib_1.__importDefault(require("./value"));
class PClassInstance extends value_1.default {
    constructor(parent, closure, interpreter, constructArguments) {
        super();
        this.parent = parent;
        this.closure = closure;
        this.interpreter = interpreter;
        this.constructArguments = constructArguments;
        this.name = this.parent.definition.name.lexeme;
        this.address = (0, utility_1.generateAddress)();
    }
    toString() {
        return this.name;
    }
}
exports.default = PClassInstance;
