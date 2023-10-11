"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeKind;
(function (TypeKind) {
    TypeKind[TypeKind["Singular"] = 0] = "Singular";
    TypeKind[TypeKind["Literal"] = 1] = "Literal";
    TypeKind[TypeKind["Union"] = 2] = "Union";
    TypeKind[TypeKind["Array"] = 3] = "Array";
    TypeKind[TypeKind["Function"] = 4] = "Function";
    TypeKind[TypeKind["Interface"] = 5] = "Interface";
    TypeKind[TypeKind["Class"] = 6] = "Class";
})(TypeKind || (TypeKind = {}));
exports.default = TypeKind;
