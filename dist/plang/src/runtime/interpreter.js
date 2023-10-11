"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const errors_1 = require("../errors");
const callable_1 = require("./values/callable");
const type_sets_1 = require("../code-analysis/type-checker/types/type-sets");
const token_1 = require("../code-analysis/tokenization/token");
const range_1 = require("./values/range");
const utility_1 = require("../utility");
const singular_type_1 = tslib_1.__importDefault(require("../code-analysis/type-checker/types/singular-type"));
const literal_type_1 = tslib_1.__importDefault(require("../code-analysis/type-checker/types/literal-type"));
const union_type_1 = tslib_1.__importDefault(require("../code-analysis/type-checker/types/union-type"));
const array_type_1 = tslib_1.__importDefault(require("../code-analysis/type-checker/types/array-type"));
const syntax_type_1 = tslib_1.__importDefault(require("../code-analysis/tokenization/syntax-type"));
const scope_1 = tslib_1.__importDefault(require("./scope"));
const hooked_exceptions_1 = tslib_1.__importDefault(require("./hooked-exceptions"));
const intrinsics_1 = tslib_1.__importDefault(require("./intrinsics"));
const function_1 = tslib_1.__importDefault(require("./values/function"));
const intrinsic_1 = tslib_1.__importDefault(require("./values/intrinsic"));
const value_extensions_1 = tslib_1.__importDefault(require("./intrinsics/value-extensions"));
const ast_1 = tslib_1.__importDefault(require("../code-analysis/parser/ast"));
const literal_1 = require("../code-analysis/parser/ast/expressions/literal");
const binary_1 = require("../code-analysis/parser/ast/expressions/binary");
const identifier_1 = require("../code-analysis/parser/ast/expressions/identifier");
const compound_assignment_1 = require("../code-analysis/parser/ast/expressions/compound-assignment");
const variable_assignment_1 = require("../code-analysis/parser/ast/expressions/variable-assignment");
const property_assignment_1 = require("../code-analysis/parser/ast/expressions/property-assignment");
const block_1 = require("../code-analysis/parser/ast/statements/block");
const class_1 = tslib_1.__importDefault(require("./values/class"));
var Context;
(function (Context) {
    Context[Context["Global"] = 0] = "Global";
    Context[Context["Class"] = 1] = "Class";
})(Context || (Context = {}));
class Interpreter {
    constructor(runner, resolver, binder, fileName = "unnamed") {
        this.runner = runner;
        this.resolver = resolver;
        this.binder = binder;
        this.fileName = fileName;
        this.globals = new scope_1.default;
        this.scope = this.globals;
        this.maxRecursionDepth = 1200;
        this.definedArgv = false;
        this.recursionDepth = 1;
        this.loopLevel = 0;
        this.intrinsics = new intrinsics_1.default(this);
        this.intrinsics.inject();
    }
    visitMethodDeclarationStatement(stmt) {
        return new function_1.default(stmt, this.scope, this.runner.host.typeTracker);
    }
    visitPropertyDeclarationStatement(stmt) {
        return stmt.initializer ? this.evaluate(stmt.initializer) : undefined;
    }
    visitClassBodyStatement(stmt) {
        // do nothing, logic handled in PClass
    }
    visitClassDeclarationStatement(stmt) {
        this.scope.define(stmt.name, new class_1.default(stmt, this.scope, this.runner.host.typeTracker), {
            mutable: false
        });
    }
    visitNewExpression(expr) {
        const _class = this.evaluate(expr.classRef);
        const fitsArity = typeof _class.constructorArity === "number" ? expr.constructorArgs.length === _class.constructorArity : _class.constructorArity.doesFit(expr.constructorArgs.length);
        if (!fitsArity)
            throw new errors_1.RuntimeError(`Expected call to '${_class.name}()' to have ${_class.constructorArity.toString()} arguments, got ${expr.constructorArgs.length}`, expr.token);
        const constructorArgs = expr.constructorArgs.map(arg => this.evaluate(arg));
        return _class.construct(this, constructorArgs);
    }
    visitEveryStatement(stmt) {
        const enclosing = this.scope;
        this.scope = new scope_1.default(this.scope);
        let iterable = this.evaluate(stmt.iterable);
        for (const declaration of stmt.elementDeclarations)
            this.scope.define(declaration.identifier.name, undefined, {
                mutable: true
            });
        if (typeof iterable === "number")
            iterable = new range_1.Range(1, iterable);
        if (iterable instanceof range_1.Range) {
            iterable = iterable.minimum <= iterable.maximum ?
                Array.from({ length: iterable.maximum - iterable.minimum + 1 }, (_, i) => iterable.minimum + i)
                : Array.from({ length: iterable.minimum - iterable.maximum + 1 }, (_, i) => iterable.minimum - i);
        }
        if (typeof iterable === "string")
            iterable = iterable.split("");
        let level = 0;
        this.loopLevel++;
        if (iterable instanceof Array) {
            for (const value of iterable) {
                const index = iterable.indexOf(value);
                const [valueDecl, indexDecl] = stmt.elementDeclarations;
                this.startRecursion(stmt.token);
                level++;
                this.scope.assign(valueDecl.identifier.name, value);
                if (indexDecl)
                    this.scope.assign(indexDecl.identifier.name, index);
                try {
                    let block = stmt.body;
                    if (!(block instanceof block_1.BlockStatement))
                        block = new block_1.BlockStatement(block.token, [block]);
                    this.executeBlock(block, this.scope);
                }
                catch (e) {
                    if (e instanceof hooked_exceptions_1.default.Break)
                        if (this.loopLevel === e.loopLevel)
                            break;
                        else if (e instanceof hooked_exceptions_1.default.Next)
                            if (this.loopLevel === e.loopLevel)
                                continue;
                            else
                                throw e;
                }
            }
        }
        else if (iterable instanceof callable_1.Callable) {
            let value;
            while (value = iterable.call() !== undefined) {
                const [valueDecl] = stmt.elementDeclarations;
                this.startRecursion(stmt.token);
                level++;
                this.scope.assign(valueDecl.identifier.name, value);
                try {
                    let block = stmt.body;
                    if (!(block instanceof block_1.BlockStatement))
                        block = new block_1.BlockStatement(block.token, [block]);
                    this.executeBlock(block, this.scope);
                }
                catch (e) {
                    if (e instanceof hooked_exceptions_1.default.Break)
                        if (this.loopLevel === e.loopLevel)
                            break;
                        else if (e instanceof hooked_exceptions_1.default.Next)
                            if (this.loopLevel === e.loopLevel)
                                continue;
                            else
                                throw e;
                }
            }
        }
        else if (iterable instanceof Object) {
            for (const [key, value] of Object.entries(iterable)) {
                const [keyDecl, valueDecl] = stmt.elementDeclarations;
                this.startRecursion(stmt.token);
                level++;
                this.scope.assign(keyDecl.identifier.name, key);
                if (valueDecl)
                    this.scope.assign(valueDecl.identifier.name, value);
                try {
                    let block = stmt.body;
                    if (!(block instanceof block_1.BlockStatement))
                        block = new block_1.BlockStatement(block.token, [block]);
                    this.executeBlock(block, this.scope);
                }
                catch (e) {
                    if (e instanceof hooked_exceptions_1.default.Break)
                        if (this.loopLevel === e.loopLevel)
                            break;
                        else if (e instanceof hooked_exceptions_1.default.Next)
                            if (this.loopLevel === e.loopLevel)
                                continue;
                            else
                                throw e;
                }
            }
        }
        this.loopLevel--;
        this.endRecursion(level);
        this.scope = enclosing;
    }
    visitNextStatement(stmt) {
        throw new hooked_exceptions_1.default.Next(stmt.token, this.loopLevel);
    }
    visitBreakStatement(stmt) {
        throw new hooked_exceptions_1.default.Break(stmt.token, this.loopLevel);
    }
    visitUseStatement(stmt) {
        if (stmt.location.intrinsic) {
            const lib = this.resolveIntrinsicLib(stmt.keyword, stmt.location.path);
            if (stmt.members === true)
                lib.inject();
            else
                for (const member of stmt.members) {
                    const libMember = lib.members[member.lexeme];
                    if (!libMember)
                        throw new errors_1.RuntimeError(`Import '${member.lexeme}' does not exist for '${stmt.location.path}'`, member);
                    if (lib.propertyTypes[member.lexeme])
                        this.intrinsics.define(member.lexeme, libMember, lib.propertyTypes[member.lexeme]);
                    else if (libMember instanceof Function && "intrinsicKind" in libMember && libMember.intrinsicKind === 1 /* Intrinsic.Kind.Function */)
                        this.intrinsics.defineFunction(member.lexeme, libMember);
                    else if (libMember instanceof intrinsic_1.default.Function)
                        this.intrinsics.defineFunctionFromInstance(member.lexeme, libMember);
                    else if (libMember instanceof Function && "intrinsicKind" in libMember && libMember.intrinsicKind === 0 /* Intrinsic.Kind.Lib */)
                        this.intrinsics.defineLib(member.lexeme, libMember);
                    else if (libMember instanceof intrinsic_1.default.Lib)
                        this.intrinsics.defineLibFromInstance(member.lexeme, libMember);
                    else if (libMember instanceof Function && "intrinsicKind" in libMember && libMember.intrinsicKind === 2 /* Intrinsic.Kind.Class */)
                        this.intrinsics.defineClass(member.lexeme, libMember);
                    else if (libMember instanceof intrinsic_1.default.Class)
                        this.intrinsics.defineClassFromInstance(member.lexeme, libMember);
                    else if (!lib.propertyTypes[member.lexeme])
                        throw new errors_1.IntrinsicRegistrationError(`Failed to register intrinsic lib '${lib.name}': '${member.lexeme}' is not an intrinsic function, library, or class, yet it has no value in 'propertyTypes'`, member);
                }
        }
        else
            throw new errors_1.RuntimeError("Module imports are not supported yet", stmt.keyword);
    }
    resolveIntrinsicLib(token, filePath) {
        const libsFolder = path_1.default.join(__dirname, "intrinsics", "libs");
        const libPath = path_1.default.join(libsFolder, filePath.slice(1));
        if (!(0, utility_1.fileExists)(libPath) && !(0, utility_1.fileExists)(libPath + ".js"))
            throw new errors_1.RuntimeError(`Invalid import: Intrinsic import path '${filePath}' does not exist`, token);
        let libFile = libPath;
        if ((0, utility_1.isDirectory)(libPath))
            libFile = path_1.default.join(libPath, "index.js");
        else
            libFile += ".js";
        const Lib = require(libFile).default;
        const parentName = libFile.split(path_1.default.sep).at(-2);
        return new Lib(this.intrinsics, parentName === "libs" || libFile.endsWith("index.js") ? undefined : parentName);
    }
    visitTypeDeclarationStatement() {
        // do nothing
    }
    visitReturnStatement(stmt) {
        const value = this.evaluate(stmt.expression);
        throw new hooked_exceptions_1.default.Return(stmt.token, value);
    }
    visitFunctionDeclarationStatement(stmt) {
        const fn = new function_1.default(stmt, this.scope, this.runner.host.typeTracker);
        this.scope.define(stmt.name, fn, {
            mutable: false
        });
    }
    visitWhileStatement(stmt) {
        this.loopLevel++;
        const inverted = stmt.token.syntax === syntax_type_1.default.Until;
        let level = 0;
        while (inverted ? !this.evaluate(stmt.condition) : this.evaluate(stmt.condition)) {
            this.startRecursion(stmt.token);
            try {
                this.execute(stmt.body);
            }
            catch (e) {
                if (e instanceof hooked_exceptions_1.default.Break)
                    if (this.loopLevel === e.loopLevel)
                        break;
                    else if (e instanceof hooked_exceptions_1.default.Next)
                        if (this.loopLevel === e.loopLevel)
                            continue;
                        else
                            throw e;
            }
            level++;
        }
        this.endRecursion(level);
        this.loopLevel--;
    }
    visitIfStatement(stmt) {
        const condition = this.evaluate(stmt.condition);
        const inverted = stmt.token.syntax === syntax_type_1.default.Unless;
        if (inverted ? !condition : condition)
            this.execute(stmt.body);
        else if (stmt.elseBranch)
            this.execute(stmt.elseBranch);
    }
    visitBlockStatement(stmt) {
        this.evaluate(stmt.members);
    }
    visitVariableDeclarationStatement(stmt) {
        const value = stmt.initializer ? this.evaluate(stmt.initializer) : undefined;
        this.scope.define(stmt.identifier.name, value, {
            mutable: stmt.mutable
        });
    }
    visitVariableAssignmentStatement(stmt) {
        const value = this.evaluate(stmt.value);
        this.scope.assign(stmt.identifier.name, value);
    }
    visitExpressionStatement(stmt) {
        return this.evaluate(stmt.expression);
    }
    visitIsInExpression(expr) {
        const value = this.evaluate(expr.value);
        const object = this.evaluate(expr.object);
        const inValues = Object.values(object).includes(value);
        if (typeof object === "string")
            return inValues;
        return value in object || inValues;
    }
    visitIsExpression(expr) {
        const boundIsExpr = this.binder.getBoundNode(expr);
        const matches = boundIsExpr.value.type.isAssignableTo(boundIsExpr.typeToCheck);
        return expr.inversed ? !matches : matches;
    }
    visitTypeOfExpression(expr) {
        const boundTypeOfExpr = this.binder.getBoundNode(expr);
        return this.getTypeName(boundTypeOfExpr.value.type);
    }
    getTypeName(type) {
        if (type instanceof literal_type_1.default)
            return singular_type_1.default.fromLiteral(type).name;
        else if (type instanceof union_type_1.default)
            return [...new Set(type.types.map(t => this.getTypeName(t)))].join(" | ");
        else
            return type.name;
    }
    visitIndexExpression(expr) {
        var _a;
        const object = this.evaluate(expr.object);
        const index = this.evaluate(expr.index);
        if (object instanceof intrinsic_1.default.Lib)
            return object.members[index];
        const realValue = object[index];
        if (type_sets_1.INTRINSIC_EXTENDED_LITERAL_VALUE_TYPES.includes(typeof object)
            || object instanceof Array
            || object instanceof range_1.Range) {
            const extendedType = singular_type_1.default.fromValue(object);
            const typeArguments = [];
            if (extendedType.name === "Array")
                typeArguments.push(...((_a = extendedType.typeArguments) !== null && _a !== void 0 ? _a : []));
            const extension = value_extensions_1.default.get(object, ...typeArguments);
            let member = extension.members[index];
            if (member instanceof Function && "intrinsicKind" in member && member.intrinsicKind === 1 /* Intrinsic.Kind.Function */)
                member = new member(this);
            return member !== null && member !== void 0 ? member : realValue;
        }
        return realValue;
    }
    visitCallExpression(expr) {
        const fn = this.evaluate(expr.callee);
        const fitsArity = typeof fn.arity === "number" ? expr.args.length === fn.arity : fn.arity.doesFit(expr.args.length);
        if (!fitsArity)
            throw new errors_1.RuntimeError(`Expected call to '${fn.name}()' to have ${fn.arity.toString()} arguments, got ${expr.args.length}`, expr.callee.token);
        const args = expr.args.map(arg => this.evaluate(arg));
        if (fn instanceof function_1.default)
            return fn.call(this, ...args);
        else
            return fn.call(...args);
    }
    visitPropertyAssignmentExpression(expr) {
        const value = this.evaluate(expr.value);
        const object = this.evaluate(expr.access.object);
        const index = this.evaluate(expr.access.index);
        object[index] = value; // modify to work with objects, any[] | Record and number | string
        return value;
    }
    visitVariableAssignmentExpression(expr) {
        const value = this.evaluate(expr.value);
        this.scope.assign(expr.identifier.name, value);
        return value;
    }
    visitCompoundAssignmentExpression(expr) {
        const operatorSyntaxName = syntax_type_1.default[expr.operator.syntax];
        const fixedOperator = new token_1.Token(syntax_type_1.default[operatorSyntaxName.replace(/Equal/, "")], expr.operator.lexeme.replace(/=/, ""), undefined, expr.operator.locationSpan);
        const binary = new binary_1.BinaryExpression(expr.left, expr.right, fixedOperator);
        const assignment = expr.left instanceof identifier_1.IdentifierExpression ?
            new variable_assignment_1.VariableAssignmentExpression(expr.left, binary)
            : new property_assignment_1.PropertyAssignmentExpression(expr.left, binary);
        return this.evaluate(assignment);
    }
    visitIdentifierExpression(expr) {
        return this.lookupVariable(expr.name);
    }
    lookupVariable(name) {
        return this.scope.get(name);
    }
    visitTernaryExpression(expr) {
        return this.evaluate(expr.condition) ?
            this.evaluate(expr.body)
            : this.evaluate(expr.elseBranch);
    }
    visitUnaryExpression(expr) {
        const operand = this.evaluate(expr.operand);
        const one = new literal_1.LiteralExpression((0, utility_1.fakeToken)(syntax_type_1.default.Int, "1", 1));
        switch (expr.operator.syntax) {
            case syntax_type_1.default.Bang:
                if (typeof operand !== "boolean")
                    return operand === undefined;
                else
                    return !operand;
            case syntax_type_1.default.Tilde:
                return ~operand;
            case syntax_type_1.default.Plus:
                return +operand;
            case syntax_type_1.default.Minus:
                return -operand;
            case syntax_type_1.default.Hashtag:
                return operand.length;
            case syntax_type_1.default.PlusPlus: {
                const compoundOperator = (0, utility_1.fakeToken)(syntax_type_1.default.PlusEqual, "+=");
                const compoundAssignment = new compound_assignment_1.CompoundAssignmentExpression(expr.operand, one, compoundOperator);
                return this.evaluate(compoundAssignment);
            }
            case syntax_type_1.default.MinusMinus: {
                const compoundOperator = (0, utility_1.fakeToken)(syntax_type_1.default.MinusEqual, "-=");
                const compoundAssignment = new compound_assignment_1.CompoundAssignmentExpression(expr.operand, one, compoundOperator);
                return this.evaluate(compoundAssignment);
            }
            default:
                throw new errors_1.RuntimeError(`(BUG) Unhandled unary operator: ${expr.operator.lexeme}`, expr.operator);
        }
    }
    visitBinaryExpression(expr) {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        switch (expr.operator.syntax) {
            case syntax_type_1.default.Plus:
                return left + right;
            case syntax_type_1.default.Minus:
                return left - right;
            case syntax_type_1.default.Star:
                if (typeof left === "number")
                    return left * right;
                else
                    return left.repeat(right);
            case syntax_type_1.default.Slash:
                if (typeof left === "number")
                    return left / right;
                else
                    return left.split(right);
            case syntax_type_1.default.SlashSlash:
                return Math.floor(left / right);
            case syntax_type_1.default.StarStar:
            case syntax_type_1.default.Carat:
                return left ** right;
            case syntax_type_1.default.Percent:
                return left % right;
            case syntax_type_1.default.Ampersand:
                return left & right;
            case syntax_type_1.default.Pipe:
                return left | right;
            case syntax_type_1.default.Tilde:
                return left ^ right;
            case syntax_type_1.default.LDoubleArrow:
                return left << right;
            case syntax_type_1.default.RDoubleArrow:
                return left >> right;
            case syntax_type_1.default.EqualEqual:
                return left === right;
            case syntax_type_1.default.BangEqual:
                return left !== right;
            case syntax_type_1.default.LT:
                return left < right;
            case syntax_type_1.default.LTE:
                return left <= right;
            case syntax_type_1.default.GT:
                return left > right;
            case syntax_type_1.default.GTE:
                return left >= right;
            case syntax_type_1.default.QuestionQuestion:
                return left !== null && left !== void 0 ? left : right;
            case syntax_type_1.default.AmpersandAmpersand:
                return left && right;
            case syntax_type_1.default.PipePipe:
                return left || right;
            default:
                throw new errors_1.RuntimeError(`(BUG) Unhandled binary operator: ${expr.operator.lexeme}`, expr.operator);
        }
    }
    visitParenthesizedExpression(expr) {
        return this.evaluate(expr.expression);
    }
    visitStringInterpolationExpression(expr) {
        return expr.parts.map(part => part === undefined ?
            "undefined"
            : (part === null ?
                "null"
                : this.evaluate(part).toString())).join("");
    }
    visitObjectLiteralExpression(expr) {
        const object = {};
        for (const [key, value] of expr.properties)
            object[this.evaluate(key)] = this.evaluate(value);
        return object;
    }
    visitArrayLiteralExpression(expr) {
        return expr.elements.map(element => this.evaluate(element));
    }
    visitRangeLiteralExpression(expr) {
        const minimum = this.evaluate(expr.minimum);
        const maximum = this.evaluate(expr.maximum);
        return new range_1.Range(minimum, maximum);
    }
    visitLiteralExpression(expr) {
        return expr.token.value;
    }
    defineArgv(argv) {
        this.intrinsics.define("argv", argv, new array_type_1.default(new singular_type_1.default("string")));
        this.definedArgv = true;
    }
    startRecursion(token) {
        this.recursionDepth++;
        if (this.recursionDepth < this.maxRecursionDepth)
            return;
        throw new errors_1.RuntimeError(`Stack overflow: Recursion depth of ${this.maxRecursionDepth} exceeded`, token);
    }
    endRecursion(level = 1) {
        this.recursionDepth -= level;
    }
    executeBlock(block, scope) {
        const enclosing = this.scope;
        try {
            this.scope = scope;
            for (const statement of block.members)
                this.execute(statement);
        }
        finally {
            this.scope = enclosing;
        }
    }
    execute(statement) {
        this.evaluate(statement);
    }
    evaluate(statements) {
        if (statements instanceof ast_1.default.Node)
            return statements.accept(this);
        else {
            let lastResult;
            for (const statement of statements)
                lastResult = statement.accept(this);
            return lastResult;
        }
    }
}
exports.default = Interpreter;
