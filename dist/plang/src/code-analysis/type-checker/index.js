"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeChecker = exports.ModifierType = void 0;
const tslib_1 = require("tslib");
const errors_1 = require("../../errors");
const bound_node_1 = require("../binder/bound-node");
const type_sets_1 = require("./types/type-sets");
const function_type_1 = tslib_1.__importDefault(require("./types/function-type"));
const interface_type_1 = tslib_1.__importDefault(require("./types/interface-type"));
const singular_type_1 = tslib_1.__importDefault(require("./types/singular-type"));
const literal_type_1 = tslib_1.__importDefault(require("./types/literal-type"));
const union_type_1 = tslib_1.__importDefault(require("./types/union-type"));
const array_type_1 = tslib_1.__importDefault(require("./types/array-type"));
const array_literal_1 = tslib_1.__importDefault(require("../binder/bound-expressions/array-literal"));
;
var ModifierType;
(function (ModifierType) {
    ModifierType[ModifierType["Public"] = 0] = "Public";
    ModifierType[ModifierType["Protected"] = 1] = "Protected";
    ModifierType[ModifierType["Private"] = 2] = "Private";
    ModifierType[ModifierType["Static"] = 3] = "Static";
})(ModifierType || (exports.ModifierType = ModifierType = {}));
// NOTE: always call check() before assert()
class TypeChecker {
    visitMethodDeclarationStatement(stmt) {
        var _a, _b, _c;
        this.check(stmt.parameters);
        this.check(stmt.body);
        if (!((_a = stmt.body.type) === null || _a === void 0 ? void 0 : _a.isAssignableTo(stmt.type.returnType)))
            throw new errors_1.TypeError(`Method '${stmt.name.lexeme}' is expected to return type '${stmt.type.returnType.toString()}', got '${(_c = (_b = stmt.body.type) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "void"}'`, stmt.name);
    }
    visitPropertyDeclarationStatement(stmt) {
        if (!stmt.initializer)
            return;
        this.check(stmt.initializer);
        if (stmt.initializer instanceof array_literal_1.default && stmt.initializer.type.elementType.toString() === "undefined")
            return; // simply forgo the assertion if the array is empty, because an empty array will always be a Array<undefined>
        this.assert(stmt.initializer, stmt.initializer.type, stmt.type);
    }
    visitClassBodyStatement(stmt) {
        this.check(stmt.members);
    }
    visitClassStatement(stmt) {
        if (stmt.superclass)
            if (!stmt.superclass.isClass())
                throw new errors_1.TypeError(`Cannot extend a class with value of type '${stmt.superclass.toString()}'`, stmt.keyword);
            else if (stmt.superclass === stmt.type)
                throw new errors_1.TypeError(`Cannot extend class with itself`, stmt.keyword);
        if (stmt.mixins)
            for (const mixin of stmt.mixins)
                if (!mixin.isClass())
                    throw new errors_1.TypeError(`Cannot mixin a class with value of type '${mixin.toString()}'`, stmt.keyword);
                else if (mixin === stmt.type)
                    throw new errors_1.TypeError(`Cannot mixin class with itself`, stmt.keyword);
        this.check(stmt.body);
    }
    visitEveryStatement(stmt) {
        this.check(stmt.elementDeclarations);
        this.check(stmt.iterable);
        this.check(stmt.body);
        const iterableType = stmt.iterable.type;
        if (iterableType instanceof interface_type_1.default) {
            const [keyDecl, valueDecl] = stmt.elementDeclarations;
            const keyAssignable = Array.from(iterableType.members.keys())
                .concat(Array.from(iterableType.indexSignatures.keys()))
                .every(type => type.isAssignableTo(keyDecl.type));
            if (!keyAssignable)
                throw new errors_1.TypeError(`Iterable key type is not assignable to '${keyDecl.type.toString()}'`, keyDecl.token);
            const valueAssignable = Array.from(iterableType.members.values())
                .map(sig => sig.valueType)
                .concat(Array.from(iterableType.indexSignatures.values()))
                .every(type => type.isAssignableTo(valueDecl.type));
            if (!valueAssignable)
                throw new errors_1.TypeError(`Iterable value type is not assignable to '${valueDecl.type.toString()}'`, valueDecl.token);
        }
        else if (iterableType instanceof array_type_1.default) {
            const [valueDecl, indexDecl] = stmt.elementDeclarations;
            const indexAssignable = indexDecl.type.isAssignableTo(new singular_type_1.default("int"));
            if (!indexAssignable)
                throw new errors_1.TypeError(`'${indexDecl.type.toString()}' is not assignable to array index type, 'int'`, valueDecl.token);
            const valueAssignable = valueDecl.type.isAssignableTo(iterableType.elementType);
            if (!valueAssignable)
                throw new errors_1.TypeError(`Array value type is not assignable to '${valueDecl.type.toString()}'`, indexDecl.token);
        }
        else {
            const [declaration] = stmt.elementDeclarations;
            if (iterableType instanceof function_type_1.default) {
                const nextFunctionType = iterableType.returnType;
                const invalidIteratorMessage = `Invalid iterator function '${nextFunctionType.toString()}'`;
                if (!(nextFunctionType instanceof function_type_1.default))
                    throw new errors_1.TypeError(`${invalidIteratorMessage}: Iterators must return a function`, stmt.iterable.token);
                if (!new singular_type_1.default("undefined").isAssignableTo(nextFunctionType.returnType))
                    throw new errors_1.TypeError(`${invalidIteratorMessage}: Iterator next functions must have a nullable return type`, stmt.iterable.token);
                this.assert(declaration, declaration.type, nextFunctionType.returnType);
            }
            else {
                if (!iterableType.isAssignableTo(new union_type_1.default([
                    new singular_type_1.default("Range"),
                    new singular_type_1.default("int"),
                    new singular_type_1.default("string")
                ]))) {
                    throw new errors_1.TypeError(`'${iterableType.toString()}' is not a valid iterable type`, stmt.iterable.token);
                }
            }
        }
    }
    visitNextStatement() {
        // do nothing
    }
    visitBreakStatement() {
        // do nothing
    }
    visitUseStatement() {
        // do nothing
    }
    visitTypeDeclarationStatement() {
        // do nothing
    }
    visitReturnStatement(stmt) {
        this.check(stmt.expression);
    }
    visitFunctionDeclarationStatement(stmt) {
        var _a, _b, _c;
        this.check(stmt.parameters);
        this.check(stmt.body);
        if (!((_a = stmt.body.type) === null || _a === void 0 ? void 0 : _a.isAssignableTo(stmt.type.returnType)))
            throw new errors_1.TypeError(`Function '${stmt.symbol.name.lexeme}' is expected to return type '${stmt.type.returnType.toString()}', got '${(_c = (_b = stmt.body.type) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "void"}'`, stmt.symbol.name);
    }
    visitWhileStatement(stmt) {
        this.check(stmt.condition);
        this.check(stmt.body);
    }
    visitIfStatement(stmt) {
        this.check(stmt.condition);
        this.check(stmt.body);
        if (!stmt.elseBranch)
            return;
        this.check(stmt.elseBranch);
    }
    visitBlockStatement(stmt) {
        this.check(stmt.statements);
    }
    visitVariableDeclarationStatement(stmt) {
        if (!stmt.initializer)
            return;
        this.check(stmt.initializer);
        if (stmt.initializer instanceof array_literal_1.default && stmt.initializer.type.elementType.toString() === "undefined")
            return; // simply forgo the assertion if the array is empty, because an empty array will always be a Array<undefined>
        this.assert(stmt.initializer, stmt.initializer.type, stmt.symbol.type);
    }
    visitVariableAssignmentStatement(stmt) {
        this.check(stmt.value);
        this.assert(stmt.value, stmt.value.type, stmt.symbol.type);
    }
    visitExpressionStatement(stmt) {
        this.check(stmt.expression);
    }
    visitNewExpression(expr) {
        this.check(expr.classRef);
        for (const arg of expr.constructorArgs)
            this.check(arg);
        const classType = expr.classRef.type;
        if (!classType.isClass())
            throw new errors_1.TypeError("Cannot call 'new' on anything except a class", expr.token);
        const constructorType = Array.from(classType.getInstanceType().members.values())
            .map(sig => sig.valueType)
            .find((type) => type.isFunction());
        if (constructorType) {
            const expectedTypes = Array.from(constructorType.parameterTypes.entries());
            for (const arg of expr.constructorArgs) {
                const [parameterName, expectedType] = expectedTypes[expr.constructorArgs.indexOf(arg)];
                this.check(arg);
                this.assert(arg, arg.type, expectedType, `Constructor argument type '${arg.type.toString()}' is not assignable to type '${expectedType.toString()}' of parameter '${parameterName}'`);
            }
        }
    }
    visitIsInExpression(expr) {
        this.check(expr.value);
        this.check(expr.object);
    }
    visitIsExpression(expr) {
        this.check(expr.value);
    }
    visitTypeOfExpression(expr) {
        this.check(expr.value);
    }
    visitIndexExpression(expr) {
        this.check(expr.object);
        this.check(expr.index);
        if (!expr.object.type.isAssignableTo(new array_type_1.default(new singular_type_1.default("any")))
            && !expr.object.type.isInterface()
            && !type_sets_1.INDEXABLE_LITERAL_TYPES.some(type => expr.object.type.is(type))) {
            throw new errors_1.TypeError(`Attempt to index '${expr.object.type.toString()}'`, expr.object.token);
        }
        this.assert(expr.index, expr.index.type, type_sets_1.INDEX_TYPE);
    }
    visitCallExpression(expr) {
        this.check(expr.callee);
        if (!(expr.callee.type instanceof function_type_1.default))
            return;
        const expectedTypes = Array.from(expr.callee.type.parameterTypes.entries());
        for (const arg of expr.args) {
            const parameter = expectedTypes[expr.args.indexOf(arg)];
            if (!parameter)
                continue;
            const [parameterName, expectedType] = parameter;
            this.check(arg);
            this.assert(arg, arg.type, expectedType, `Argument type '${arg.type.toString()}' is not assignable to type '${expectedType.toString()}' of parameter '${parameterName}'`);
        }
    }
    visitPropertyAssignmentExpression(expr) {
        this.check(expr.access);
        this.check(expr.value);
        this.assert(expr.access, expr.access.type, expr.value.type);
    }
    visitVariableAssignmentExpression(expr) {
        this.check(expr.value);
        this.assert(expr.value, expr.value.type, expr.symbol.type);
    }
    visitCompoundAssignmentExpression(expr) {
        this.check(expr.left);
        this.check(expr.right);
        this.assert(expr.left, expr.left.type, expr.operator.leftType);
        this.assert(expr.right, expr.right.type, expr.operator.rightType);
        this.assert(expr.left, expr.left.type, expr.right.type);
    }
    visitIdentifierExpression() {
        // do nothing
    }
    visitUnaryExpression(expr) {
        this.check(expr.operand);
        this.assert(expr.operand, expr.operand.type, expr.operator.operandType);
    }
    visitTernaryExpression(expr) {
        this.check(expr.condition);
        this.check(expr.body);
        this.check(expr.elseBranch);
    }
    visitBinaryExpression(expr) {
        this.check(expr.left);
        this.check(expr.right);
        this.assert(expr.left, expr.left.type, expr.operator.leftType);
        this.assert(expr.right, expr.right.type, expr.operator.rightType);
    }
    visitParenthesizedExpression(expr) {
        this.check(expr.expression);
    }
    visitStringInterpolationExpression(expr) {
        for (const part of expr.parts)
            this.check(part);
    }
    visitObjectLiteralExpression(expr) {
        for (const [key, value] of expr.properties) {
            if (key instanceof bound_node_1.BoundExpression)
                this.check(key);
            this.check(value);
            if (key instanceof literal_type_1.default) {
                const signature = this.getInterfacePropertySignature(expr.type, key, expr.token);
                this.assert(value, value.type, signature.valueType);
            }
            else {
                const valueType = key.type.isAssignableTo(type_sets_1.INDEX_TYPE) && expr.type.indexSignatures.get(key.type);
                if (!valueType)
                    throw new errors_1.TypeError(`Index signature for '${key.type.toString()}' does not exist on '${expr.type.name}'`, key.token);
                this.assert(value, value.type, valueType);
            }
        }
    }
    getInterfacePropertySignature(interfaceType, propertyName, token) {
        const valueType = interfaceType.members.get(propertyName);
        if (!valueType)
            throw new errors_1.TypeError(`Property '${propertyName.value}' does not exist on '${interfaceType.name}'`, token);
        return valueType;
    }
    visitArrayLiteralExpression(expr) {
        for (const element of expr.elements) {
            this.check(element);
            this.assert(element, element.type, expr.type.elementType);
        }
    }
    visitRangeLiteralExpression(expr) {
        this.check(expr.minimum);
        this.check(expr.maximum);
    }
    visitLiteralExpression() {
        // do nothing
    }
    check(statements) {
        if (statements instanceof Array)
            for (const statement of statements)
                this.check(statement);
        else
            statements.accept(this);
    }
    isUndefined(type) {
        return type.isAssignableTo(new union_type_1.default([
            new singular_type_1.default("void"),
            new singular_type_1.default("undefined")
        ]));
    }
    assert(node, a, b, message) {
        if (a.isAssignableTo(b))
            return;
        throw new errors_1.TypeError(message !== null && message !== void 0 ? message : `Type '${a.toString()}' is not assignable to type '${b.toString()}'`, node.token);
    }
}
exports.TypeChecker = TypeChecker;
