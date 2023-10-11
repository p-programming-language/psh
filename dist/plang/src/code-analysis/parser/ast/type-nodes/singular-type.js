"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingularTypeExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class SingularTypeExpression extends __1.default.TypeRef {
    constructor(name, typeArguments) {
        super();
        this.name = name;
        this.typeArguments = typeArguments;
    }
    get isGeneric() {
        if (!this.typeArguments)
            return false;
        return this.typeArguments.length > 0;
    }
    get token() {
        return this.name;
    }
}
exports.SingularTypeExpression = SingularTypeExpression;
