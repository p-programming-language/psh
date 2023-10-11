"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _1 = require(".");
const syntax_type_1 = tslib_1.__importDefault(require("../tokenization/syntax-type"));
class TypeAnalyzer extends _1.Parser {
    constructor(tokens, runner, typeTracker) {
        super(tokens, runner);
        this.typeTracker = typeTracker;
        this.typeAnalyzer = this;
    }
    analyze() {
        while (!this.isFinished)
            if (this.match(syntax_type_1.default.Interface)) {
                this.declareTypeStub();
                const declaration = this.parseInterfaceType();
                this.consumeSemicolons();
                this.typeTracker.defineType(declaration.name.lexeme, declaration);
            }
            else if (this.match(syntax_type_1.default.Class)) {
                this.declareTypeStub();
                const declaration = this.parseClassDeclaration();
                this.consumeSemicolons();
                this.typeTracker.defineType(declaration.name.lexeme, declaration.typeRef);
            }
            else if (this.check(syntax_type_1.default.Identifier) && this.current.lexeme === "type") {
                const [name, aliasedType] = this.parseTypeAlias();
                this.consumeSemicolons();
                this.typeTracker.defineType(name.lexeme, aliasedType);
            }
            else
                this.advance();
    }
    declareTypeStub() {
        const name = this.current;
        if (name && name.syntax === syntax_type_1.default.Identifier)
            this.typeTracker.declareType(name.lexeme);
    }
}
exports.default = TypeAnalyzer;
