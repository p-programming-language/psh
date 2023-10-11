"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionTypeExpression = void 0;
const tslib_1 = require("tslib");
const singular_type_1 = require("./singular-type");
const utility_1 = require("../../../../utility");
const syntax_type_1 = tslib_1.__importDefault(require("../../../tokenization/syntax-type"));
class FunctionTypeExpression extends singular_type_1.SingularTypeExpression {
    constructor(parameterTypes, returnType) {
        const typeKeyword = (0, utility_1.fakeToken)(syntax_type_1.default.Identifier, "Function");
        super(typeKeyword);
        this.parameterTypes = parameterTypes;
        this.returnType = returnType;
    }
    get token() {
        return super.token;
    }
}
exports.FunctionTypeExpression = FunctionTypeExpression;
