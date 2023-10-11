"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassDeclarationStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class ClassDeclarationStatement extends __1.default.Statement {
    constructor(keyword, name, body, typeRef, mixins, superclass) {
        super();
        this.keyword = keyword;
        this.name = name;
        this.body = body;
        this.typeRef = typeRef;
        this.mixins = mixins;
        this.superclass = superclass;
    }
    accept(visitor) {
        return visitor.visitClassDeclarationStatement(this);
    }
    get token() {
        return this.keyword;
    }
}
exports.ClassDeclarationStatement = ClassDeclarationStatement;
