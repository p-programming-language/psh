"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodDeclarationStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class MethodDeclarationStatement extends __1.default.Statement {
    constructor(modifiers, token, name, returnType, parameters, body) {
        super();
        this.modifiers = modifiers;
        this.token = token;
        this.name = name;
        this.returnType = returnType;
        this.parameters = parameters;
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitMethodDeclarationStatement(this);
    }
}
exports.MethodDeclarationStatement = MethodDeclarationStatement;
