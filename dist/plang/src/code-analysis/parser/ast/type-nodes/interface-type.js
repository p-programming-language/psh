"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceTypeExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class InterfaceTypeExpression extends __1.default.TypeRef {
    constructor(name, members, indexSignatures) {
        super();
        this.name = name;
        this.members = members;
        this.indexSignatures = indexSignatures;
    }
    get token() {
        return this.name;
    }
}
exports.InterfaceTypeExpression = InterfaceTypeExpression;
