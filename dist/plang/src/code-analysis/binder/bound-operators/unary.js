"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundUnaryOperator = exports.BoundUnaryOperatorType = void 0;
const tslib_1 = require("tslib");
const errors_1 = require("../../../errors");
const syntax_type_1 = tslib_1.__importDefault(require("../../tokenization/syntax-type"));
const singular_type_1 = tslib_1.__importDefault(require("../../type-checker/types/singular-type"));
const union_type_1 = tslib_1.__importDefault(require("../../type-checker/types/union-type"));
const array_type_1 = tslib_1.__importDefault(require("../../type-checker/types/array-type"));
var BoundUnaryOperatorType;
(function (BoundUnaryOperatorType) {
    BoundUnaryOperatorType[BoundUnaryOperatorType["Identity"] = 0] = "Identity";
    BoundUnaryOperatorType[BoundUnaryOperatorType["Negate"] = 1] = "Negate";
    BoundUnaryOperatorType[BoundUnaryOperatorType["Increment"] = 2] = "Increment";
    BoundUnaryOperatorType[BoundUnaryOperatorType["Decrement"] = 3] = "Decrement";
    BoundUnaryOperatorType[BoundUnaryOperatorType["Length"] = 4] = "Length";
    BoundUnaryOperatorType[BoundUnaryOperatorType["Not"] = 5] = "Not";
    BoundUnaryOperatorType[BoundUnaryOperatorType["BitwiseNot"] = 6] = "BitwiseNot";
})(BoundUnaryOperatorType || (exports.BoundUnaryOperatorType = BoundUnaryOperatorType = {}));
class BoundUnaryOperator {
    constructor(syntax, type, operandType, resultType) {
        this.syntax = syntax;
        this.type = type;
        this.operandType = operandType;
        if (!resultType)
            this.resultType = operandType;
        else
            this.resultType = resultType;
    }
    static get(operatorToken, operandType) {
        const operator = BOUND_UNARY_OPERATORS
            .find(op => op.syntax === operatorToken.syntax && operandType.isAssignableTo(op.operandType));
        if (!operator)
            throw new errors_1.TypeError(`Invalid operand type for '${operatorToken.lexeme}': ${operandType.toString()}`, operatorToken);
        return operator;
    }
}
exports.BoundUnaryOperator = BoundUnaryOperator;
const BOUND_UNARY_OPERATORS = [
    new BoundUnaryOperator(syntax_type_1.default.Plus, 0 /* BoundUnaryOperatorType.Identity */, new union_type_1.default([
        new singular_type_1.default("int"),
        new singular_type_1.default("float")
    ])),
    new BoundUnaryOperator(syntax_type_1.default.Minus, 1 /* BoundUnaryOperatorType.Negate */, new union_type_1.default([
        new singular_type_1.default("int"),
        new singular_type_1.default("float")
    ])),
    new BoundUnaryOperator(syntax_type_1.default.PlusPlus, 2 /* BoundUnaryOperatorType.Increment */, new union_type_1.default([
        new singular_type_1.default("int"),
        new singular_type_1.default("float")
    ])),
    new BoundUnaryOperator(syntax_type_1.default.MinusMinus, 3 /* BoundUnaryOperatorType.Decrement */, new union_type_1.default([
        new singular_type_1.default("int"),
        new singular_type_1.default("float")
    ])),
    new BoundUnaryOperator(syntax_type_1.default.Hashtag, 4 /* BoundUnaryOperatorType.Length */, new union_type_1.default([
        new array_type_1.default(new singular_type_1.default("any")),
        new singular_type_1.default("string")
    ]), new singular_type_1.default("int")),
    new BoundUnaryOperator(syntax_type_1.default.Bang, 5 /* BoundUnaryOperatorType.Not */, new singular_type_1.default("any"), new singular_type_1.default("bool")),
    new BoundUnaryOperator(syntax_type_1.default.Tilde, 6 /* BoundUnaryOperatorType.BitwiseNot */, new singular_type_1.default("int"))
];
