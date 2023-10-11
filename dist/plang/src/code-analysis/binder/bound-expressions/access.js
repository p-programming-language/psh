"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bound_node_1 = require("../bound-node");
const literal_1 = tslib_1.__importDefault(require("./literal"));
const singular_type_1 = tslib_1.__importDefault(require("../../type-checker/types/singular-type"));
class BoundAccessExpression extends bound_node_1.BoundExpression {
    constructor(token, object, index, typeOverride) {
        var _a;
        super();
        this.token = token;
        this.object = object;
        this.index = index;
        this.type = new singular_type_1.default("undefined");
        if (typeOverride)
            this.type = typeOverride;
        else if (object.type.isArray())
            this.type = object.type.elementType;
        else if (object.type.isSingular() && object.type.name === "Array")
            this.type = object.type.typeArguments[0];
        else if (object.type.isInterface() && index instanceof literal_1.default) {
            const propertyType = (_a = new Map(Array.from(object.type.members.entries())
                .map(([key, value]) => [key.value, value]))
                .get(index.token.value.toString())) === null || _a === void 0 ? void 0 : _a.valueType;
            const type = propertyType !== null && propertyType !== void 0 ? propertyType : object.type.indexSignatures.get(index.type);
            if (!type)
                return;
            this.type = type;
        }
        else if (object.type.isSingular() && !object.type.isUndefined())
            this.type = object.type;
        else if ((object.type.isSingular() && object.type.name === "any") || (object.type.isUnion() && object.type.types.map(t => t.name).includes("any") && !object.type.isNullable()))
            this.type = new singular_type_1.default("any");
    }
    accept(visitor) {
        return visitor.visitIndexExpression(this);
    }
}
exports.default = BoundAccessExpression;
