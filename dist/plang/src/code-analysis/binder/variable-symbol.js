"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
class VariableSymbol {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
    [util_1.default.inspect.custom]() {
        return this.toString();
    }
    toString(colors) {
        return `${this.type.toString(colors)} ${this.name.lexeme}`;
    }
}
exports.default = VariableSymbol;
