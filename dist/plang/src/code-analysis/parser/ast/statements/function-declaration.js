"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionDeclarationStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class FunctionDeclarationStatement extends __1.default.Statement {
    constructor(token, name, returnType, parameters, body) {
        super();
        this.token = token;
        this.name = name;
        this.returnType = returnType;
        this.parameters = parameters;
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitFunctionDeclarationStatement(this);
    }
}
exports.FunctionDeclarationStatement = FunctionDeclarationStatement;
