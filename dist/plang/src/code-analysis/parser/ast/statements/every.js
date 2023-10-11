"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EveryStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class EveryStatement extends __1.default.Statement {
    constructor(token, elementDeclarations, iterable, body) {
        super();
        this.token = token;
        this.elementDeclarations = elementDeclarations;
        this.iterable = iterable;
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitEveryStatement(this);
    }
}
exports.EveryStatement = EveryStatement;
