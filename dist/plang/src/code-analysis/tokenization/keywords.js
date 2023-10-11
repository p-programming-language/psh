"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYWORDS = void 0;
const tslib_1 = require("tslib");
const syntax_type_1 = tslib_1.__importDefault(require("./syntax-type"));
exports.KEYWORDS = {
    use: syntax_type_1.default.Use,
    from: syntax_type_1.default.From,
    in: syntax_type_1.default.In,
    is: syntax_type_1.default.Is,
    typeof: syntax_type_1.default.TypeOf,
    new: syntax_type_1.default.New,
    class: syntax_type_1.default.Class,
    mixin: syntax_type_1.default.Mixin,
    interface: syntax_type_1.default.Interface,
    return: syntax_type_1.default.Return,
    break: syntax_type_1.default.Break,
    next: syntax_type_1.default.Next,
    and: syntax_type_1.default.AmpersandAmpersand,
    or: syntax_type_1.default.PipePipe,
    not: syntax_type_1.default.Bang,
    fn: syntax_type_1.default.Function,
    if: syntax_type_1.default.If,
    every: syntax_type_1.default.Every,
    while: syntax_type_1.default.While,
    unless: syntax_type_1.default.Unless,
    until: syntax_type_1.default.Until,
    else: syntax_type_1.default.Else,
    mut: syntax_type_1.default.Mut,
    println: syntax_type_1.default.Println,
    undefined: syntax_type_1.default.Undefined,
    null: syntax_type_1.default.Null
};
