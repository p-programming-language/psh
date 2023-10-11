"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSTFIX_SYNTAXES = exports.UNARY_SYNTAXES = exports.LITERAL_SYNTAXES = exports.COMPOUND_ASSIGNMENT_SYNTAXES = void 0;
const tslib_1 = require("tslib");
const syntax_type_1 = tslib_1.__importDefault(require("./syntax-type"));
exports.COMPOUND_ASSIGNMENT_SYNTAXES = [
    syntax_type_1.default.PlusEqual, syntax_type_1.default.MinusEqual,
    syntax_type_1.default.StarEqual, syntax_type_1.default.SlashEqual, syntax_type_1.default.SlashSlashEqual,
    syntax_type_1.default.CaratEqual, syntax_type_1.default.StarStarEqual, syntax_type_1.default.PercentEqual,
    syntax_type_1.default.AmpersandEqual, syntax_type_1.default.PipeEqual,
    syntax_type_1.default.AmpersandAmpersandEqual, syntax_type_1.default.PipePipeEqual,
    syntax_type_1.default.QuestionQuestionEqual
];
exports.LITERAL_SYNTAXES = [
    syntax_type_1.default.Boolean,
    syntax_type_1.default.String,
    syntax_type_1.default.Float,
    syntax_type_1.default.Int,
    syntax_type_1.default.Null,
    syntax_type_1.default.Undefined
];
exports.UNARY_SYNTAXES = [
    syntax_type_1.default.Plus, syntax_type_1.default.Minus,
    syntax_type_1.default.Bang,
    syntax_type_1.default.Tilde,
    syntax_type_1.default.PlusPlus, syntax_type_1.default.MinusMinus,
    syntax_type_1.default.Hashtag,
    syntax_type_1.default.TypeOf,
    syntax_type_1.default.New
];
exports.POSTFIX_SYNTAXES = [
    syntax_type_1.default.Dot,
    syntax_type_1.default.LParen,
    syntax_type_1.default.LBracket
];
