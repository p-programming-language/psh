"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const parser_1 = require("../src/code-analysis/parser");
const type_checker_1 = require("../src/code-analysis/type-checker");
const lexer_1 = tslib_1.__importDefault(require("../src/code-analysis/tokenization/lexer"));
const type_tracker_1 = tslib_1.__importDefault(require("../src/code-analysis/parser/type-tracker"));
const type_analyzer_1 = tslib_1.__importDefault(require("../src/code-analysis/parser/type-analyzer"));
const resolver_1 = tslib_1.__importDefault(require("../src/code-analysis/resolver"));
const binder_1 = tslib_1.__importDefault(require("../src/code-analysis/binder"));
const interpreter_1 = tslib_1.__importDefault(require("../src/runtime/interpreter"));
class PHost {
    constructor(runner, fileName) {
        this.runner = runner;
        this.typeTracker = new type_tracker_1.default;
        this.resolver = new resolver_1.default;
        this.binder = new binder_1.default(this.typeTracker);
        this.typeChecker = new type_checker_1.TypeChecker;
        this.interpreter = new interpreter_1.default(runner, this.resolver, this.binder, fileName);
    }
    createParser(source) {
        const lexer = new lexer_1.default(source);
        const tokens = lexer.tokenize();
        const typeAnalyzer = new type_analyzer_1.default(tokens, this.runner, this.typeTracker);
        typeAnalyzer.analyze();
        return new parser_1.Parser(tokens, this.runner, typeAnalyzer);
    }
}
exports.default = PHost;
