"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayTypeExpression = void 0;
const tslib_1 = require("tslib");
const singular_type_1 = require("./singular-type");
const utility_1 = require("../../../../utility");
const syntax_type_1 = tslib_1.__importDefault(require("../../../tokenization/syntax-type"));
class ArrayTypeExpression extends singular_type_1.SingularTypeExpression {
    constructor(elementType) {
        const typeKeyword = (0, utility_1.fakeToken)(syntax_type_1.default.Identifier, "Array");
        super(typeKeyword, [elementType]);
        this.elementType = elementType;
    }
    get token() {
        return super.token;
    }
}
exports.ArrayTypeExpression = ArrayTypeExpression;
