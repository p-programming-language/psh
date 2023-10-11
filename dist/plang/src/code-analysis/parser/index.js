"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const tslib_1 = require("tslib");
const errors_1 = require("../../errors");
const utility_1 = require("../../utility");
const type_checker_1 = require("../type-checker");
const token_stepper_1 = tslib_1.__importDefault(require("./token-stepper"));
const syntax_type_1 = tslib_1.__importDefault(require("../tokenization/syntax-type"));
const ast_1 = tslib_1.__importDefault(require("./ast"));
const SyntaxSets = tslib_1.__importStar(require("../tokenization/syntax-sets"));
const { UNARY_SYNTAXES, LITERAL_SYNTAXES, COMPOUND_ASSIGNMENT_SYNTAXES } = SyntaxSets;
const singular_type_1 = require("./ast/type-nodes/singular-type");
const literal_type_1 = require("./ast/type-nodes/literal-type");
const union_type_1 = require("./ast/type-nodes/union-type");
const array_type_1 = require("./ast/type-nodes/array-type");
const function_type_1 = require("./ast/type-nodes/function-type");
const interface_type_1 = require("./ast/type-nodes/interface-type");
const class_type_1 = require("./ast/type-nodes/class-type");
const literal_1 = require("./ast/expressions/literal");
const string_interpolation_1 = require("./ast/expressions/string-interpolation");
const range_literal_1 = require("./ast/expressions/range-literal");
const array_literal_1 = require("./ast/expressions/array-literal");
const object_literal_1 = require("./ast/expressions/object-literal");
const parenthesized_1 = require("./ast/expressions/parenthesized");
const unary_1 = require("./ast/expressions/unary");
const binary_1 = require("./ast/expressions/binary");
const ternary_1 = require("./ast/expressions/ternary");
const identifier_1 = require("./ast/expressions/identifier");
const variable_assignment_1 = require("./ast/expressions/variable-assignment");
const compound_assignment_1 = require("./ast/expressions/compound-assignment");
const property_assignment_1 = require("./ast/expressions/property-assignment");
const call_1 = require("./ast/expressions/call");
const access_1 = require("./ast/expressions/access");
const typeof_1 = require("./ast/expressions/typeof");
const is_1 = require("./ast/expressions/is");
const is_in_1 = require("./ast/expressions/is-in");
const expression_1 = require("./ast/statements/expression");
const variable_assignment_2 = require("./ast/statements/variable-assignment");
const variable_declaration_1 = require("./ast/statements/variable-declaration");
const block_1 = require("./ast/statements/block");
const if_1 = require("./ast/statements/if");
const while_1 = require("./ast/statements/while");
const function_declaration_1 = require("./ast/statements/function-declaration");
const return_1 = require("./ast/statements/return");
const type_declaration_1 = require("./ast/statements/type-declaration");
const use_1 = require("./ast/statements/use");
const break_1 = require("./ast/statements/break");
const next_1 = require("./ast/statements/next");
const every_1 = require("./ast/statements/every");
const class_body_1 = require("./ast/statements/class-body");
const class_declaration_1 = require("./ast/statements/class-declaration");
const property_declaration_1 = require("./ast/statements/property-declaration");
const method_declaration_1 = require("./ast/statements/method-declaration");
const new_1 = require("./ast/expressions/new");
const negate = (a, b) => a.filter(item => !b.includes(item));
class Parser extends token_stepper_1.default {
    constructor(tokens, runner, typeAnalyzer) {
        super(tokens);
        this.runner = runner;
        this.typeAnalyzer = typeAnalyzer;
    }
    /**
     * Parses until the predicate returns true
     *
     * Predicate returns whether or not the parser is finished by default
     */
    parse(until = () => this.isFinished) {
        const statements = [];
        while (!until())
            statements.push(this.declaration());
        const imports = statements.filter((stmt) => stmt instanceof use_1.UseStatement);
        const program = negate(statements, imports);
        return { imports, program };
    }
    /**
     * Parse a non-declaration statement
     */
    parseStatement() {
        if (this.match(syntax_type_1.default.Use))
            return this.parseImport();
        if (this.match(syntax_type_1.default.If, syntax_type_1.default.Unless)) {
            const keyword = this.previous();
            const condition = this.parseExpression();
            const body = this.parseStatement();
            const elseBranch = this.match(syntax_type_1.default.Else) ? this.parseStatement() : undefined;
            return new if_1.IfStatement(keyword, condition, body, elseBranch);
        }
        if (this.match(syntax_type_1.default.While, syntax_type_1.default.Until)) {
            const keyword = this.previous();
            const condition = this.parseExpression();
            const body = this.parseStatement();
            return new while_1.WhileStatement(keyword, condition, body);
        }
        if (this.match(syntax_type_1.default.Every)) {
            const parser = this;
            const keyword = this.previous();
            function parseElementDeclaration() {
                const elementType = parser.parseType();
                const elementName = parser.consume(syntax_type_1.default.Identifier);
                const elementIdentifier = new identifier_1.IdentifierExpression(elementName);
                return new variable_declaration_1.VariableDeclarationStatement(elementType, elementIdentifier, false);
            }
            const elementDeclarations = [parseElementDeclaration()];
            while (this.match(syntax_type_1.default.Comma))
                elementDeclarations.push(parseElementDeclaration());
            this.consume(syntax_type_1.default.In, "'in'");
            const iterator = this.parseExpression();
            const body = this.parseStatement();
            return new every_1.EveryStatement(keyword, elementDeclarations, iterator, body);
        }
        if (this.match(syntax_type_1.default.Break)) {
            const keyword = this.previous();
            return new break_1.BreakStatement(keyword);
        }
        if (this.match(syntax_type_1.default.Next)) {
            const keyword = this.previous();
            return new next_1.NextStatement(keyword);
        }
        if (this.match(syntax_type_1.default.Return)) {
            const keyword = this.previous();
            const expr = this.checkSet([syntax_type_1.default.Semicolon, syntax_type_1.default.RBrace, syntax_type_1.default.EOF]) ?
                new literal_1.LiteralExpression((0, utility_1.fakeToken)(syntax_type_1.default.Undefined, "undefined"))
                : this.parseExpression();
            return new return_1.ReturnStatement(keyword, expr);
        }
        if (this.match(syntax_type_1.default.LBrace))
            return this.parseBlockOrObject();
        return this.parseExpressionStatement();
    }
    /**
     * Parses a declaration statement like a class, variable, function, etc.
     */
    declaration() {
        if (this.atVariableDeclaration)
            return this.parseVariableDeclaration();
        if (this.atFunctionDeclaration)
            return this.parseFunctionDeclaration();
        if (this.match(syntax_type_1.default.Interface)) {
            const declaration = this.parseInterfaceType();
            this.consumeSemicolons();
            return new type_declaration_1.TypeDeclarationStatement(declaration.name, declaration);
        }
        if (this.match(syntax_type_1.default.Class)) {
            const declaration = this.parseClassDeclaration();
            this.consumeSemicolons();
            return declaration;
        }
        if (this.check(syntax_type_1.default.Identifier) && this.current.lexeme === "type") {
            const [name, aliasedType] = this.parseTypeAlias();
            this.consumeSemicolons();
            return new type_declaration_1.TypeDeclarationStatement(name, aliasedType);
        }
        const stmt = this.parseStatement();
        this.consumeSemicolons();
        return stmt;
    }
    get atFunctionDeclaration() {
        if (this.check(syntax_type_1.default.Mut))
            return false;
        let offsetToFnKeyword = 0;
        let passedClosingParen = false;
        if (this.checkType() && this.check(syntax_type_1.default.LParen))
            while (!this.check(syntax_type_1.default.EOF, offsetToFnKeyword) && !this.check(syntax_type_1.default.Function, offsetToFnKeyword)) {
                if (this.check(syntax_type_1.default.RParen, offsetToFnKeyword))
                    passedClosingParen = true;
                if (!this.checkType(offsetToFnKeyword) && this.check(syntax_type_1.default.Identifier, offsetToFnKeyword) && passedClosingParen)
                    return false;
                offsetToFnKeyword++;
            }
        else if (!this.checkType() && this.check(syntax_type_1.default.Identifier))
            return false;
        return this.checkType() && this.check(syntax_type_1.default.Function, offsetToFnKeyword === 0 ? 1 : offsetToFnKeyword);
    }
    get atVariableDeclaration() {
        const isVariableDeclarationSyntax = (offset = 1) => this.checkSet([
            syntax_type_1.default.Identifier, syntax_type_1.default.Pipe,
            syntax_type_1.default.LBracket, syntax_type_1.default.RBracket,
            syntax_type_1.default.RParen, syntax_type_1.default.ColonColon
        ], offset);
        const soFarSoGood = (this.check(syntax_type_1.default.Mut) ? this.checkType(1) : this.checkType())
            && !this.checkSet([syntax_type_1.default.Dot], 1) && !this.checkSet([syntax_type_1.default.Dot], 2)
            && (isVariableDeclarationSyntax() || isVariableDeclarationSyntax(2));
        if (soFarSoGood) {
            let offset = 1;
            while (!this.check(syntax_type_1.default.EOF, offset) && (!this.check(syntax_type_1.default.Equal, offset) || (this.check(syntax_type_1.default.Identifier, offset) && !this.checkType(offset)))) {
                if (this.checkSet([syntax_type_1.default.Function, syntax_type_1.default.Is], offset))
                    return false;
                offset++;
            }
        }
        return soFarSoGood;
    }
    parseImportMember() {
        let importedSpecifics = false;
        let consumedStar = false;
        const matchedStar = this.match(syntax_type_1.default.Star) || this.consume(syntax_type_1.default.Identifier, "import member");
        const token = this.previous();
        if (matchedStar === true) {
            if (importedSpecifics)
                throw new errors_1.ParserSyntaxError("You can import specific members or all members, but not both", token);
            else if (consumedStar)
                throw new errors_1.ParserSyntaxError(`'*' was imported more than once`, token);
            consumedStar = true;
        }
        return token;
    }
    parseImportPath() {
        let path = "";
        const validFirstTokens = [syntax_type_1.default.DotDot, syntax_type_1.default.Dot, syntax_type_1.default.Identifier];
        if (!this.matchSet(validFirstTokens))
            throw new errors_1.ParserSyntaxError(`Expected import path, got '${this.current.lexeme}'`, this.current);
        path += this.previous().lexeme;
        while (this.match(syntax_type_1.default.Slash)) {
            path += this.previous().lexeme;
            if (!this.matchSet(validFirstTokens))
                break;
            else
                path += this.previous().lexeme;
        }
        return path;
    }
    parseImport() {
        const keyword = this.previous();
        this.match(syntax_type_1.default.LBrace);
        const members = [this.parseImportMember()];
        const importAll = members[0].syntax === syntax_type_1.default.Star;
        if (!importAll)
            while (this.match(syntax_type_1.default.Comma))
                members.push(this.parseImportMember());
        this.match(syntax_type_1.default.RBrace);
        this.consume(syntax_type_1.default.From, "'from'");
        const intrinsic = this.match(syntax_type_1.default.At);
        const path = this.parseImportPath();
        return new use_1.UseStatement(keyword, importAll || members, {
            intrinsic,
            path: intrinsic ? "@" + path : path
        });
    }
    parseFunctionDeclaration() {
        const returnType = this.parseType();
        const keyword = this.consume(syntax_type_1.default.Function);
        const identifierToken = this.consume(syntax_type_1.default.Identifier, "identifier");
        const parameters = [];
        if (this.match(syntax_type_1.default.LParen)) {
            if (this.atVariableDeclaration) {
                parameters.push(this.parseVariableDeclaration());
                while (this.match(syntax_type_1.default.Comma))
                    parameters.push(this.parseVariableDeclaration());
            }
            this.consume(syntax_type_1.default.RParen, "')'");
        }
        this.consume(syntax_type_1.default.LBrace, "'{'");
        const body = this.parseBlock();
        const declaration = new function_declaration_1.FunctionDeclarationStatement(keyword, identifierToken, returnType, parameters, body);
        this.consumeSemicolons();
        return declaration;
    }
    parseVariableDeclaration() {
        const isMutable = this.match(syntax_type_1.default.Mut);
        const type = this.parseType();
        const identifierToken = this.consume(syntax_type_1.default.Identifier, "identifier");
        const initializer = this.match(syntax_type_1.default.Equal) ?
            this.parseExpression()
            : undefined;
        const identifier = new identifier_1.IdentifierExpression(identifierToken);
        const declaration = new variable_declaration_1.VariableDeclarationStatement(type, identifier, isMutable, initializer);
        this.consumeSemicolons();
        return declaration;
    }
    parseBlock() {
        const brace = this.previous();
        this.typeAnalyzer.typeTracker.beginTypeScope();
        const result = this.parse(() => this.match(syntax_type_1.default.RBrace));
        this.typeAnalyzer.typeTracker.endTypeScope();
        return new block_1.BlockStatement(brace, result.program);
    }
    /**
     * Wraps an expression in a statement, acts as a singular expression
     */
    parseExpressionStatement() {
        const expr = this.parseExpression();
        this.consumeSemicolons();
        return expr instanceof ast_1.default.Expression ?
            new expression_1.ExpressionStatement(expr)
            : expr;
    }
    parseExpression() {
        return this.parseTernary();
    }
    parseTernary() {
        let left = this.parseVariableAssignment();
        while (this.match(syntax_type_1.default.Question)) {
            const operator = this.previous();
            const body = this.parseExpression();
            this.consume(syntax_type_1.default.Colon, "':'");
            const elseBranch = this.parseExpression();
            left = new ternary_1.TernaryExpression(operator, left, body, elseBranch);
        }
        return left;
    }
    parseVariableAssignment() {
        let left = this.parseCompoundAssignment();
        if (this.match(syntax_type_1.default.Equal, syntax_type_1.default.ColonEqual)) {
            const isStatement = this.check(syntax_type_1.default.Equal, -1);
            const value = this.parseExpression();
            if (!this.isAssignmentTarget(left))
                throw new errors_1.ParserSyntaxError("Invalid assignment target", this.current);
            if (left instanceof identifier_1.IdentifierExpression)
                return isStatement ?
                    new variable_assignment_2.VariableAssignmentStatement(left, value)
                    : new variable_assignment_1.VariableAssignmentExpression(left, value);
            else if (left instanceof access_1.AccessExpression)
                return new property_assignment_1.PropertyAssignmentExpression(left, value);
        }
        return left;
    }
    parseCompoundAssignment() {
        let left = this.parseLogicalOr();
        if (this.matchSet(COMPOUND_ASSIGNMENT_SYNTAXES)) {
            const operator = this.previous();
            const right = this.parseLogicalOr();
            if (!this.isAssignmentTarget(left))
                throw new errors_1.ParserSyntaxError("Invalid compound assignment target", this.current);
            left = new compound_assignment_1.CompoundAssignmentExpression(left, right, operator);
        }
        return left;
    }
    parseLogicalOr() {
        let left = this.parseLogicalAnd();
        while (this.match(syntax_type_1.default.PipePipe, syntax_type_1.default.QuestionQuestion)) {
            const operator = this.previous();
            const right = this.parseLogicalAnd();
            left = new binary_1.BinaryExpression(left, right, operator);
        }
        return left;
    }
    parseLogicalAnd() {
        let left = this.parseComparison();
        while (this.match(syntax_type_1.default.AmpersandAmpersand)) {
            const operator = this.previous();
            const right = this.parseComparison();
            left = new binary_1.BinaryExpression(left, right, operator);
        }
        return left;
    }
    parseComparison() {
        let left = this.parseEquality();
        while (this.match(syntax_type_1.default.LT, syntax_type_1.default.LTE, syntax_type_1.default.GT, syntax_type_1.default.GTE)) {
            const operator = this.previous();
            const right = this.parseEquality();
            left = new binary_1.BinaryExpression(left, right, operator);
        }
        return left;
    }
    parseEquality() {
        let left = this.parseBitwiseOr();
        while (this.match(syntax_type_1.default.EqualEqual, syntax_type_1.default.BangEqual, syntax_type_1.default.Is)) {
            const operator = this.previous();
            if (operator.syntax === syntax_type_1.default.Is) {
                const inversed = this.match(syntax_type_1.default.Bang);
                if (this.match(syntax_type_1.default.In)) {
                    const object = this.parseExpression();
                    left = new is_in_1.IsInExpression(left, object, inversed, operator);
                }
                else {
                    const typeRef = this.parseType();
                    left = new is_1.IsExpression(left, typeRef, inversed, operator);
                }
            }
            else {
                const right = this.parseBitwiseOr();
                left = new binary_1.BinaryExpression(left, right, operator);
            }
        }
        return left;
    }
    parseBitwiseOr() {
        let left = this.parseBitwiseAnd();
        while (this.match(syntax_type_1.default.Pipe)) {
            const operator = this.previous();
            const right = this.parseBitwiseAnd();
            left = new binary_1.BinaryExpression(left, right, operator);
        }
        return left;
    }
    parseBitwiseAnd() {
        let left = this.parseShift();
        while (this.match(syntax_type_1.default.Ampersand)) {
            const operator = this.previous();
            const right = this.parseShift();
            left = new binary_1.BinaryExpression(left, right, operator);
        }
        return left;
    }
    parseShift() {
        let left = this.parseAdditive();
        while (this.match(syntax_type_1.default.LDoubleArrow, syntax_type_1.default.RDoubleArrow)) {
            const operator = this.previous();
            const right = this.parseAdditive();
            left = new binary_1.BinaryExpression(left, right, operator);
        }
        return left;
    }
    parseAdditive() {
        let left = this.parseMultiplicative();
        while (this.match(syntax_type_1.default.Plus, syntax_type_1.default.Minus)) {
            const operator = this.previous();
            const right = this.parseMultiplicative();
            left = new binary_1.BinaryExpression(left, right, operator);
        }
        return left;
    }
    parseMultiplicative() {
        let left = this.parseExponential();
        while (this.match(syntax_type_1.default.Star, syntax_type_1.default.Slash, syntax_type_1.default.SlashSlash, syntax_type_1.default.Percent)) {
            const operator = this.previous();
            const right = this.parseExponential();
            left = new binary_1.BinaryExpression(left, right, operator);
        }
        return left;
    }
    parseExponential() {
        let left = this.parseUnary();
        while (this.match(syntax_type_1.default.Carat, syntax_type_1.default.StarStar, syntax_type_1.default.DotDot)) {
            const operator = this.previous();
            const right = this.parseUnary();
            left = operator.syntax === syntax_type_1.default.DotDot ?
                new range_literal_1.RangeLiteralExpression(left, right, operator)
                : new binary_1.BinaryExpression(left, right, operator);
        }
        return left;
    }
    parseUnary() {
        if (this.matchSet(UNARY_SYNTAXES)) {
            const operator = this.previous();
            const operand = this.parsePostfix();
            if (operator.syntax === syntax_type_1.default.TypeOf)
                return new typeof_1.TypeOfExpression(operator, operand);
            else if (operator.syntax === syntax_type_1.default.New) {
                if (!(operand instanceof identifier_1.IdentifierExpression))
                    throw new errors_1.ParserSyntaxError("Can only use 'new' on an identifier", operator);
                const args = [];
                if (this.match(syntax_type_1.default.LParen) && !this.match(syntax_type_1.default.RParen)) {
                    args.concat(this.parseExpressionList());
                    this.consume(syntax_type_1.default.RParen, "')'");
                }
                return new new_1.NewExpression(operator, operand, args);
            }
            else if ((operator.syntax === syntax_type_1.default.PlusPlus || operator.syntax === syntax_type_1.default.MinusMinus) && !this.isAssignmentTarget(operand))
                throw new errors_1.ParserSyntaxError("Invalid increment/decrement target", operand.token);
            return new unary_1.UnaryExpression(operator, operand);
        }
        else
            return this.parsePostfix();
    }
    parsePostfix(expr) {
        let callee = expr !== null && expr !== void 0 ? expr : this.parsePrimary();
        if (this.match(syntax_type_1.default.Dot)) {
            const accessToken = this.previous();
            const indexIdentifier = this.consume(syntax_type_1.default.Identifier);
            indexIdentifier.syntax = syntax_type_1.default.String;
            indexIdentifier.value = indexIdentifier.lexeme;
            indexIdentifier.lexeme = `"${indexIdentifier.lexeme}"`;
            const index = new literal_1.LiteralExpression(indexIdentifier);
            callee = new access_1.AccessExpression(accessToken, callee, index);
        }
        else if (this.match(syntax_type_1.default.LParen)) {
            const args = this.parseExpressionList(syntax_type_1.default.RParen);
            this.consume(syntax_type_1.default.RParen, "')'");
            callee = new call_1.CallExpression(callee, args);
        }
        else if (this.check(syntax_type_1.default.LBracket)) {
            this.consume(syntax_type_1.default.LBracket);
            if (!this.checkSet([syntax_type_1.default.RBracket, syntax_type_1.default.RBrace, syntax_type_1.default.RParen, syntax_type_1.default.Identifier], -2))
                return callee;
            const bracket = this.previous();
            const index = this.parseExpression();
            this.consume(syntax_type_1.default.RBracket, "']'");
            callee = new access_1.AccessExpression(bracket, callee, index);
        }
        if (this.checkSet(SyntaxSets.POSTFIX_SYNTAXES))
            return this.parsePostfix(callee);
        return callee;
    }
    /**
     * Parse a primary value, such as a literal or groupings
     */
    parsePrimary() {
        if (this.match(syntax_type_1.default.LParen)) {
            const expr = this.parseExpression();
            this.consume(syntax_type_1.default.RParen, "')'");
            return new parenthesized_1.ParenthesizedExpression(expr);
        }
        if (this.matchSet(LITERAL_SYNTAXES)) {
            const token = this.previous();
            if (this.checkSet(LITERAL_SYNTAXES, -2)) {
                let message = "Unexpected ";
                switch (token.syntax) {
                    case syntax_type_1.default.Float:
                    case syntax_type_1.default.Int: {
                        message += "number";
                        break;
                    }
                    case syntax_type_1.default.String: {
                        message += "string";
                        break;
                    }
                    case syntax_type_1.default.Boolean: {
                        message += "boolean";
                        break;
                    }
                    default: {
                        message += "literal";
                        break;
                    }
                }
                throw new errors_1.ParserSyntaxError(message, token);
            }
            return token.syntax === syntax_type_1.default.String && token.lexeme.includes("%{") ?
                this.parseStringInterpolation(token)
                : new literal_1.LiteralExpression(token);
        }
        if (this.match(syntax_type_1.default.LBrace)) {
            const brace = this.previous();
            if (this.match(syntax_type_1.default.RBrace))
                return new object_literal_1.ObjectLiteralExpression(brace, new Map);
            return this.parseObjectContents(brace);
        }
        if (this.match(syntax_type_1.default.LBracket)) {
            const bracket = this.previous();
            const elements = this.parseExpressionList(syntax_type_1.default.RBracket);
            this.consume(syntax_type_1.default.RBracket, "']'");
            return new array_literal_1.ArrayLiteralExpression(bracket, elements);
        }
        if (this.match(syntax_type_1.default.Identifier))
            return new identifier_1.IdentifierExpression(this.previous());
        throw new errors_1.ParserSyntaxError(`Expected expression, got '${this.current.syntax === syntax_type_1.default.EOF ? "EOF" : this.current.lexeme}'`, this.current);
    }
    parseBlockOrObject() {
        const brace = this.previous();
        if (this.match(syntax_type_1.default.RBrace))
            return new expression_1.ExpressionStatement(new object_literal_1.ObjectLiteralExpression(brace, new Map));
        if (this.check(syntax_type_1.default.Identifier) && this.check(syntax_type_1.default.Colon, 1))
            return new expression_1.ExpressionStatement(this.parseObjectContents(brace));
        else if (this.check(syntax_type_1.default.LBracket)) {
            let offset = 1;
            while (!this.check(syntax_type_1.default.RBracket, offset))
                ++offset;
            if (this.check(syntax_type_1.default.Colon, offset + 1))
                return new expression_1.ExpressionStatement(this.parseObjectContents(brace));
        }
        return this.parseBlock();
    }
    /**
     * Parse the contents of an object, as well as the final right brace
     * @param brace The left brace token
     */
    parseObjectContents(brace) {
        const keyValuePairs = [this.parseObjectKeyValuePair()];
        while (this.match(syntax_type_1.default.Comma) && !this.check(syntax_type_1.default.RBrace))
            keyValuePairs.push(this.parseObjectKeyValuePair());
        this.consume(syntax_type_1.default.RBrace, "'}'");
        return new object_literal_1.ObjectLiteralExpression(brace, new Map(keyValuePairs));
    }
    parseObjectKeyValuePair() {
        let key;
        if (this.match(syntax_type_1.default.Identifier)) {
            const identifier = this.previous();
            key = new literal_1.LiteralExpression((0, utility_1.fakeToken)(syntax_type_1.default.String, `"${identifier.lexeme}"`, identifier.lexeme));
        }
        else {
            this.consume(syntax_type_1.default.LBracket, "'['");
            key = this.parseExpression();
            this.consume(syntax_type_1.default.RBracket, "']'");
        }
        this.consume(syntax_type_1.default.Colon, "':'");
        const value = this.parseExpression();
        return [key, value];
    }
    parseStringInterpolation(string) {
        const rawParts = this.extractInterpolationParts(string.value);
        const parts = [];
        for (const part of rawParts) {
            if (part.startsWith("%{")) {
                const interpolationParser = this.runner.createParser(part.slice(2, -1));
                const expression = interpolationParser.parseExpression();
                parts.push(expression);
            }
            else
                parts.push(new literal_1.LiteralExpression((0, utility_1.fakeToken)(syntax_type_1.default.String, `"${part}"`, part)));
        }
        return new string_interpolation_1.StringInterpolationExpression(parts);
    }
    extractInterpolationParts(string) {
        const rawParts = [];
        const pattern = /%\{([^{}]+)\}/;
        const match = string.match(pattern);
        if (match !== null) {
            rawParts.push(match.input.slice(0, match.index));
            rawParts.push(match[0]);
            if (pattern.test(match.input.slice(match.index + match[0].length))) {
                rawParts.push(...this.extractInterpolationParts(match.input.slice(match.index + match[0].length)));
            }
            else {
                rawParts.push(match.input.slice(match.index + match[0].length));
            }
        }
        return rawParts;
    }
    /**
     * @returns Whether or not `operand` can be a target of an assignment expression
     */
    isAssignmentTarget(operand) {
        return operand instanceof identifier_1.IdentifierExpression
            || operand instanceof access_1.AccessExpression;
    }
    /**
     * Parses a list of expressions separated by commas
     */
    parseExpressionList(closer) {
        if (closer && this.check(closer))
            return [];
        const expressions = [this.parseExpression()];
        while (this.match(syntax_type_1.default.Comma) && (closer !== undefined ? !this.check(closer) : true))
            expressions.push(this.parseExpression());
        return expressions;
    }
    // These have no precedence, since they're declarations
    // This is the reason they're not grouped with the below methods
    parseTypeAlias() {
        this.consume(syntax_type_1.default.Identifier, "'type' keyword");
        const identifier = this.consume(syntax_type_1.default.Identifier, "identifier");
        this.consume(syntax_type_1.default.Equal, "'='");
        const aliasedType = this.parseType();
        return [identifier, aliasedType];
    }
    parseClassDeclaration() {
        const keyword = this.previous();
        const name = this.consume(syntax_type_1.default.Identifier);
        let superclass;
        if (this.match(syntax_type_1.default.LT))
            superclass = new identifier_1.IdentifierExpression(this.consume(syntax_type_1.default.Identifier));
        const mixins = [];
        if (this.match(syntax_type_1.default.Mixin)) {
            mixins.push(new identifier_1.IdentifierExpression(this.consume(syntax_type_1.default.Identifier)));
            while (this.match(syntax_type_1.default.Comma))
                mixins.push(new identifier_1.IdentifierExpression(this.consume(syntax_type_1.default.Identifier)));
        }
        const brace = this.consume(syntax_type_1.default.LBrace, "'{'");
        let members = [];
        if (!this.match(syntax_type_1.default.RBrace))
            members = this.parseClassMembers();
        const body = new class_body_1.ClassBodyStatement(brace, members);
        const memberSignatures = members.map(member => {
            const mutable = member instanceof property_declaration_1.PropertyDeclarationStatement ? member.mutable : false;
            const [name, valueType] = member instanceof property_declaration_1.PropertyDeclarationStatement ?
                [member.identifier.name.lexeme, member.typeRef]
                : [member.name.lexeme, new function_type_1.FunctionTypeExpression(new Map(member.parameters.map(param => [param.identifier.name.lexeme, param.typeRef])), member.returnType)];
            return [name, {
                    modifiers: member.modifiers,
                    valueType, mutable
                }];
        });
        const typeRef = new class_type_1.ClassTypeExpression(name, new Map(memberSignatures), mixins, superclass);
        return new class_declaration_1.ClassDeclarationStatement(keyword, name, body, typeRef, mixins, superclass);
    }
    parseClassBody() {
        throw new Error("Method not implemented.");
    }
    parseClassMembers() {
        this.typeAnalyzer.typeTracker.beginTypeScope();
        const members = [];
        while (!this.match(syntax_type_1.default.RBrace)) {
            const modifiers = this.parseModifiers();
            if (this.check(syntax_type_1.default.Mut)) {
                const { isMutable, valueType, name } = this.parseNamedType(true);
                const nameIdentifier = new identifier_1.IdentifierExpression((0, utility_1.fakeToken)(syntax_type_1.default.Identifier, name.token.value, undefined));
                const initializer = this.match(syntax_type_1.default.Equal) ? this.parseExpression() : undefined;
                this.consumeSemicolons();
                members.push(new property_declaration_1.PropertyDeclarationStatement(modifiers, valueType, nameIdentifier, isMutable, initializer));
            }
            else {
                const type = this.parseType();
                if (this.match(syntax_type_1.default.Function)) {
                    const keyword = this.previous();
                    const name = this.consume(syntax_type_1.default.Identifier);
                    const parameters = [];
                    if (this.match(syntax_type_1.default.LParen) && !this.match(syntax_type_1.default.RParen)) {
                        parameters.push(this.parseVariableDeclaration());
                        while (this.match(syntax_type_1.default.Comma))
                            parameters.push(this.parseVariableDeclaration());
                        this.consume(syntax_type_1.default.RParen, "')'");
                    }
                    this.consume(syntax_type_1.default.LBrace, "'{'");
                    const body = this.parseBlock();
                    members.push(new method_declaration_1.MethodDeclarationStatement(modifiers, keyword, name, type, parameters, body));
                }
                else {
                    const valueType = this.parseType();
                    const name = this.consume(syntax_type_1.default.Identifier);
                    const initializer = this.match(syntax_type_1.default.Equal) ? this.parseExpression() : undefined;
                    this.consumeSemicolons();
                    members.push(new property_declaration_1.PropertyDeclarationStatement(modifiers, valueType, new identifier_1.IdentifierExpression(name), false, initializer));
                }
            }
        }
        this.typeAnalyzer.typeTracker.endTypeScope();
        return members;
    }
    parseModifiers() {
        const modifiers = [];
        while (this.match(syntax_type_1.default.Private, syntax_type_1.default.Protected, syntax_type_1.default.Static)) {
            const modifierToken = this.previous();
            const modifierName = syntax_type_1.default[modifierToken.syntax];
            modifiers.push(type_checker_1.ModifierType[modifierName]);
        }
        return modifiers;
    }
    parseInterfaceType() {
        const name = this.consume(syntax_type_1.default.Identifier);
        this.consume(syntax_type_1.default.LBrace, "'{'");
        const members = new Map();
        const indexSignatures = new Map();
        if (!this.match(syntax_type_1.default.RBrace)) {
            const contents = this.parseInterfaceContents();
            for (const [key, prop] of contents)
                if (key instanceof literal_1.LiteralExpression)
                    members.set(key, prop);
                else
                    indexSignatures.set(key, prop.valueType);
            this.consume(syntax_type_1.default.RBrace, "'}'");
        }
        return new interface_type_1.InterfaceTypeExpression(name, members, indexSignatures);
    }
    parseInterfaceContents() {
        const keyValuePairs = [this.parseInterfaceKeyValuePair()];
        while ((this.match(syntax_type_1.default.Comma, syntax_type_1.default.Semicolon) || this.checkType() || this.check(syntax_type_1.default.Mut)) && !this.check(syntax_type_1.default.RBrace))
            keyValuePairs.push(this.parseInterfaceKeyValuePair());
        return new Map(keyValuePairs);
    }
    parseInterfaceKeyValuePair() {
        let key;
        let valueType;
        let isMutable = false;
        if (this.match(syntax_type_1.default.LBracket)) {
            key = this.parseType();
            this.consume(syntax_type_1.default.RBracket, "']'");
            this.consume(syntax_type_1.default.Colon, "':'");
            valueType = this.parseType();
        }
        else
            ({ isMutable, valueType, name: key } = this.parseNamedType(true));
        return [key, {
                valueType,
                mutable: isMutable
            }];
    }
    parseNamedType(allowMutable = false) {
        const isMutable = allowMutable ? this.match(syntax_type_1.default.Mut) : false;
        const valueType = this.parseType();
        const identifier = this.consume(syntax_type_1.default.Identifier);
        const name = new literal_1.LiteralExpression((0, utility_1.fakeToken)(syntax_type_1.default.String, `"${identifier.lexeme}"`, identifier.lexeme));
        return { isMutable, valueType, name };
    }
    /**
     * Parses a type reference
     */
    parseType() {
        return this.parseFunctionType();
    }
    parseFunctionType() {
        if (this.match(syntax_type_1.default.LParen)) {
            const parameterTypes = new Map();
            if (!this.match(syntax_type_1.default.RParen)) {
                const parseParameter = () => {
                    const { name, valueType } = this.parseNamedType();
                    parameterTypes.set(name.token.value, valueType);
                };
                parseParameter();
                while (this.match(syntax_type_1.default.Comma))
                    parseParameter();
                this.consume(syntax_type_1.default.RParen);
            }
            this.consume(syntax_type_1.default.ColonColon, "'::'");
            const returnType = this.parseType();
            return new function_type_1.FunctionTypeExpression(parameterTypes, returnType);
        }
        return this.parseUnionType();
    }
    parseUnionType() {
        let left = this.parseArrayType();
        while (this.match(syntax_type_1.default.Pipe)) {
            const singularTypes = [];
            if (left instanceof union_type_1.UnionTypeExpression)
                singularTypes.push(...left.types);
            else if (left instanceof singular_type_1.SingularTypeExpression || left instanceof array_type_1.ArrayTypeExpression)
                singularTypes.push(left);
            singularTypes.push(this.parseSingularType());
            left = new union_type_1.UnionTypeExpression(singularTypes);
        }
        return left;
    }
    parseArrayType() {
        let left = this.parseSingularType();
        while (this.match(syntax_type_1.default.LBracket)) {
            this.consume(syntax_type_1.default.RBracket, "']'");
            left = new array_type_1.ArrayTypeExpression(left);
        }
        if (this.match(syntax_type_1.default.Question))
            left = new union_type_1.UnionTypeExpression([
                left,
                new singular_type_1.SingularTypeExpression((0, utility_1.fakeToken)(syntax_type_1.default.Undefined, "undefined"))
            ]);
        return left;
    }
    parseSingularType() {
        if (!this.checkType())
            throw new errors_1.ParserSyntaxError(`Expected type, got '${this.current.lexeme}'`, this.current);
        const typeKeyword = this.advance();
        if (typeKeyword.value !== undefined)
            return new literal_type_1.LiteralTypeExpression(typeKeyword);
        const typeName = typeKeyword.lexeme;
        let typeArgs;
        if (this.match(syntax_type_1.default.LT)) {
            typeArgs = this.parseTypeList();
            this.consume(syntax_type_1.default.GT, "'>'");
        }
        if (this.typeAnalyzer.typeTracker.isCustomType(typeName))
            return this.typeAnalyzer.typeTracker.getRef(typeName);
        return new singular_type_1.SingularTypeExpression(typeKeyword, typeArgs);
    }
    /**
     * Parses a list of type references separated by commas
     *
     * Must have at least one type
     */
    parseTypeList() {
        const types = [this.parseType()];
        while (this.match(syntax_type_1.default.Comma))
            types.push(this.parseType());
        return types;
    }
    /**
     * @returns Whether or not we matched a type reference
     */
    matchType(offset = 0) {
        if (this.checkType(offset)) {
            this.advance();
            return true;
        }
        return false;
    }
    /**
     * @returns Whether or not we're currently at a type reference
     */
    checkType(offset = 0) {
        return (this.check(syntax_type_1.default.LParen, offset) && (this.checkType(offset + 1)
            || (this.check(syntax_type_1.default.RParen, offset + 1) && this.check(syntax_type_1.default.ColonColon, offset + 2))))
            || (this.checkSet([syntax_type_1.default.Identifier, syntax_type_1.default.Undefined, syntax_type_1.default.Null], offset)
                && this.typeAnalyzer.typeTracker.isTypeDefined(this.peek(offset).lexeme))
            || this.checkSet([syntax_type_1.default.String, syntax_type_1.default.Boolean, syntax_type_1.default.Int, syntax_type_1.default.Float], offset);
    }
}
exports.Parser = Parser;
