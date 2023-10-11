"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_sets_1 = require("../type-checker/types/type-sets");
class TypeTracker {
    constructor() {
        this.customTypes = new Map;
        this.typeScopes = [type_sets_1.INTRINSIC_TYPES];
    }
    /**
     * @returns The TypeRef associated with `name`
     */
    getRef(name) {
        return this.customTypes.get(name);
    }
    /**
     * @returns Whether or not `name` is a type created by the user
     */
    isCustomType(name) {
        return this.customTypes.has(name);
    }
    beginTypeScope() {
        this.typeScopes.push(new Set);
    }
    endTypeScope() {
        this.typeScopes.pop();
    }
    /**
     * @returns Whether or not `name` is a type recognized by P
     */
    isTypeDefined(name) {
        return this.typeScopes.some(scope => scope.has(name)) || this.isCustomType(name);
    }
    defineType(name, ref) {
        this.declareType(name);
        this.customTypes.set(name, ref);
    }
    declareType(name) {
        const typeScope = this.typeScopes.at(-1);
        typeScope === null || typeScope === void 0 ? void 0 : typeScope.add(name);
    }
}
exports.default = TypeTracker;
