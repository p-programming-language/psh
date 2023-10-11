"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeDeclarationStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class TypeDeclarationStatement extends __1.default.Statement {
    constructor(name, typeRef) {
        super();
        this.name = name;
        this.typeRef = typeRef;
    }
    accept(visitor) {
        return visitor.visitTypeDeclarationStatement(this);
    }
    get token() {
        return this.name;
    }
}
exports.TypeDeclarationStatement = TypeDeclarationStatement;
