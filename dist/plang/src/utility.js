"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optional = exports.getTypeFromTypeRef = exports.generateAddress = exports.fakeToken = exports.isDirectory = exports.fileExists = exports.clearTerminal = void 0;
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const os_1 = require("os");
const errors_1 = require("./errors");
const token_1 = require("./code-analysis/tokenization/token");
const singular_type_1 = require("./code-analysis/parser/ast/type-nodes/singular-type");
const literal_type_1 = require("./code-analysis/parser/ast/type-nodes/literal-type");
const union_type_1 = require("./code-analysis/parser/ast/type-nodes/union-type");
const array_type_1 = require("./code-analysis/parser/ast/type-nodes/array-type");
const function_type_1 = require("./code-analysis/parser/ast/type-nodes/function-type");
const interface_type_1 = require("./code-analysis/parser/ast/type-nodes/interface-type");
const array_type_2 = tslib_1.__importDefault(require("./code-analysis/type-checker/types/array-type"));
const literal_type_2 = tslib_1.__importDefault(require("./code-analysis/type-checker/types/literal-type"));
const singular_type_2 = tslib_1.__importDefault(require("./code-analysis/type-checker/types/singular-type"));
const union_type_2 = tslib_1.__importDefault(require("./code-analysis/type-checker/types/union-type"));
const function_type_2 = tslib_1.__importDefault(require("./code-analysis/type-checker/types/function-type"));
const interface_type_2 = tslib_1.__importDefault(require("./code-analysis/type-checker/types/interface-type"));
const class_type_1 = require("./code-analysis/parser/ast/type-nodes/class-type");
const class_type_2 = tslib_1.__importDefault(require("./code-analysis/type-checker/types/class-type"));
function clearTerminal() {
    const os = (0, os_1.platform)();
    if (os === "win32")
        (0, child_process_1.spawnSync)("cmd", ["/c", "cls"], { stdio: "inherit" });
    else
        (0, child_process_1.spawnSync)("clear", [], { stdio: "inherit" });
}
exports.clearTerminal = clearTerminal;
function fileExists(path) {
    try {
        const stats = (0, fs_1.statSync)(path);
        return stats.isFile() || stats.isDirectory();
    }
    catch (e) {
        return false;
    }
}
exports.fileExists = fileExists;
function isDirectory(path) {
    return fileExists(path) && (0, fs_1.statSync)(path).isDirectory();
}
exports.isDirectory = isDirectory;
function fakeToken(syntax, lexeme, value) {
    const pseudoLocation = new token_1.LocationSpan(new token_1.Location(-1, -1), new token_1.Location(-1, -1));
    return new token_1.Token(syntax, lexeme, value, pseudoLocation);
}
exports.fakeToken = fakeToken;
function generateAddress() {
    return `0x${Math.random().toString(16).slice(2, 12)}`;
}
exports.generateAddress = generateAddress;
function getTypeFromTypeRef(typeTracker, node) {
    var _a;
    if (node instanceof function_type_1.FunctionTypeExpression)
        return new function_type_2.default(new Map(Array.from(node.parameterTypes.entries()).map(([name, type]) => [name, getTypeFromTypeRef(typeTracker, type)])), getTypeFromTypeRef(typeTracker, node.returnType));
    else if (node instanceof array_type_1.ArrayTypeExpression)
        return new array_type_2.default(getTypeFromTypeRef(typeTracker, node.elementType));
    else if (node instanceof literal_type_1.LiteralTypeExpression)
        return new literal_type_2.default(node.literalToken.value);
    else if (node instanceof singular_type_1.SingularTypeExpression)
        return new singular_type_2.default(node.token.lexeme, (_a = node.typeArguments) === null || _a === void 0 ? void 0 : _a.map(arg => getTypeFromTypeRef(typeTracker, arg)));
    else if (node instanceof union_type_1.UnionTypeExpression)
        return new union_type_2.default(node.types.map(singular => getTypeFromTypeRef(typeTracker, singular)));
    else if (node instanceof interface_type_1.InterfaceTypeExpression) {
        const members = new Map();
        const indexSignatures = new Map();
        for (const [key, { mutable, valueType }] of node.members)
            members.set(new literal_type_2.default(key.token.value), {
                valueType: getTypeFromTypeRef(typeTracker, valueType),
                mutable
            });
        for (const [keyType, valueType] of node.indexSignatures)
            indexSignatures.set(getTypeFromTypeRef(typeTracker, keyType), getTypeFromTypeRef(typeTracker, valueType));
        return new interface_type_2.default(members, indexSignatures, node.name.lexeme);
    }
    else if (node instanceof class_type_1.ClassTypeExpression) {
        const members = new Map();
        for (const [key, { modifiers, mutable, valueType }] of node.members)
            members.set(new literal_type_2.default(key), {
                valueType: getTypeFromTypeRef(typeTracker, valueType),
                modifiers, mutable
            });
        const mixinTypes = node.mixinTypes
            .map(typeIdent => typeTracker.getRef(typeIdent.name.lexeme))
            .filter((typeRef) => typeRef !== undefined)
            .map(typeRef => getTypeFromTypeRef(typeTracker, typeRef));
        const superclassTypeRef = node.superclassType ? typeTracker.getRef(node.superclassType.name.lexeme) : undefined;
        const superclassType = superclassTypeRef ? getTypeFromTypeRef(typeTracker, superclassTypeRef) : undefined;
        return new class_type_2.default(node.name.lexeme, members, mixinTypes, superclassType);
    }
    throw new errors_1.BindingError(`(BUG) Unhandled type expression: ${node}`, node.token);
}
exports.getTypeFromTypeRef = getTypeFromTypeRef;
function optional(type) {
    return new union_type_2.default([type, new singular_type_2.default("undefined")]);
}
exports.optional = optional;
