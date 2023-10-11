"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mocha_1 = require("mocha");
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
require("should");
const lexer_1 = tslib_1.__importDefault(require("../code-analysis/tokenization/lexer"));
const syntax_type_1 = tslib_1.__importDefault(require("../code-analysis/tokenization/syntax-type"));
function tokenize(source) {
    const lexer = new lexer_1.default(source);
    (() => new lexer_1.default(source).tokenize()).should.not.throw();
    return lexer.tokenize();
}
const testDirectory = "./tests/";
const testFiles = (0, fs_1.readdirSync)(testDirectory)
    .filter(file => file.endsWith(".p"));
function runTestsForFile(filePath) {
    (0, mocha_1.it)(filePath, () => {
        const source = (0, fs_1.readFileSync)(filePath, "utf-8");
        const tokenizeSource = () => {
            const tokens = tokenize(source);
            tokens.length.should.be.greaterThan(0);
        };
        tokenizeSource.should.not.throw();
    });
}
(0, mocha_1.describe)(lexer_1.default.name, () => {
    (0, mocha_1.it)("tokenizes literals", () => {
        var _a, _b, _c, _d, _e;
        {
            const [token] = tokenize('"hello, world!"');
            token.lexeme.should.equal('"hello, world!"');
            (_a = token.value) === null || _a === void 0 ? void 0 : _a.should.equal("hello, world!");
            token.syntax.should.equal(syntax_type_1.default.String);
        }
        {
            const [token] = tokenize("123");
            token.lexeme.should.equal("123");
            (_b = token.value) === null || _b === void 0 ? void 0 : _b.should.equal(123);
            token.syntax.should.equal(syntax_type_1.default.Int);
        }
        {
            const [token] = tokenize("69.420");
            token.lexeme.should.equal("69.420");
            (_c = token.value) === null || _c === void 0 ? void 0 : _c.should.equal(69.42);
            token.syntax.should.equal(syntax_type_1.default.Float);
        }
        {
            const [token] = tokenize("null");
            token.lexeme.should.equal("null");
            (_d = token.value) === null || _d === void 0 ? void 0 : _d.should.equal(null);
            token.syntax.should.equal(syntax_type_1.default.Null);
        }
        {
            const [token] = tokenize("undefined");
            token.lexeme.should.equal("undefined");
            (_e = token.value) === null || _e === void 0 ? void 0 : _e.should.equal(undefined);
            token.syntax.should.equal(syntax_type_1.default.Undefined);
        }
    });
    (0, mocha_1.it)("tokenizes identifiers", () => {
        var _a, _b;
        {
            const [token] = tokenize("hello");
            token.lexeme.should.equal("hello");
            (_a = token.value) === null || _a === void 0 ? void 0 : _a.should.equal(undefined);
            token.syntax.should.equal(syntax_type_1.default.Identifier);
        }
        {
            const [token] = tokenize("abc123");
            token.lexeme.should.equal("abc123");
            (_b = token.value) === null || _b === void 0 ? void 0 : _b.should.equal(undefined);
            token.syntax.should.equal(syntax_type_1.default.Identifier);
        }
    });
    (0, mocha_1.it)("tokenizes type keywords", () => {
        var _a, _b, _c;
        {
            const [token] = tokenize("string");
            token.lexeme.should.equal("string");
            (_a = token.value) === null || _a === void 0 ? void 0 : _a.should.equal(undefined);
            token.syntax.should.equal(syntax_type_1.default.Identifier);
        }
        {
            const [token] = tokenize("int");
            token.lexeme.should.equal("int");
            (_b = token.value) === null || _b === void 0 ? void 0 : _b.should.equal(undefined);
            token.syntax.should.equal(syntax_type_1.default.Identifier);
        }
        {
            const [token] = tokenize("void");
            token.lexeme.should.equal("void");
            (_c = token.value) === null || _c === void 0 ? void 0 : _c.should.equal(undefined);
            token.syntax.should.equal(syntax_type_1.default.Identifier);
        }
    });
    (0, mocha_1.describe)("tokenizes general tests (tests/)", () => {
        testFiles.forEach((file) => {
            const filePath = path_1.default.join(testDirectory, file);
            runTestsForFile(filePath);
        });
    });
});
