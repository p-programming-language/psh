"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableDeclarationStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class VariableDeclarationStatement extends __1.default.Statement {
    constructor(typeRef, identifier, mutable, initializer) {
        super();
        this.typeRef = typeRef;
        this.identifier = identifier;
        this.mutable = mutable;
        this.initializer = initializer;
    }
    accept(visitor) {
        return visitor.visitVariableDeclarationStatement(this);
    }
    get token() {
        return this.typeRef.token;
    }
}
exports.VariableDeclarationStatement = VariableDeclarationStatement;
