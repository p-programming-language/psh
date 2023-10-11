"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mocha_1 = require("mocha");
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
require("should");
const literal_1 = require("../../src/code-analysis/parser/ast/expressions/literal");
const array_literal_1 = require("../../src/code-analysis/parser/ast/expressions/array-literal");
const unary_1 = require("../../src/code-analysis/parser/ast/expressions/unary");
const binary_1 = require("../../src/code-analysis/parser/ast/expressions/binary");
const identifier_1 = require("../../src/code-analysis/parser/ast/expressions/identifier");
const variable_assignment_1 = require("../../src/code-analysis/parser/ast/expressions/variable-assignment");
const union_type_1 = require("../../src/code-analysis/parser/ast/type-nodes/union-type");
const array_type_1 = require("../../src/code-analysis/parser/ast/type-nodes/array-type");
const expression_1 = require("../../src/code-analysis/parser/ast/statements/expression");
const call_1 = require("../../src/code-analysis/parser/ast/expressions/call");
const access_1 = require("../code-analysis/parser/ast/expressions/access");
const property_assignment_1 = require("../../src/code-analysis/parser/ast/expressions/property-assignment");
const variable_assignment_2 = require("../../src/code-analysis/parser/ast/statements/variable-assignment");
const variable_declaration_1 = require("../../src/code-analysis/parser/ast/statements/variable-declaration");
const parser_1 = require("../../src/code-analysis/parser");
const syntax_type_1 = tslib_1.__importDefault(require("../code-analysis/tokenization/syntax-type"));
const p_1 = tslib_1.__importDefault(require("../../tools/p"));
function parse(source) {
    const p = new p_1.default("test");
    const parser = p.createParser(source);
    return parser.parse().program;
}
const testDirectory = "./tests/";
const testFiles = (0, fs_1.readdirSync)(testDirectory)
    .filter(file => file.endsWith(".p"));
function runTestsForFile(filePath) {
    (0, mocha_1.it)(filePath, () => {
        const source = (0, fs_1.readFileSync)(filePath, "utf-8");
        const parseFile = () => parse(source);
        parseFile.should.not.throw();
    });
}
(0, mocha_1.describe)(parser_1.Parser.name, () => {
    (0, mocha_1.it)("parses literals", () => {
        (0, mocha_1.it)("strings", () => {
            var _a;
            const [node] = parse('"hello"');
            node.should.be.an.instanceof(expression_1.ExpressionStatement);
            const expr = node.expression;
            expr.should.be.an.instanceof(literal_1.LiteralExpression);
            expr.token.syntax.should.equal(syntax_type_1.default.String);
            expr.token.lexeme.should.equal('"hello"');
            (_a = expr.token.value) === null || _a === void 0 ? void 0 : _a.should.equal("hello");
        });
        (0, mocha_1.it)("integers", () => {
            var _a;
            const [node] = parse("123");
            node.should.be.an.instanceof(expression_1.ExpressionStatement);
            const expr = node.expression;
            expr.should.be.an.instanceof(literal_1.LiteralExpression);
            expr.token.syntax.should.equal(syntax_type_1.default.Int);
            expr.token.lexeme.should.equal("123");
            (_a = expr.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(123);
        });
        (0, mocha_1.it)("floats", () => {
            var _a;
            const [node] = parse("69.420");
            node.should.be.an.instanceof(expression_1.ExpressionStatement);
            const expr = node.expression;
            expr.should.be.an.instanceof(literal_1.LiteralExpression);
            expr.token.syntax.should.equal(syntax_type_1.default.Float);
            expr.token.lexeme.should.equal("69.420");
            (_a = expr.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(69.42);
        });
        (0, mocha_1.it)("booleans", () => {
            var _a, _b;
            {
                const [node] = parse("true");
                node.should.be.an.instanceof(expression_1.ExpressionStatement);
                const expr = node.expression;
                expr.should.be.an.instanceof(literal_1.LiteralExpression);
                expr.token.syntax.should.equal(syntax_type_1.default.Boolean);
                expr.token.lexeme.should.equal("true");
                (_a = expr.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(true);
            }
            {
                const [node] = parse("false");
                node.should.be.an.instanceof(expression_1.ExpressionStatement);
                const expr = node.expression;
                expr.should.be.an.instanceof(literal_1.LiteralExpression);
                expr.token.syntax.should.equal(syntax_type_1.default.Boolean);
                expr.token.lexeme.should.equal("false");
                (_b = expr.token.value) === null || _b === void 0 ? void 0 : _b.should.equal(false);
            }
        });
        (0, mocha_1.it)("null/undefined", () => {
            var _a, _b;
            {
                const [node] = parse("null");
                node.should.be.an.instanceof(expression_1.ExpressionStatement);
                const expr = node.expression;
                expr.should.be.an.instanceof(literal_1.LiteralExpression);
                expr.token.syntax.should.equal(syntax_type_1.default.Null);
                expr.token.lexeme.should.equal("null");
                (_a = expr.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(null);
            }
            {
                const [node] = parse("undefined");
                node.should.be.an.instanceof(expression_1.ExpressionStatement);
                const expr = node.expression;
                expr.should.be.an.instanceof(literal_1.LiteralExpression);
                expr.token.syntax.should.equal(syntax_type_1.default.Undefined);
                expr.token.lexeme.should.equal("undefined");
                (_b = expr.token.value) === null || _b === void 0 ? void 0 : _b.should.equal(undefined);
            }
        });
        (0, mocha_1.it)("arrays", () => {
            var _a, _b, _c;
            const [node] = parse("[1,2,3]");
            node.should.be.an.instanceof(expression_1.ExpressionStatement);
            const expr = node.expression;
            expr.should.be.an.instanceof(array_literal_1.ArrayLiteralExpression);
            const literal = expr;
            const [one, two, three] = literal.elements;
            one.token.syntax.should.equal(syntax_type_1.default.Int);
            one.token.lexeme.should.equal("1");
            (_a = one.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(1);
            two.token.syntax.should.equal(syntax_type_1.default.Int);
            two.token.lexeme.should.equal("2");
            (_b = two.token.value) === null || _b === void 0 ? void 0 : _b.should.equal(2);
            three.token.syntax.should.equal(syntax_type_1.default.Int);
            three.token.lexeme.should.equal("3");
            (_c = three.token.value) === null || _c === void 0 ? void 0 : _c.should.equal(3);
        });
    });
    (0, mocha_1.it)("parses unary expressions", () => {
        var _a, _b;
        {
            const [node] = parse("!false");
            node.should.be.an.instanceof(expression_1.ExpressionStatement);
            const expr = node.expression;
            expr.should.be.an.instanceof(unary_1.UnaryExpression);
            const unary = expr;
            unary.operator.syntax.should.equal(syntax_type_1.default.Bang);
            unary.operator.lexeme.should.equal("!");
            unary.operand.token.syntax.should.equal(syntax_type_1.default.Boolean);
            unary.operand.token.lexeme.should.equal("false");
            (_a = unary.operand.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(false);
        }
        {
            const [node] = parse("++a");
            node.should.be.an.instanceof(expression_1.ExpressionStatement);
            const expr = node.expression;
            expr.should.be.an.instanceof(unary_1.UnaryExpression);
            const unary = expr;
            unary.operator.syntax.should.equal(syntax_type_1.default.PlusPlus);
            unary.operator.lexeme.should.equal("++");
            unary.operand.token.syntax.should.equal(syntax_type_1.default.Identifier);
            unary.operand.token.lexeme.should.equal("a");
            (_b = unary.operand.token.value) === null || _b === void 0 ? void 0 : _b.should.be.undefined();
        }
    });
    (0, mocha_1.it)("parses binary expressions", () => {
        var _a, _b, _c, _d, _e, _f;
        {
            const [node] = parse("5 + 3 * 2");
            node.should.be.an.instanceof(expression_1.ExpressionStatement);
            const expr = node.expression;
            expr.should.be.an.instanceof(binary_1.BinaryExpression);
            const binary = expr;
            binary.operator.syntax.should.equal(syntax_type_1.default.Plus);
            binary.operator.lexeme.should.equal("+");
            binary.left.should.be.an.instanceof(literal_1.LiteralExpression);
            binary.left.token.syntax.should.equal(syntax_type_1.default.Int);
            binary.left.token.lexeme.should.equal("5");
            (_a = binary.left.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(5);
            binary.right.should.be.an.instanceof(binary_1.BinaryExpression);
            const right = binary.right;
            right.operator.syntax.should.equal(syntax_type_1.default.Star);
            right.operator.lexeme.should.equal("*");
            right.left.token.syntax.should.equal(syntax_type_1.default.Int);
            right.left.token.lexeme.should.equal("3");
            (_b = right.left.token.value) === null || _b === void 0 ? void 0 : _b.should.equal(3);
            right.right.token.syntax.should.equal(syntax_type_1.default.Int);
            right.right.token.lexeme.should.equal("2");
            (_c = right.right.token.value) === null || _c === void 0 ? void 0 : _c.should.equal(2);
        }
        {
            const [node] = parse("false && true || false");
            node.should.be.an.instanceof(expression_1.ExpressionStatement);
            const expr = node.expression;
            expr.should.be.an.instanceof(binary_1.BinaryExpression);
            const binary = expr;
            binary.operator.syntax.should.equal(syntax_type_1.default.PipePipe);
            binary.operator.lexeme.should.equal("||");
            binary.left.should.be.an.instanceof(binary_1.BinaryExpression);
            const left = binary.left;
            left.operator.syntax.should.equal(syntax_type_1.default.AmpersandAmpersand);
            left.operator.lexeme.should.equal("&&");
            left.left.token.syntax.should.equal(syntax_type_1.default.Boolean);
            left.left.token.lexeme.should.equal("false");
            (_d = left.left.token.value) === null || _d === void 0 ? void 0 : _d.should.equal(false);
            left.right.token.syntax.should.equal(syntax_type_1.default.Boolean);
            left.right.token.lexeme.should.equal("true");
            (_e = left.right.token.value) === null || _e === void 0 ? void 0 : _e.should.equal(true);
            binary.right.should.be.an.instanceof(literal_1.LiteralExpression);
            binary.right.token.syntax.should.equal(syntax_type_1.default.Boolean);
            binary.right.token.lexeme.should.equal("false");
            (_f = binary.right.token.value) === null || _f === void 0 ? void 0 : _f.should.equal(false);
        }
    });
    (0, mocha_1.it)("parses variable assignment expressions", () => {
        var _a, _b;
        {
            const [node] = parse("a = 2");
            node.should.be.an.instanceof(variable_assignment_2.VariableAssignmentStatement);
            const assignment = node;
            assignment.identifier.token.lexeme.should.equal("a");
            assignment.value.should.be.an.instanceof(literal_1.LiteralExpression);
            const value = assignment.value;
            value.token.syntax.should.equal(syntax_type_1.default.Int);
            (_a = value.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(2);
        }
        {
            const [node] = parse("abc123 := '69420'");
            node.should.be.an.instanceof(expression_1.ExpressionStatement);
            const expr = node.expression;
            expr.should.be.an.instanceof(variable_assignment_1.VariableAssignmentExpression);
            const assignment = expr;
            assignment.identifier.token.lexeme.should.equal("abc123");
            assignment.value.should.be.an.instanceof(literal_1.LiteralExpression);
            const value = assignment.value;
            value.token.syntax.should.equal(syntax_type_1.default.String);
            (_b = value.token.value) === null || _b === void 0 ? void 0 : _b.should.equal("69420");
        }
    });
    (0, mocha_1.it)("parses variable declaration statements", () => {
        var _a, _b, _c, _d;
        {
            const [node] = parse("int y = 123");
            node.should.be.an.instanceof(variable_declaration_1.VariableDeclarationStatement);
            const declaration = node;
            declaration.typeRef.token.syntax.should.equal(syntax_type_1.default.Identifier);
            declaration.typeRef.token.lexeme.should.equal("int");
            declaration.identifier.token.lexeme.should.equal("y");
            (_a = declaration.initializer) === null || _a === void 0 ? void 0 : _a.should.be.an.instanceof(literal_1.LiteralExpression);
            const value = declaration.initializer;
            value.token.syntax.should.equal(syntax_type_1.default.Int);
            (_b = value.token.value) === null || _b === void 0 ? void 0 : _b.should.equal(123);
        }
        {
            const [node] = parse("string abc");
            node.should.be.an.instanceof(variable_declaration_1.VariableDeclarationStatement);
            const declaration = node;
            declaration.typeRef.token.syntax.should.equal(syntax_type_1.default.Identifier);
            declaration.typeRef.token.lexeme.should.equal("string");
            declaration.identifier.token.lexeme.should.equal("abc");
            (_c = declaration.initializer) === null || _c === void 0 ? void 0 : _c.should.be.undefined();
        }
        {
            const [node] = parse("null nothing = null");
            node.should.be.an.instanceof(variable_declaration_1.VariableDeclarationStatement);
            const declaration = node;
            declaration.typeRef.token.syntax.should.equal(syntax_type_1.default.Null);
            declaration.typeRef.token.lexeme.should.equal("null");
            declaration.identifier.token.lexeme.should.equal("nothing");
            const value = declaration.initializer;
            value.token.syntax.should.equal(syntax_type_1.default.Null);
            (_d = value.token.value) === null || _d === void 0 ? void 0 : _d.should.equal(null);
        }
    });
    (0, mocha_1.it)("parses types references", () => {
        (0, mocha_1.it)("unions", () => {
            var _a, _b;
            const [node] = parse("int | float y = 123");
            node.should.be.an.instanceof(variable_declaration_1.VariableDeclarationStatement);
            const declaration = node;
            declaration.typeRef.should.be.an.instanceof(union_type_1.UnionTypeExpression);
            const union = declaration.typeRef;
            union.types.length.should.be.equal(2);
            const [int, float] = union.types;
            int.token.syntax.should.equal(syntax_type_1.default.Identifier);
            int.token.lexeme.should.equal("int");
            float.token.syntax.should.equal(syntax_type_1.default.Identifier);
            float.token.lexeme.should.equal("float");
            declaration.identifier.token.lexeme.should.equal("y");
            (_a = declaration.initializer) === null || _a === void 0 ? void 0 : _a.should.be.an.instanceof(literal_1.LiteralExpression);
            const value = declaration.initializer;
            value.token.syntax.should.equal(syntax_type_1.default.Int);
            (_b = value.token.value) === null || _b === void 0 ? void 0 : _b.should.equal(123);
        });
        (0, mocha_1.it)("arrays", () => {
            var _a;
            const [node] = parse("int[] nums = [1, 2, 3]");
            node.should.be.an.instanceof(variable_declaration_1.VariableDeclarationStatement);
            const declaration = node;
            declaration.typeRef.should.be.an.instanceof(array_type_1.ArrayTypeExpression);
            const arrayType = declaration.typeRef;
            arrayType.elementType.token.syntax.should.equal(syntax_type_1.default.Identifier);
            arrayType.elementType.token.lexeme.should.equal("int");
            declaration.identifier.token.lexeme.should.equal("nums");
            (_a = declaration.initializer) === null || _a === void 0 ? void 0 : _a.should.be.an.instanceof(array_literal_1.ArrayLiteralExpression);
        });
    });
    (0, mocha_1.it)("parses indexing expressions", () => {
        var _a;
        const [node] = parse("myStuff[69]");
        node.should.be.an.instanceof(expression_1.ExpressionStatement);
        const expr = node.expression;
        expr.should.be.an.instanceof(access_1.AccessExpression);
        const indexing = expr;
        indexing.object.should.be.an.instanceof(identifier_1.IdentifierExpression);
        indexing.object.name.lexeme.should.equal("myStuff");
        indexing.index.should.be.an.instanceof(literal_1.LiteralExpression);
        const value = indexing.index;
        value.token.syntax.should.equal(syntax_type_1.default.Int);
        (_a = value.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(69);
    });
    (0, mocha_1.it)("parses property assignment expressions", () => {
        var _a, _b;
        const [node] = parse("myStuff[1] = 69");
        node.should.be.an.instanceof(expression_1.ExpressionStatement);
        const expr = node.expression;
        expr.should.be.an.instanceof(property_assignment_1.PropertyAssignmentExpression);
        const assignment = expr;
        assignment.access.object.should.be.an.instanceof(identifier_1.IdentifierExpression);
        assignment.access.object.name.lexeme.should.equal("myStuff");
        assignment.access.index.should.be.an.instanceof(literal_1.LiteralExpression);
        const indexValue = assignment.access.index;
        indexValue.token.syntax.should.equal(syntax_type_1.default.Int);
        (_a = indexValue.token.value) === null || _a === void 0 ? void 0 : _a.should.equal(1);
        assignment.value.should.be.an.instanceof(literal_1.LiteralExpression);
        const value = assignment.value;
        value.token.syntax.should.equal(syntax_type_1.default.Int);
        (_b = value.token.value) === null || _b === void 0 ? void 0 : _b.should.equal(69);
    });
    (0, mocha_1.it)("parses call expressions", () => {
        var _a, _b;
        const [node] = parse("myFunc('hello', 123)");
        node.should.be.an.instanceof(expression_1.ExpressionStatement);
        const expr = node.expression;
        expr.should.be.an.instanceof(call_1.CallExpression);
        const call = expr;
        call.callee.should.be.an.instanceof(identifier_1.IdentifierExpression);
        call.callee.name.lexeme.should.equal("myFunc");
        const [arg1, arg2] = call.args;
        arg1.should.be.an.instanceof(literal_1.LiteralExpression);
        const value1 = arg1;
        value1.token.syntax.should.equal(syntax_type_1.default.String);
        (_a = value1.token.value) === null || _a === void 0 ? void 0 : _a.should.equal("hello");
        arg2.should.be.an.instanceof(literal_1.LiteralExpression);
        const value2 = arg2;
        value2.token.syntax.should.equal(syntax_type_1.default.Int);
        (_b = value2.token.value) === null || _b === void 0 ? void 0 : _b.should.equal(123);
    });
    (0, mocha_1.describe)("parses general tests (tests/)", () => {
        testFiles.forEach((file) => {
            const filePath = path_1.default.join(testDirectory, file);
            runTestsForFile(filePath);
        });
    });
});
