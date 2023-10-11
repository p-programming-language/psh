"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errors_1 = require("../../errors");
const syntax_type_1 = tslib_1.__importDefault(require("../tokenization/syntax-type"));
const array_stepper_1 = tslib_1.__importDefault(require("../array-stepper"));
class TokenStepper extends array_stepper_1.default {
    consumeSemicolons() {
        while (this.match(syntax_type_1.default.Semicolon))
            ;
    }
    /**
     * Expects `syntax` to exist, and throws if it does not
     *
     * Advances the parser if it does
     */
    consume(syntax, expectedOverride) {
        const gotSyntax = this.current ? syntax_type_1.default[this.current.syntax] : "EOF";
        if (!this.match(syntax))
            throw new errors_1.ParserSyntaxError(`Expected ${expectedOverride !== null && expectedOverride !== void 0 ? expectedOverride : `'${syntax_type_1.default[syntax]}'`}, got ${gotSyntax}`, this.current);
        return this.previous();
    }
    /**
     * Advances to the next token
     * @returns The previous token
     */
    advance() {
        const token = this.current;
        if (!this.isFinished)
            this.position++;
        return token;
    }
    /**
     * @returns The previous token
     */
    previous() {
        return this.peek(-1);
    }
    /**
     * Checks for a set of syntax types, and consumes it if one exists
     * @returns True if the current syntax matches any one syntax in `syntaxSet`
     */
    matchSet(syntaxes) {
        return this.match(...syntaxes);
    }
    /**
     * Checks for a syntax type, and consumes it if it exists
     * @returns True if the current syntax matches any one syntax in `syntaxes`
     */
    match(...syntaxes) {
        for (const syntax of syntaxes)
            if (this.check(syntax)) {
                this.advance();
                return true;
            }
        return false;
    }
    /**
     * @returns True if the syntax at `offset` matches any one syntax in `syntaxes`
     */
    checkSet(syntaxes, offset = 0) {
        for (const syntax of syntaxes)
            if (this.check(syntax, offset))
                return true;
        return false;
    }
    /**
     * @returns True if the syntax at `offset` matches `syntax`
     */
    check(syntax, offset = 0) {
        var _a;
        return ((_a = this.peek(offset)) === null || _a === void 0 ? void 0 : _a.syntax) === syntax;
    }
    get isFinished() {
        return this.check(syntax_type_1.default.EOF);
    }
}
exports.default = TokenStepper;
