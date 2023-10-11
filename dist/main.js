"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("./plang/src");
var Class;
(function (Class) {
    Class["Comment"] = "psh-com";
    Class["Identifier"] = "psh-id";
    Class["Keyword"] = "psh-kw";
    Class["Class"] = "psh-class";
    Class["Function"] = "psh-fn";
    Class["String"] = "psh-str";
    Class["Number"] = "psh-num";
    Class["Operator"] = "psh-op";
    Class["Bracket1"] = "psh-b1";
    Class["Bracket2"] = "psh-b2";
    Class["Bracket3"] = "psh-b3";
})(Class || (Class = {}));
const KEYWORDS = Object.keys(src_1.KEYWORDS);
const TYPE_KEYWORDS = Array.from(src_1.INTRINSIC_TYPES.values());
const OPEN_BRACKETS = ["(", "[", "{"];
const CLOSED_BRACKETS = [")", "]", "}"];
const OPERATORS = [
    "@", "+", "-", "*", "/", "^", "%", ":",
    "<", ">", "=", "!", "?", "&", "|", "#",
    "'", '"', ".", ","
];
const TAB = "&ThickSpace;";
function extractLeadingWhitespaces(input) {
    const match = input.match(/\s+/);
    return match ? match[0] : "";
}
function splitPreservingQuotes(input) {
    const parts = input.match(/"([^"]+)"|'([^']+)'\s*|[^'"\s]+/g);
    return parts !== null && parts !== void 0 ? parts : [];
}
function highlightCodeBody(input) {
    const lines = input.split("\n");
    const indentations = lines.map(line => extractLeadingWhitespaces(line));
    const lineParts = lines.map(line => splitPreservingQuotes(line));
    const htmlLines = lineParts.map(parts => parts.map(part => indentations[parts.indexOf(part)] + highlightText(part)).join(" "));
    return htmlLines
        .join("\n")
        .replace(/  /g, TAB)
        .replace(/\t/g, TAB);
}
function highlightText(line) {
    const lexer = new src_1.Lexer(line);
    const tokens = lexer.tokenize();
    const html = [];
    let bracketDepth = 0;
    const getBracketClass = () => { var _a; return (_a = Class[("Bracket" + (bracketDepth % 3 + 1))]) !== null && _a !== void 0 ? _a : Class.Bracket1; };
    const createSpan = (_class, body) => `<span class=${_class}>${body}</span>`;
    const addSpan = (_class, body) => html.push(createSpan(_class, body));
    for (const token of tokens) {
        if (OPERATORS.includes(token.lexeme))
            addSpan(Class.Operator, token.lexeme);
        else if (KEYWORDS.includes(token.lexeme) || TYPE_KEYWORDS.includes(token.lexeme))
            addSpan(Class.Keyword, token.lexeme);
        else if (token.syntax === src_1.Syntax.Identifier)
            if (token.lexeme.toLowerCase() !== token.lexeme)
                addSpan(Class.Class, token.lexeme);
            else
                addSpan(Class.Identifier, token.lexeme);
        else if (token.syntax === src_1.Syntax.String) {
            const delimiter = token.lexeme.slice(1);
            addSpan(Class.String, createSpan(Class.Operator, delimiter) + token.value + createSpan(Class.Operator, delimiter));
        }
        else if (token.syntax === src_1.Syntax.Int || token.syntax === src_1.Syntax.Float)
            addSpan(Class.Number, token.lexeme);
        else if (OPEN_BRACKETS.includes(token.lexeme)) {
            addSpan(getBracketClass(), token.lexeme);
            bracketDepth++;
        }
        else if (CLOSED_BRACKETS.includes(token.lexeme)) {
            bracketDepth--;
            addSpan(getBracketClass(), token.lexeme);
        }
    }
    return html.join("");
}
console.log(highlightCodeBody("int x = 1"));
