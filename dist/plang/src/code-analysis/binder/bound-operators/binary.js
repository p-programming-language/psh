"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundBinaryOperator = exports.BoundBinaryOperatorType = void 0;
const tslib_1 = require("tslib");
const errors_1 = require("../../../errors");
const syntax_type_1 = tslib_1.__importDefault(require("../../tokenization/syntax-type"));
const union_type_1 = tslib_1.__importDefault(require("../../type-checker/types/union-type"));
const singular_type_1 = tslib_1.__importDefault(require("../../type-checker/types/singular-type"));
const array_type_1 = tslib_1.__importDefault(require("../../type-checker/types/array-type"));
var BoundBinaryOperatorType;
(function (BoundBinaryOperatorType) {
    BoundBinaryOperatorType[BoundBinaryOperatorType["Addition"] = 0] = "Addition";
    BoundBinaryOperatorType[BoundBinaryOperatorType["Subtraction"] = 1] = "Subtraction";
    BoundBinaryOperatorType[BoundBinaryOperatorType["Multiplication"] = 2] = "Multiplication";
    BoundBinaryOperatorType[BoundBinaryOperatorType["Division"] = 3] = "Division";
    BoundBinaryOperatorType[BoundBinaryOperatorType["IntDivision"] = 4] = "IntDivision";
    BoundBinaryOperatorType[BoundBinaryOperatorType["Exponentation"] = 5] = "Exponentation";
    BoundBinaryOperatorType[BoundBinaryOperatorType["Modulus"] = 6] = "Modulus";
    BoundBinaryOperatorType[BoundBinaryOperatorType["EqualTo"] = 7] = "EqualTo";
    BoundBinaryOperatorType[BoundBinaryOperatorType["NotEqualTo"] = 8] = "NotEqualTo";
    BoundBinaryOperatorType[BoundBinaryOperatorType["LogicalAnd"] = 9] = "LogicalAnd";
    BoundBinaryOperatorType[BoundBinaryOperatorType["LogicalOr"] = 10] = "LogicalOr";
    BoundBinaryOperatorType[BoundBinaryOperatorType["LessThan"] = 11] = "LessThan";
    BoundBinaryOperatorType[BoundBinaryOperatorType["GreaterThan"] = 12] = "GreaterThan";
    BoundBinaryOperatorType[BoundBinaryOperatorType["LessThanOrEqual"] = 13] = "LessThanOrEqual";
    BoundBinaryOperatorType[BoundBinaryOperatorType["GreaterThanOrEqual"] = 14] = "GreaterThanOrEqual";
    BoundBinaryOperatorType[BoundBinaryOperatorType["And"] = 15] = "And";
    BoundBinaryOperatorType[BoundBinaryOperatorType["Or"] = 16] = "Or";
    BoundBinaryOperatorType[BoundBinaryOperatorType["BitwiseAnd"] = 17] = "BitwiseAnd";
    BoundBinaryOperatorType[BoundBinaryOperatorType["BitwiseOr"] = 18] = "BitwiseOr";
    BoundBinaryOperatorType[BoundBinaryOperatorType["BitwiseXor"] = 19] = "BitwiseXor";
    BoundBinaryOperatorType[BoundBinaryOperatorType["ShiftLeft"] = 20] = "ShiftLeft";
    BoundBinaryOperatorType[BoundBinaryOperatorType["ShiftRight"] = 21] = "ShiftRight";
    BoundBinaryOperatorType[BoundBinaryOperatorType["NullishCoalescing"] = 22] = "NullishCoalescing";
    BoundBinaryOperatorType[BoundBinaryOperatorType["Concatenation"] = 23] = "Concatenation";
    BoundBinaryOperatorType[BoundBinaryOperatorType["Repetition"] = 24] = "Repetition";
    BoundBinaryOperatorType[BoundBinaryOperatorType["Split"] = 25] = "Split";
    BoundBinaryOperatorType[BoundBinaryOperatorType["Combination"] = 26] = "Combination";
})(BoundBinaryOperatorType || (exports.BoundBinaryOperatorType = BoundBinaryOperatorType = {}));
class BoundBinaryOperator {
    constructor(syntaxes, type, leftType, rightType, resultType) {
        this.syntaxes = syntaxes;
        this.type = type;
        this.leftType = leftType;
        if (rightType && !resultType) {
            this.resultType = rightType;
            this.rightType = leftType;
        }
        else if (!rightType && !resultType) {
            this.resultType = leftType;
            this.rightType = leftType;
        }
        else {
            this.resultType = resultType;
            this.rightType = rightType;
        }
    }
    static get(operatorToken, leftType, rightType) {
        const operator = BOUND_BINARY_OPERATORS
            .find(op => op.syntaxes.includes(operatorToken.syntax)
            && leftType.isAssignableTo(op.leftType)
            && rightType.isAssignableTo(op.rightType));
        if (!operator)
            throw new errors_1.TypeError(`Invalid operand types for '${operatorToken.lexeme}': ${leftType.toString()} ${operatorToken.lexeme} ${rightType.toString()}`, operatorToken);
        return operator;
    }
}
exports.BoundBinaryOperator = BoundBinaryOperator;
const intOrFloat = new union_type_1.default([
    new singular_type_1.default("int"),
    new singular_type_1.default("float")
]);
const BOUND_BINARY_OPERATORS = [
    new BoundBinaryOperator([syntax_type_1.default.Plus, syntax_type_1.default.PlusEqual], BoundBinaryOperatorType.Addition, intOrFloat),
    new BoundBinaryOperator([syntax_type_1.default.Plus, syntax_type_1.default.PlusEqual], BoundBinaryOperatorType.Concatenation, new singular_type_1.default("string")),
    new BoundBinaryOperator([syntax_type_1.default.Minus, syntax_type_1.default.MinusEqual], BoundBinaryOperatorType.Subtraction, intOrFloat),
    new BoundBinaryOperator([syntax_type_1.default.Star, syntax_type_1.default.StarEqual], BoundBinaryOperatorType.Multiplication, intOrFloat),
    new BoundBinaryOperator([syntax_type_1.default.Star, syntax_type_1.default.StarEqual], BoundBinaryOperatorType.Repetition, new singular_type_1.default("string"), new singular_type_1.default("int"), new singular_type_1.default("string")),
    new BoundBinaryOperator([syntax_type_1.default.Slash, syntax_type_1.default.SlashEqual], BoundBinaryOperatorType.Division, intOrFloat),
    new BoundBinaryOperator([syntax_type_1.default.Slash, syntax_type_1.default.SlashEqual], BoundBinaryOperatorType.Split, new singular_type_1.default("string"), new singular_type_1.default("string"), new array_type_1.default(new singular_type_1.default("string"))),
    new BoundBinaryOperator([syntax_type_1.default.SlashSlash, syntax_type_1.default.SlashSlashEqual], BoundBinaryOperatorType.IntDivision, intOrFloat, intOrFloat, new singular_type_1.default("int")),
    new BoundBinaryOperator([syntax_type_1.default.Carat, syntax_type_1.default.CaratEqual, syntax_type_1.default.StarStar, syntax_type_1.default.StarStarEqual], BoundBinaryOperatorType.Exponentation, intOrFloat),
    new BoundBinaryOperator([syntax_type_1.default.Percent, syntax_type_1.default.PercentEqual], BoundBinaryOperatorType.Modulus, intOrFloat),
    new BoundBinaryOperator([syntax_type_1.default.EqualEqual], BoundBinaryOperatorType.EqualTo, new singular_type_1.default("any"), new singular_type_1.default("any"), new singular_type_1.default("bool")),
    new BoundBinaryOperator([syntax_type_1.default.BangEqual], BoundBinaryOperatorType.NotEqualTo, new singular_type_1.default("any"), new singular_type_1.default("any"), new singular_type_1.default("bool")),
    new BoundBinaryOperator([syntax_type_1.default.LT], BoundBinaryOperatorType.LessThan, intOrFloat, intOrFloat, new singular_type_1.default("bool")),
    new BoundBinaryOperator([syntax_type_1.default.GT], BoundBinaryOperatorType.GreaterThan, intOrFloat, intOrFloat, new singular_type_1.default("bool")),
    new BoundBinaryOperator([syntax_type_1.default.LTE], BoundBinaryOperatorType.LessThanOrEqual, intOrFloat, intOrFloat, new singular_type_1.default("bool")),
    new BoundBinaryOperator([syntax_type_1.default.GTE], BoundBinaryOperatorType.GreaterThanOrEqual, intOrFloat, intOrFloat, new singular_type_1.default("bool")),
    new BoundBinaryOperator([syntax_type_1.default.AmpersandAmpersand, syntax_type_1.default.AmpersandAmpersandEqual], BoundBinaryOperatorType.And, new singular_type_1.default("any"), new singular_type_1.default("any"), new singular_type_1.default("bool")),
    new BoundBinaryOperator([syntax_type_1.default.PipePipe, syntax_type_1.default.PipePipeEqual], BoundBinaryOperatorType.Or, new singular_type_1.default("any"), new singular_type_1.default("any"), new singular_type_1.default("bool")),
    new BoundBinaryOperator([syntax_type_1.default.Ampersand, syntax_type_1.default.AmpersandEqual], BoundBinaryOperatorType.BitwiseAnd, new singular_type_1.default("int")),
    new BoundBinaryOperator([syntax_type_1.default.Pipe, syntax_type_1.default.PipeEqual], BoundBinaryOperatorType.BitwiseOr, new singular_type_1.default("int")),
    new BoundBinaryOperator([syntax_type_1.default.LDoubleArrow], BoundBinaryOperatorType.ShiftLeft, new singular_type_1.default("int")),
    new BoundBinaryOperator([syntax_type_1.default.RDoubleArrow], BoundBinaryOperatorType.ShiftRight, new singular_type_1.default("int")),
    new BoundBinaryOperator([syntax_type_1.default.Tilde], BoundBinaryOperatorType.BitwiseXor, new singular_type_1.default("int")),
    new BoundBinaryOperator([syntax_type_1.default.QuestionQuestion, syntax_type_1.default.QuestionQuestionEqual], BoundBinaryOperatorType.NullishCoalescing, new singular_type_1.default("any")),
];
