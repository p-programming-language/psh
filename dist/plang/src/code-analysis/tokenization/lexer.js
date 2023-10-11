"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errors_1 = require("../../errors");
const token_1 = require("./token");
const keywords_1 = require("./keywords");
const array_stepper_1 = tslib_1.__importDefault(require("../array-stepper"));
const syntax_type_1 = tslib_1.__importDefault(require("./syntax-type"));
const VALID_IDENTIFIER = /[a-zA-Z_$]/;
const NUMERIC = /^[0-9]$/;
const WHITESPACE = /\s+/;
class Lexer extends array_stepper_1.default {
    constructor() {
        super(...arguments);
        this.line = 1;
        this.column = 1;
        this.lastLocation = new token_1.Location(this.line, this.column);
        this.currentLexemeCharacters = [];
        this.tokens = [];
    }
    /**
     * Lexes the entire input
     */
    tokenize() {
        while (!this.isFinished)
            this.lex();
        this.currentLexemeCharacters = [];
        this.addToken(syntax_type_1.default.EOF);
        return this.tokens;
    }
    /**
     * Lexes exactly one token
     */
    lex() {
        const char = this.current;
        if (char === "\n") {
            this.advance();
            return;
        }
        if (WHITESPACE.test(char))
            return this.skipWhiteSpace();
        switch (char) {
            case ";":
                return this.addToken(syntax_type_1.default.Semicolon, undefined, true);
            case ",":
                return this.addToken(syntax_type_1.default.Comma, undefined, true);
            case "@":
                return this.addToken(syntax_type_1.default.At, undefined, true);
            case "(":
                return this.addToken(syntax_type_1.default.LParen, undefined, true);
            case ")":
                return this.addToken(syntax_type_1.default.RParen, undefined, true);
            case "[":
                return this.addToken(syntax_type_1.default.LBracket, undefined, true);
            case "]":
                return this.addToken(syntax_type_1.default.RBracket, undefined, true);
            case "{":
                return this.addToken(syntax_type_1.default.LBrace, undefined, true);
            case "}":
                return this.addToken(syntax_type_1.default.RBrace, undefined, true);
            case ".":
                if (this.match("."))
                    return this.addToken(syntax_type_1.default.DotDot, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.Dot, undefined, true);
            case "#":
                if (this.match("#"))
                    return this.skipComment({ multiline: this.match(":") });
                else
                    return this.addToken(syntax_type_1.default.Hashtag, undefined, true);
            case "~":
                return this.addToken(syntax_type_1.default.Tilde, undefined, true);
            case ":": {
                if (this.match("="))
                    return this.addToken(syntax_type_1.default.ColonEqual, undefined, true);
                else if (this.match(":"))
                    return this.addToken(syntax_type_1.default.ColonColon, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.Colon, undefined, true);
            }
            case "?": {
                if (this.match("?"))
                    if (this.match("="))
                        return this.addToken(syntax_type_1.default.QuestionQuestionEqual, undefined, true);
                    else
                        return this.addToken(syntax_type_1.default.QuestionQuestion, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.Question, undefined, true);
            }
            case "&": {
                if (this.match("="))
                    return this.addToken(syntax_type_1.default.AmpersandEqual, undefined, true);
                else if (this.match("&"))
                    if (this.match("="))
                        return this.addToken(syntax_type_1.default.AmpersandAmpersandEqual, undefined, true);
                    else
                        return this.addToken(syntax_type_1.default.AmpersandAmpersand, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.Ampersand, undefined, true);
            }
            case "|": {
                if (this.match("="))
                    return this.addToken(syntax_type_1.default.PipeEqual, undefined, true);
                else if (this.match("|"))
                    if (this.match("="))
                        return this.addToken(syntax_type_1.default.PipePipeEqual, undefined, true);
                    else
                        return this.addToken(syntax_type_1.default.PipePipe, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.Pipe, undefined, true);
            }
            case "!": {
                if (this.match("="))
                    return this.addToken(syntax_type_1.default.BangEqual, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.Bang, undefined, true);
            }
            case ">": {
                if (this.match("="))
                    return this.addToken(syntax_type_1.default.GTE, undefined, true);
                else if (this.match(">"))
                    return this.addToken(syntax_type_1.default.RDoubleArrow, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.GT, undefined, true);
            }
            case "<": {
                if (this.match("="))
                    return this.addToken(syntax_type_1.default.LTE, undefined, true);
                else if (this.match("<"))
                    return this.addToken(syntax_type_1.default.LDoubleArrow, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.LT, undefined, true);
            }
            case "+": {
                if (this.match("="))
                    return this.addToken(syntax_type_1.default.PlusEqual, undefined, true);
                else if (this.match("+"))
                    return this.addToken(syntax_type_1.default.PlusPlus, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.Plus, undefined, true);
            }
            case "-": {
                if (this.match("="))
                    return this.addToken(syntax_type_1.default.MinusEqual, undefined, true);
                else if (this.match("-"))
                    return this.addToken(syntax_type_1.default.MinusMinus, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.Minus, undefined, true);
            }
            case "*": {
                if (this.match("*"))
                    if (this.match("="))
                        return this.addToken(syntax_type_1.default.StarStarEqual, undefined, true);
                    else
                        return this.addToken(syntax_type_1.default.StarStar, undefined, true);
                else if (this.match("="))
                    return this.addToken(syntax_type_1.default.StarEqual, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.Star, undefined, true);
            }
            case "/": {
                if (this.match("="))
                    return this.addToken(syntax_type_1.default.SlashEqual, undefined, true);
                else if (this.match("/"))
                    if (this.match("="))
                        return this.addToken(syntax_type_1.default.SlashSlashEqual, undefined, true);
                    else
                        return this.addToken(syntax_type_1.default.SlashSlash, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.Slash, undefined, true);
            }
            case "^": {
                if (this.match("="))
                    return this.addToken(syntax_type_1.default.CaratEqual, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.Carat, undefined, true);
            }
            case "%": {
                if (this.match("="))
                    return this.addToken(syntax_type_1.default.PercentEqual, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.Percent, undefined, true);
            }
            case "=": {
                if (this.match("="))
                    return this.addToken(syntax_type_1.default.EqualEqual, undefined, true);
                else
                    return this.addToken(syntax_type_1.default.Equal, undefined, true);
            }
            case '"':
            case "'":
                return this.readString();
            default: {
                if (NUMERIC.test(char))
                    return this.readNumber();
                else if (VALID_IDENTIFIER.test(char)) {
                    const identifierLexeme = this.readIdentifier();
                    const keywordSyntax = Object.keys(keywords_1.KEYWORDS).includes(identifierLexeme) ? keywords_1.KEYWORDS[identifierLexeme] : false;
                    if (keywordSyntax)
                        this.addToken(keywordSyntax);
                    else if (identifierLexeme === "true")
                        this.addToken(syntax_type_1.default.Boolean, true);
                    else if (identifierLexeme === "false")
                        this.addToken(syntax_type_1.default.Boolean, false);
                    else if (identifierLexeme === "null")
                        this.addToken(syntax_type_1.default.Null);
                    else if (identifierLexeme === "undefined")
                        this.addToken(syntax_type_1.default.Undefined);
                    else
                        this.addToken(syntax_type_1.default.Identifier);
                    return;
                }
                throw new errors_1.LexerSyntaxError(`Unexpected character: ${char}`, this.line, this.column);
            }
        }
    }
    /**
     * Skip current whitespace and all whitespaces after
     */
    skipWhiteSpace() {
        while (WHITESPACE.test(this.current))
            this.advance();
    }
    /**
     * Skip comment syntax
     */
    skipComment({ multiline }) {
        const condition = () => multiline ?
            this.current === ":" && this.peek() === "#" && this.peek(2) === "#"
            : this.current === "\n" || this.isFinished;
        const consumeEndOfComment = () => multiline ?
            this.advanceMultiple(3)
            : this.advance();
        while (!condition())
            this.advance();
        consumeEndOfComment();
        this.currentLexemeCharacters = [];
    }
    /**
     * Skip current whitespace and all whitespaces after
     */
    readIdentifier() {
        let lexeme = "";
        while (!this.isFinished && (VALID_IDENTIFIER.test(this.current) || NUMERIC.test(this.current)))
            lexeme += this.advance();
        return lexeme;
    }
    readString() {
        const delimiter = this.advance();
        while (this.current !== delimiter)
            if (this.advance(true) === "\n")
                throw new errors_1.LexerSyntaxError("Unterminated string literal", this.line, this.column);
        this.advance(); // advance final delimiter
        const stringContents = this.currentLexeme.slice(1, -1);
        this.addToken(syntax_type_1.default.String, stringContents);
    }
    readNumber() {
        let usedDecimal = false;
        while (/^[0-9]$/.test(this.current) || (this.current === "." && this.peek() !== ".")) {
            if (this.advance() === ".")
                if (usedDecimal)
                    throw new errors_1.LexerSyntaxError("Malformed number", this.line, this.column);
                else
                    usedDecimal = true;
        }
        this.addToken(usedDecimal ? syntax_type_1.default.Float : syntax_type_1.default.Int, parseFloat(this.currentLexeme));
    }
    addToken(type, value, advance = false) {
        if (advance)
            this.advance();
        const locationSpan = new token_1.LocationSpan(this.lastLocation, this.currentLocation);
        this.tokens.push(new token_1.Token(type, this.currentLexeme, type === syntax_type_1.default.Null ? null : value, locationSpan));
        this.currentLexemeCharacters = [];
        this.lastLocation = this.currentLocation;
    }
    match(char) {
        if (this.peek() === char) {
            this.advance();
            return true;
        }
        return false;
    }
    advanceMultiple(times, allowWhitespace) {
        for (let i = 0; i < times; i++)
            this.advance(allowWhitespace);
    }
    advance(allowWhitespace = false) {
        const char = this.current;
        const isWhiteSpace = WHITESPACE.test(char);
        if (!isWhiteSpace || allowWhitespace) // don't add to lexeme if whitespace
            this.currentLexemeCharacters.push(char);
        if (char === "\n") {
            this.line++;
            this.column = 1;
            this.lastLocation = this.currentLocation;
        }
        else
            this.column++;
        this.position++;
        if (isWhiteSpace)
            this.lastLocation = this.currentLocation;
        return char;
    }
    get currentLexeme() {
        return this.currentLexemeCharacters.join("");
    }
    get currentLocation() {
        return new token_1.Location(this.line, this.column);
    }
}
exports.default = Lexer;
