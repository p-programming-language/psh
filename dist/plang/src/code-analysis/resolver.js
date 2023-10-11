"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errors_1 = require("../errors");
const ast_1 = tslib_1.__importDefault(require("../code-analysis/parser/ast"));
class Resolver {
    constructor() {
        this.withinFunction = false;
        this.scopeContext = 0 /* ScopeContext.Global */;
        this.scopes = []; // the boolean represents whether the variable is defined or not. a variable can be declared without being defined
        this.beginScope();
    }
    visitMethodDeclarationStatement(stmt) {
        this.resolveFunction(stmt);
    }
    visitPropertyDeclarationStatement(stmt) {
        if (stmt.initializer)
            this.resolve(stmt.initializer);
    }
    visitClassBodyStatement(stmt) {
        this.scopeContext = 2 /* ScopeContext.Class */;
        this.resolve(stmt.members);
        this.scopeContext = 0 /* ScopeContext.Global */;
    }
    visitClassDeclarationStatement(stmt) {
        this.declare(stmt.name);
        this.define(stmt.name);
        this.resolve(stmt.body);
    }
    visitNewExpression(expr) {
        this.resolve(expr.classRef);
        for (const arg of expr.constructorArgs)
            this.resolve(arg);
    }
    visitEveryStatement(stmt) {
        this.beginScope();
        this.resolve(stmt.elementDeclarations);
        this.resolve(stmt.iterable);
        this.resolve(stmt.body);
        this.endScope();
    }
    visitNextStatement() {
        // do nothing
    }
    visitBreakStatement() {
        // do nothing
    }
    visitUseStatement(stmt) {
        if (this.scopeContext !== 0 /* ScopeContext.Global */)
            throw new errors_1.ResolutionError(`Imports cannot be used outside of the global scope`, stmt.keyword);
        if (typeof stmt.members === "boolean")
            return;
        for (const member of stmt.members) {
            this.declare(member);
            this.define(member);
        }
    }
    visitTypeDeclarationStatement() {
        // do nothing
    }
    visitReturnStatement(stmt) {
        if (!this.withinFunction)
            throw new errors_1.ResolutionError("Invalid return statement: Can only use 'return' within a function body", stmt.token);
        this.resolve(stmt.expression);
    }
    visitFunctionDeclarationStatement(stmt) {
        this.declare(stmt.name);
        this.define(stmt.name);
        this.resolveFunction(stmt);
    }
    visitWhileStatement(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.body);
    }
    visitIfStatement(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.body);
        if (!stmt.elseBranch)
            return;
        this.resolve(stmt.elseBranch);
    }
    visitBlockStatement(stmt) {
        const enclosingContext = this.scopeContext;
        this.scopeContext = 1 /* ScopeContext.Block */;
        this.resolve(stmt.members);
        this.scopeContext = enclosingContext;
    }
    visitVariableDeclarationStatement(stmt) {
        this.declare(stmt.identifier.token);
        if (stmt.initializer)
            this.resolve(stmt.initializer);
        this.define(stmt.identifier.token);
    }
    visitVariableAssignmentStatement(stmt) {
        this.resolve(stmt.identifier);
        this.resolve(stmt.value);
    }
    visitExpressionStatement(stmt) {
        this.resolve(stmt.expression);
    }
    visitIsInExpression(expr) {
        this.resolve(expr.value);
        this.resolve(expr.object);
    }
    visitIsExpression(expr) {
        this.resolve(expr.value);
    }
    visitTypeOfExpression(expr) {
        this.resolve(expr.operand);
    }
    visitIndexExpression(expr) {
        this.resolve(expr.object);
        this.resolve(expr.index);
    }
    visitCallExpression(expr) {
        this.resolve(expr.callee);
        for (const arg of expr.args)
            this.resolve(arg);
    }
    visitPropertyAssignmentExpression(expr) {
        this.resolve(expr.access);
        this.resolve(expr.value);
    }
    visitVariableAssignmentExpression(expr) {
        this.resolve(expr.identifier);
        this.resolve(expr.value);
    }
    visitCompoundAssignmentExpression(expr) {
        this.resolve(expr.left);
        this.resolve(expr.right);
    }
    visitIdentifierExpression(expr) {
        const scope = this.scopes.at(-1);
        if (this.scopes.length > 0 && scope.get(expr.token.lexeme) === false)
            throw new errors_1.ReferenceError(`Cannot read variable '${expr.token.lexeme}' in it's own initializer`, expr.token);
        if (!this.isDefined(expr.token))
            throw new errors_1.ReferenceError(`'${expr.token.lexeme}' is not defined in this scope`, expr.token);
    }
    visitTernaryExpression(expr) {
        this.resolve(expr.condition);
        this.resolve(expr.body);
        this.resolve(expr.elseBranch);
    }
    visitUnaryExpression(expr) {
        this.resolve(expr.operand);
    }
    visitBinaryExpression(expr) {
        this.resolve(expr.left);
        this.resolve(expr.right);
    }
    visitParenthesizedExpression(expr) {
        this.resolve(expr.expression);
    }
    visitStringInterpolationExpression(expr) {
        for (const part of expr.parts)
            this.resolve(part);
    }
    visitObjectLiteralExpression(expr) {
        for (const [key, value] of expr.properties) {
            this.resolve(key);
            this.resolve(value);
        }
    }
    visitArrayLiteralExpression(expr) {
        for (const element of expr.elements)
            this.resolve(element);
    }
    visitRangeLiteralExpression() {
        // do nothing
    }
    visitLiteralExpression() {
        // do nothing
    }
    resolve(statements) {
        if (statements instanceof Array)
            for (const statement of statements)
                this.resolve(statement);
        else if (statements instanceof ast_1.default.Statement)
            statements.accept(this);
        else if (statements instanceof ast_1.default.Expression)
            statements.accept(this);
    }
    define(identifier) {
        if (this.scopes.length === 0)
            return;
        const scope = this.scopes.at(-1);
        scope === null || scope === void 0 ? void 0 : scope.set(identifier.lexeme, true);
    }
    declare(identifier) {
        if (this.scopes.length === 0)
            return;
        const scope = this.scopes.at(-1);
        if (scope === null || scope === void 0 ? void 0 : scope.has(identifier.lexeme))
            throw new errors_1.ReferenceError(`Variable '${identifier.lexeme}' is already declared is this scope`, identifier);
        scope === null || scope === void 0 ? void 0 : scope.set(identifier.lexeme, false);
    }
    resolveFunction(fn) {
        const enclosingWithin = this.withinFunction;
        this.withinFunction = true;
        this.beginScope();
        for (const param of fn.parameters) {
            this.declare(param.identifier.name);
            this.define(param.identifier.name);
        }
        this.resolve(fn.body);
        this.endScope();
        this.withinFunction = enclosingWithin;
    }
    isDefined(identifier) {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            const scope = this.scopes[i];
            if (scope === null || scope === void 0 ? void 0 : scope.has(identifier.lexeme))
                return scope.get(identifier.lexeme);
        }
        return false;
    }
    beginScope() {
        this.scopes.push(new Map);
    }
    endScope() {
        this.scopes.pop();
    }
}
exports.default = Resolver;
