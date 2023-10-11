"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyDeclarationStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class PropertyDeclarationStatement extends __1.default.Statement {
    constructor(modifiers, typeRef, identifier, mutable, initializer) {
        super();
        this.modifiers = modifiers;
        this.typeRef = typeRef;
        this.identifier = identifier;
        this.mutable = mutable;
        this.initializer = initializer;
    }
    accept(visitor) {
        return visitor.visitPropertyDeclarationStatement(this);
    }
    get token() {
        return this.typeRef.token;
    }
}
exports.PropertyDeclarationStatement = PropertyDeclarationStatement;
