"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mocha_1 = require("mocha");
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
require("should");
const syntax_type_1 = tslib_1.__importDefault(require("../code-analysis/tokenization/syntax-type"));
const binder_1 = tslib_1.__importDefault(require("../code-analysis/binder"));
const p_1 = tslib_1.__importDefault(require("../../tools/p"));
const literal_1 = tslib_1.__importDefault(require("../code-analysis/binder/bound-expressions/literal"));
const unary_1 = tslib_1.__importDefault(require("../code-analysis/binder/bound-expressions/unary"));
const binary_1 = tslib_1.__importDefault(require("../code-analysis/binder/bound-expressions/binary"));
const array_literal_1 = tslib_1.__importDefault(require("../code-analysis/binder/bound-expressions/array-literal"));
const expression_1 = tslib_1.__importDefault(require("../code-analysis/binder/bound-statements/expression"));
const variable_declaration_1 = tslib_1.__importDefault(require("../code-analysis/binder/bound-statements/variable-declaration"));
const access_1 = tslib_1.__importDefault(require("../code-analysis/binder/bound-expressions/access"));
const identifier_1 = tslib_1.__importDefault(require("../code-analysis/binder/bound-expressions/identifier"));
const call_1 = tslib_1.__importDefault(require("../code-analysis/binder/bound-expressions/call"));
function bind(source) {
    const p = new p_1.default("test");
    const parser = p.createParser(source);
    const { imports, program: ast } = parser.parse();
    p.host.interpreter.evaluate(imports);
    return p.host.binder.bindStatements(ast);
}
const testDirectory = "./tests/";
const testFiles = (0, fs_1.readdirSync)(testDirectory)
    .filter(file => file.endsWith(".p"));
function runTestsForFile(filePath) {
    (0, mocha_1.it)(filePath, () => {
        const source = (0, fs_1.readFileSync)(filePath, "utf-8");
        const bindFile = () => bind(source);
        bindFile.should.not.throw();
    });
}
(0, mocha_1.describe)(binder_1.default.name, () => {
    (0, mocha_1.it)("binds literals", () => {
        (0, mocha_1.it)("strings", () => {
            var _a, _b;
            const [node] = bind('"hello"');
            node.should.be.an.instanceof(expression_1.default);
            const expr = node.expression;
            expr.should.be.an.instanceof(literal_1.default);
            expr.type.isSingular().should.be.true();
            const type = expr.type;
            type.name.should.equal("string");
            (_a = type.typeArguments) === null || _a === void 0 ? void 0 : _a.should.be.undefined();
            expr.token.syntax.should.equal(syntax_type_1.default.String);
            expr.token.lexeme.should.equal('"hello"');
            (_b = expr.token.value) === null || _b === void 0 ? void 0 : _b.should.equal("hello");
        });
        (0, mocha_1.it)("integers", () => {
            var _a, _b;
            const [node] = bind("123");
            node.should.be.an.instanceof(expression_1.default);
            const expr = node.expression;
            expr.should.be.an.instanceof(literal_1.default);
            expr.type.isSingular().should.be.true();
            const type = expr.type;
            type.name.should.equal("int");
            (_a = type.typeArguments) === null || _a === void 0 ? void 0 : _a.should.be.undefined();
            expr.token.syntax.should.equal(syntax_type_1.default.Int);
            expr.token.lexeme.should.equal("123");
            (_b = expr.token.value) === null || _b === void 0 ? void 0 : _b.should.equal(123);
        });
        (0, mocha_1.it)("arrays", () => {
            var _a, _b, _c;
            const [node] = bind("[1,'a',true]");
            node.should.be.an.instanceof(expression_1.default);
            const expr = node.expression;
            expr.should.be.an.instanceof(array_literal_1.default);
            const literal = expr;
            literal.type.isUnion().should.be.true();
            literal.type.toString().should.equal("int | string | bool");
            const [one, two, three] = literal.elements;
            one.type.isSingular().should.be.true();
            one.type.toString().should.equal("int");
            one.token.syntax.should.equal(syntax_type_1.default.Int);
            one.token.lexeme.should.equal("1");
            (_a = one.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(1);
            two.type.isSingular().should.be.true();
            two.type.toString().should.equal("string");
            two.token.syntax.should.equal(syntax_type_1.default.String);
            two.token.lexeme.should.equal("'a'");
            (_b = two.token.value) === null || _b === void 0 ? void 0 : _b.should.equal("a");
            three.type.isSingular().should.be.true();
            three.type.toString().should.equal("bool");
            three.token.syntax.should.equal(syntax_type_1.default.Boolean);
            three.token.lexeme.should.equal("true");
            (_c = three.token.value) === null || _c === void 0 ? void 0 : _c.should.equal(true);
        });
    });
    (0, mocha_1.it)("binds unary expressions", () => {
        var _a;
        {
            const [node] = bind("!123");
            node.should.be.an.instanceof(expression_1.default);
            const expr = node.expression;
            expr.should.be.an.instanceof(unary_1.default);
            const unary = expr;
            unary.operator.syntax.should.equal(syntax_type_1.default.Bang);
            unary.operator.resultType.name.should.equal("bool");
            unary.operand.type.name.should.equal("123");
            unary.operand.token.syntax.should.equal(syntax_type_1.default.Int);
            unary.operand.token.lexeme.should.equal("123");
            (_a = unary.operand.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(123);
        }
    });
    (0, mocha_1.it)("binds binary expressions", () => {
        var _a, _b;
        {
            const [node] = bind("false && true");
            node.should.be.an.instanceof(expression_1.default);
            const expr = node.expression;
            expr.should.be.an.instanceof(binary_1.default);
            const binary = expr;
            binary.operator.syntaxes.includes(syntax_type_1.default.AmpersandAmpersand).should.be.true();
            binary.operator.leftType.name.should.equal("any");
            binary.operator.rightType.name.should.equal("any");
            binary.operator.resultType.name.should.equal("bool");
            binary.left.should.be.an.instanceof(literal_1.default);
            binary.left.type.name.should.equal("false");
            binary.left.token.syntax.should.equal(syntax_type_1.default.Boolean);
            binary.left.token.lexeme.should.equal("false");
            (_a = binary.left.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(false);
            binary.right.should.be.an.instanceof(literal_1.default);
            binary.right.type.name.should.equal("true");
            binary.right.token.syntax.should.equal(syntax_type_1.default.Boolean);
            binary.right.token.lexeme.should.equal("true");
            (_b = binary.right.token.value) === null || _b === void 0 ? void 0 : _b.should.equal(true);
        }
    });
    (0, mocha_1.it)("binds variable declaration statements", () => {
        var _a, _b;
        {
            const [node] = bind("int y = 123");
            node.should.be.an.instanceof(variable_declaration_1.default);
            const declaration = node;
            declaration.symbol.name.lexeme.should.equal("y");
            declaration.type.name.should.equal("int");
            (_a = declaration.initializer) === null || _a === void 0 ? void 0 : _a.should.be.an.instanceof(literal_1.default);
            const value = declaration.initializer;
            value.token.syntax.should.equal(syntax_type_1.default.Int);
            (_b = value.token.value) === null || _b === void 0 ? void 0 : _b.should.equal(123);
        }
    });
    (0, mocha_1.it)("binds indexing expressions", () => {
        var _a;
        {
            const [_, node] = bind("int[] myArr = [1,2,3,4]; myArr[3]");
            node.should.be.an.instanceof(expression_1.default);
            const expr = node.expression;
            expr.should.be.an.instanceof(access_1.default);
            const indexing = expr;
            indexing.object.should.be.an.instanceof(identifier_1.default);
            indexing.object.type.isArray().should.be.true();
            const objectType = indexing.object.type;
            objectType.name.should.equal("Array");
            objectType.elementType.isSingular().should.be.true();
            objectType.elementType.name.should.equal("int");
            indexing.type.isSingular().should.be.true();
            indexing.type.name.should.equal("int");
            indexing.object.name.lexeme.should.equal("myArr");
            indexing.index.should.be.an.instanceof(literal_1.default);
            const index = indexing.index;
            index.token.syntax.should.equal(syntax_type_1.default.Int);
            (_a = index.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(3);
        }
    });
    (0, mocha_1.it)("binds call expressions", () => {
        var _a;
        {
            const [node] = bind("use eval from @p; eval('1 + 1')");
            node.should.be.an.instanceof(expression_1.default);
            const expr = node.expression;
            expr.should.be.an.instanceof(call_1.default);
            const call = expr;
            call.callee.should.be.an.instanceof(identifier_1.default);
            call.callee.type.isFunction().should.be.true();
            const calleeType = call.callee.type;
            calleeType.returnType.isSingular().should.be.true();
            calleeType.returnType.name.should.equal("any");
            const [arg] = call.args;
            arg.should.be.an.instanceof(literal_1.default);
            const argLiteral = arg;
            (_a = argLiteral.token.value) === null || _a === void 0 ? void 0 : _a.should.equal("1 + 1");
            argLiteral.type.isLiteral().should.be.true();
            argLiteral.type.name.should.equal('"1 + 1"');
        }
    });
    (0, mocha_1.describe)("binds general tests (tests/)", () => {
        for (const file of testFiles) {
            if (file.includes("greeter.p") || file.includes("loops.p") || file.includes("types.p"))
                continue;
            const filePath = path_1.default.join(testDirectory, file);
            runTestsForFile(filePath);
        }
    });
});
