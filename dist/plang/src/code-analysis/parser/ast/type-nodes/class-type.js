"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassTypeExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class ClassTypeExpression extends __1.default.TypeRef {
    constructor(name, members, mixinTypes, superclassType
    // public readonly typeParameters?: TypeParameterExpression[]
    ) {
        super();
        this.name = name;
        this.members = members;
        this.mixinTypes = mixinTypes;
        this.superclassType = superclassType;
    }
    get token() {
        return this.name;
    }
}
exports.ClassTypeExpression = ClassTypeExpression;
