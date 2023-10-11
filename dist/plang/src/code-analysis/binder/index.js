"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errors_1 = require("../../errors");
const type_sets_1 = require("../type-checker/types/type-sets");
const binary_1 = require("./bound-operators/binary");
const unary_1 = require("./bound-operators/unary");
const utility_1 = require("../../utility");
const value_extensions_1 = tslib_1.__importDefault(require("../../runtime/intrinsics/value-extensions"));
const variable_symbol_1 = tslib_1.__importDefault(require("./variable-symbol"));
const singular_type_1 = tslib_1.__importDefault(require("../type-checker/types/singular-type"));
const literal_type_1 = tslib_1.__importDefault(require("../type-checker/types/literal-type"));
const union_type_1 = tslib_1.__importDefault(require("../type-checker/types/union-type"));
const function_type_1 = tslib_1.__importDefault(require("../type-checker/types/function-type"));
const array_type_1 = tslib_1.__importDefault(require("../type-checker/types/array-type"));
const interface_type_1 = tslib_1.__importDefault(require("../type-checker/types/interface-type"));
const class_type_1 = tslib_1.__importDefault(require("../type-checker/types/class-type"));
const syntax_type_1 = tslib_1.__importDefault(require("../tokenization/syntax-type"));
const ast_1 = tslib_1.__importDefault(require("../parser/ast"));
const literal_1 = tslib_1.__importDefault(require("./bound-expressions/literal"));
const string_interpolation_1 = tslib_1.__importDefault(require("./bound-expressions/string-interpolation"));
const range_literal_1 = tslib_1.__importDefault(require("./bound-expressions/range-literal"));
const array_literal_1 = tslib_1.__importDefault(require("./bound-expressions/array-literal"));
const object_literal_1 = tslib_1.__importDefault(require("./bound-expressions/object-literal"));
const parenthesized_1 = tslib_1.__importDefault(require("./bound-expressions/parenthesized"));
const unary_2 = tslib_1.__importDefault(require("./bound-expressions/unary"));
const binary_2 = tslib_1.__importDefault(require("./bound-expressions/binary"));
const ternary_1 = tslib_1.__importDefault(require("./bound-expressions/ternary"));
const identifier_1 = tslib_1.__importDefault(require("./bound-expressions/identifier"));
const compound_assignment_1 = tslib_1.__importDefault(require("./bound-expressions/compound-assignment"));
const variable_assignment_1 = tslib_1.__importDefault(require("./bound-expressions/variable-assignment"));
const property_assignment_1 = tslib_1.__importDefault(require("./bound-expressions/property-assignment"));
const call_1 = tslib_1.__importDefault(require("./bound-expressions/call"));
const access_1 = tslib_1.__importDefault(require("./bound-expressions/access"));
const typeof_1 = tslib_1.__importDefault(require("./bound-expressions/typeof"));
const is_1 = tslib_1.__importDefault(require("./bound-expressions/is"));
const is_in_1 = tslib_1.__importDefault(require("./bound-expressions/is-in"));
const new_1 = tslib_1.__importDefault(require("./bound-expressions/new"));
const expression_1 = tslib_1.__importDefault(require("./bound-statements/expression"));
const variable_assignment_2 = tslib_1.__importDefault(require("./bound-statements/variable-assignment"));
const variable_declaration_1 = tslib_1.__importDefault(require("./bound-statements/variable-declaration"));
const block_1 = tslib_1.__importDefault(require("./bound-statements/block"));
const if_1 = tslib_1.__importDefault(require("./bound-statements/if"));
const while_1 = tslib_1.__importDefault(require("./bound-statements/while"));
const function_declaration_1 = tslib_1.__importDefault(require("./bound-statements/function-declaration"));
const return_1 = tslib_1.__importDefault(require("./bound-statements/return"));
const type_declaration_1 = tslib_1.__importDefault(require("./bound-statements/type-declaration"));
const use_1 = tslib_1.__importDefault(require("./bound-statements/use"));
const every_1 = tslib_1.__importDefault(require("./bound-statements/every"));
const break_1 = tslib_1.__importDefault(require("./bound-statements/break"));
const next_1 = tslib_1.__importDefault(require("./bound-statements/next"));
const class_body_1 = tslib_1.__importDefault(require("./bound-statements/class-body"));
const class_declaration_1 = tslib_1.__importDefault(require("./bound-statements/class-declaration"));
const property_declaration_1 = tslib_1.__importDefault(require("./bound-statements/property-declaration"));
const method_declaration_1 = tslib_1.__importDefault(require("./bound-statements/method-declaration"));
var Context;
(function (Context) {
    Context[Context["Global"] = 0] = "Global";
    Context[Context["Parameters"] = 1] = "Parameters";
})(Context || (Context = {}));
class Binder {
    constructor(typeTracker) {
        this.typeTracker = typeTracker;
        this.variableScopes = [];
        this.boundNodes = new Map;
        this.context = Context.Global;
        this.beginScope();
    }
    visitMethodDeclarationStatement(stmt) {
        const enclosingContext = this.context;
        this.context = Context.Parameters;
        const parameters = stmt.parameters.map(param => this.bind(param));
        this.context = enclosingContext;
        const body = this.bind(stmt.body);
        const type = new function_type_1.default(new Map(parameters.map(decl => [decl.symbol.name.lexeme, decl.type])), (0, utility_1.getTypeFromTypeRef)(this.typeTracker, stmt.returnType));
        return new method_declaration_1.default(stmt.modifiers, stmt.name, type, parameters, body);
    }
    visitPropertyDeclarationStatement(stmt) {
        const name = stmt.identifier.name;
        const type = (0, utility_1.getTypeFromTypeRef)(this.typeTracker, stmt.typeRef);
        const initializer = stmt.initializer ? this.bind(stmt.initializer) : undefined;
        return new property_declaration_1.default(stmt.modifiers, name, type, stmt.mutable, initializer);
    }
    visitClassBodyStatement(stmt) {
        const boundStatements = this.bindStatements(stmt.members);
        return new class_body_1.default(stmt.token, boundStatements);
    }
    visitClassDeclarationStatement(stmt) {
        var _a, _b, _c;
        const superclassType = (_a = (stmt.superclass ? this.findSymbol(stmt.superclass.name) : undefined)) === null || _a === void 0 ? void 0 : _a.type;
        const mixinTypes = (_c = (_b = stmt.mixins) === null || _b === void 0 ? void 0 : _b.map(mixin => this.findSymbol(mixin.name))) === null || _c === void 0 ? void 0 : _c.map(symbol => symbol.type);
        const body = this.bind(stmt.body);
        const type = new class_type_1.default(stmt.name.lexeme, new Map(body.members.map(stmt => [new literal_type_1.default(stmt.name.lexeme), {
                modifiers: stmt.modifiers,
                valueType: stmt.type,
                mutable: stmt instanceof property_declaration_1.default ? stmt.mutable : false
            }])), mixinTypes, superclassType);
        const symbol = this.defineSymbol(stmt.name, type);
        return new class_declaration_1.default(stmt.keyword, symbol, body, mixinTypes);
    }
    visitEveryStatement(stmt) {
        const elementDeclarations = stmt.elementDeclarations
            .map(elementDeclaration => this.bind(elementDeclaration));
        const iterator = this.bind(stmt.iterable);
        const body = this.bind(stmt.body);
        return new every_1.default(stmt.token, elementDeclarations, iterator, body);
    }
    visitNextStatement(stmt) {
        return new next_1.default(stmt.token);
    }
    visitBreakStatement(stmt) {
        return new break_1.default(stmt.token);
    }
    visitUseStatement(stmt) {
        return new use_1.default(stmt.keyword, stmt.members, stmt.location);
    }
    visitTypeDeclarationStatement(stmt) {
        const symbol = this.defineSymbol(stmt.name, (0, utility_1.getTypeFromTypeRef)(this.typeTracker, stmt.typeRef));
        return new type_declaration_1.default(symbol);
    }
    visitReturnStatement(stmt) {
        const expr = this.bind(stmt.expression);
        return new return_1.default(stmt.token, expr);
    }
    visitFunctionDeclarationStatement(stmt) {
        const type = new function_type_1.default(new Map(stmt.parameters.map(param => [param.identifier.name.lexeme, (0, utility_1.getTypeFromTypeRef)(this.typeTracker, param.typeRef)])), (0, utility_1.getTypeFromTypeRef)(this.typeTracker, stmt.returnType));
        const variableSymbol = this.defineSymbol(stmt.name, type);
        const enclosingContext = this.context;
        this.context = Context.Parameters;
        const parameters = stmt.parameters.map(param => this.bind(param));
        this.context = enclosingContext;
        const body = this.bind(stmt.body);
        return new function_declaration_1.default(variableSymbol, parameters, body);
    }
    visitWhileStatement(stmt) {
        const condition = this.bind(stmt.condition);
        const body = this.bind(stmt.body);
        return new while_1.default(stmt.token, condition, body);
    }
    visitIfStatement(stmt) {
        const condition = this.bind(stmt.condition);
        const body = this.bind(stmt.body);
        const elseBranch = stmt.elseBranch ? this.bind(stmt.elseBranch) : undefined;
        return new if_1.default(stmt.token, condition, body, elseBranch);
    }
    visitBlockStatement(stmt) {
        this.beginScope();
        const boundStatements = this.bindStatements(stmt.members);
        this.endScope();
        return new block_1.default(stmt.token, boundStatements);
    }
    visitVariableDeclarationStatement(stmt) {
        var _a, _b;
        const initializer = stmt.initializer ? this.bind(stmt.initializer) : undefined;
        const variableType = (0, utility_1.getTypeFromTypeRef)(this.typeTracker, stmt.typeRef);
        let type;
        const valueIsUndefined = ((_a = initializer === null || initializer === void 0 ? void 0 : initializer.type) !== null && _a !== void 0 ? _a : new singular_type_1.default("undefined")).isUndefined() && this.context !== Context.Parameters;
        if (valueIsUndefined)
            type = variableType instanceof union_type_1.default ?
                new union_type_1.default([...variableType.types, new singular_type_1.default("undefined")])
                : new union_type_1.default([variableType, new singular_type_1.default("undefined")]);
        else if (variableType.isSingular())
            if (variableType.name === "any")
                type = (_b = initializer === null || initializer === void 0 ? void 0 : initializer.type) !== null && _b !== void 0 ? _b : variableType;
            else
                type = variableType;
        else
            type = variableType;
        const variableSymbol = this.defineSymbol(stmt.identifier.token, type);
        return new variable_declaration_1.default(variableSymbol, stmt.mutable, initializer);
    }
    visitVariableAssignmentStatement(stmt) {
        const identifier = this.bind(stmt.identifier);
        const variableSymbol = this.defineSymbol(identifier.name, identifier.type);
        const value = this.bind(stmt.value);
        return new variable_assignment_2.default(variableSymbol, value);
    }
    visitExpressionStatement(stmt) {
        return new expression_1.default(this.bind(stmt.expression));
    }
    visitNewExpression(expr) {
        const classRef = this.bind(expr.classRef);
        const args = expr.constructorArgs.map(arg => this.bind(arg));
        return new new_1.default(expr.token, classRef, args);
    }
    visitIsInExpression(expr) {
        const value = this.bind(expr.value);
        const object = this.bind(expr.object);
        return new is_in_1.default(value, object, expr.operator);
    }
    visitIsExpression(expr) {
        const value = this.bind(expr.value);
        const type = (0, utility_1.getTypeFromTypeRef)(this.typeTracker, expr.typeRef);
        return new is_1.default(value, type, expr.operator);
    }
    visitTypeOfExpression(expr) {
        const value = this.bind(expr.operand);
        return new typeof_1.default(expr.operator, value);
    }
    visitIndexExpression(expr) {
        const object = this.bind(expr.object);
        const index = this.bind(expr.index);
        if (type_sets_1.INTRINSIC_EXTENDED_LITERAL_TYPES.some(type => object.type.is(type))
            && index instanceof literal_1.default) {
            let extendedType = object.type;
            if (extendedType instanceof literal_type_1.default)
                extendedType = singular_type_1.default.fromLiteral(extendedType);
            const typeArguments = [];
            if (extendedType instanceof array_type_1.default)
                typeArguments.push(extendedType.elementType);
            const extension = value_extensions_1.default.getFake(extendedType.name, ...typeArguments);
            const memberName = index.token.value;
            const member = extension.members[memberName];
            if (!Object.keys(extension.members).includes(memberName))
                return new access_1.default(expr.token, object, index);
            let type = extension.propertyTypes[memberName];
            if (member instanceof Function && "intrinsicKind" in member && member.intrinsicKind === 1 /* Intrinsic.Kind.Function */) {
                const fn = new member();
                type = new function_type_1.default(new Map(Object.entries(fn.argumentTypes)), fn.returnType);
            }
            else if (member && !type)
                throw new errors_1.BindingError(`${extension.constructor.name} member '${memberName}' is not an Intrinsic.Function, yet has no value in 'propertyTypes'`, expr.index.token);
            return new access_1.default(expr.token, object, index, type);
        }
        return new access_1.default(expr.token, object, index);
    }
    visitCallExpression(expr) {
        const callee = this.bind(expr.callee);
        const args = expr.args.map(arg => this.bind(arg));
        const message = `Attempt to call '${callee.type.toString(false)}'`;
        // if we add lambdas we put that here too
        if (!(callee instanceof identifier_1.default || callee instanceof access_1.default))
            throw new errors_1.TypeError(message, callee.token);
        if (!callee.type.isFunction() && !(callee.type.isSingular() && callee.type.name === "any"))
            throw new errors_1.TypeError(message, callee.token);
        return new call_1.default(callee, args);
    }
    visitPropertyAssignmentExpression(expr) {
        var _a;
        const access = this.bind(expr.access);
        const value = this.bind(expr.value);
        if (access.object.type.isInterface()
            && access.index instanceof literal_1.default
            && ((_a = access.object.type.members.get(access.index.token.value)) === null || _a === void 0 ? void 0 : _a.mutable) === false) {
            throw new errors_1.TypeError(`Attempt to assign to immutable property '${access.index.token.value}'`, expr.access.index.token);
        }
        return new property_assignment_1.default(access, value);
    }
    visitVariableAssignmentExpression(expr) {
        const identifier = this.bind(expr.identifier);
        const variableSymbol = this.defineSymbol(identifier.name, identifier.type);
        const value = this.bind(expr.value);
        return new variable_assignment_1.default(variableSymbol, value);
    }
    visitCompoundAssignmentExpression(expr) {
        const left = this.bind(expr.left); // | BoundAccessExpression
        const right = this.bind(expr.right);
        const boundOperator = binary_1.BoundBinaryOperator.get(expr.operator, left.type, right.type);
        return new compound_assignment_1.default(left, right, boundOperator);
    }
    visitIdentifierExpression(expr) {
        const variableSymbol = this.findSymbol(expr.token);
        return new identifier_1.default(expr.name, variableSymbol.type);
    }
    visitTernaryExpression(expr) {
        const condition = this.bind(expr.condition);
        const body = this.bind(expr.body);
        const elseBranch = this.bind(expr.elseBranch);
        return new ternary_1.default(expr.token, condition, body, elseBranch);
    }
    visitUnaryExpression(expr) {
        let operand = this.bind(expr.operand);
        const boundOperator = unary_1.BoundUnaryOperator.get(expr.operator, operand.type);
        return new unary_2.default(operand, boundOperator);
    }
    visitBinaryExpression(expr) {
        const left = this.bind(expr.left);
        const right = this.bind(expr.right);
        const boundOperator = binary_1.BoundBinaryOperator.get(expr.operator, left.type, right.type);
        return new binary_2.default(left, right, boundOperator);
    }
    visitParenthesizedExpression(expr) {
        return new parenthesized_1.default(this.bind(expr.expression));
    }
    visitStringInterpolationExpression(expr) {
        return new string_interpolation_1.default(expr.parts.map(part => this.bind(part)));
    }
    visitObjectLiteralExpression(expr) {
        const properties = new Map();
        for (const [key, value] of expr.properties) {
            const boundKey = this.bind(key);
            let keyLiteral = boundKey;
            if (boundKey instanceof identifier_1.default)
                keyLiteral = new literal_type_1.default(boundKey.name.lexeme);
            else if (boundKey instanceof literal_1.default && key.token.syntax === syntax_type_1.default.String)
                keyLiteral = new literal_type_1.default(boundKey.token.value);
            properties.set(keyLiteral, this.bind(value));
        }
        // inferring interface type
        const indexSignatures = new Map();
        const typeProperties = Array.from(properties.entries())
            .map(([key, value]) => {
            if (key instanceof literal_type_1.default)
                return [key, {
                        valueType: value.type,
                        mutable: true
                    }];
            else {
                if (!key.type.isAssignableTo(type_sets_1.INDEX_TYPE))
                    throw new errors_1.BindingError("An index signature type must be 'string' or 'int'", key.token);
                indexSignatures.set(key.type, value.type);
            }
        })
            .filter((props) => props !== undefined);
        const type = new interface_type_1.default(new Map(typeProperties), indexSignatures);
        return new object_literal_1.default(expr.token, properties, type);
    }
    visitArrayLiteralExpression(expr) {
        const elements = expr.elements.map(element => this.bind(element));
        let elementType = new singular_type_1.default("undefined");
        // inferring element type
        for (const element of elements) {
            if (elementType.isSingular() && elementType.name === "undefined") {
                elementType = element.type;
                continue;
            }
            if (elementType.isSingular() && elementType.name !== "undefined") {
                if (element.type.isSingular() && elementType.name !== element.type.name)
                    elementType = new union_type_1.default([elementType, element.type]);
                else if (element.type.isUnion())
                    elementType = new union_type_1.default([elementType, ...element.type.types]);
                continue;
            }
            if (elementType.isUnion())
                if (element.type.isSingular())
                    elementType = new union_type_1.default([...elementType.types, element.type]);
                else if (element.type.isUnion() && elementType.types.every((t, i) => t.name !== element.type.types[i].name))
                    elementType = new union_type_1.default([...elementType.types, ...element.type.types]);
        }
        const type = new array_type_1.default(elementType);
        return new array_literal_1.default(expr.token, elements, type);
    }
    visitRangeLiteralExpression(expr) {
        const minimum = this.bind(expr.minimum);
        const maximum = this.bind(expr.maximum);
        if (!minimum.type.isSingular() || !minimum.type.isAssignableTo(new singular_type_1.default("int")))
            throw new errors_1.TypeError(`Minimum value for range must be an 'int', got '${minimum.type.toString()}'`, minimum.token);
        if (!maximum.type.isSingular() || !maximum.type.isAssignableTo(new singular_type_1.default("int")))
            throw new errors_1.TypeError(`Maximum value for range must be an 'int', got '${minimum.type.toString()}'`, minimum.token);
        const type = new singular_type_1.default("Range");
        return new range_literal_1.default(expr.operator, minimum, maximum, type);
    }
    visitLiteralExpression(expr) {
        const type = new literal_type_1.default(expr.token.value);
        return new literal_1.default(expr.token, type);
    }
    defineSymbol(name, type) {
        const variableSymbol = new variable_symbol_1.default(name, type);
        const scope = this.variableScopes.at(-1);
        scope === null || scope === void 0 ? void 0 : scope.push(variableSymbol);
        return variableSymbol;
    }
    getBoundNode(node) {
        return this.boundNodes.get(node);
    }
    bindStatements(statements) {
        return statements.map(statement => this.bind(statement));
    }
    bind(node) {
        const boundNode = (node instanceof ast_1.default.Expression ?
            node.accept(this)
            : node.accept(this));
        this.boundNodes.set(node, boundNode);
        return boundNode;
    }
    beginScope() {
        this.variableScopes.push([]);
    }
    endScope() {
        return this.variableScopes.pop();
    }
    findSymbol(name) {
        const symbol = this.variableScopes.flat().find(symbol => symbol.name.lexeme === name.lexeme);
        if (symbol)
            return symbol;
        throw new errors_1.BindingError(`Failed to find variable symbol for '${name.lexeme}'`, name);
    }
}
exports.default = Binder;
