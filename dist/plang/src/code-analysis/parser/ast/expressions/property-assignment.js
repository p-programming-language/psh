"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyAssignmentExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class PropertyAssignmentExpression extends __1.default.Expression {
    constructor(access, value) {
        super();
        this.access = access;
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitPropertyAssignmentExpression(this);
    }
    get token() {
        return this.access.token;
    }
}
exports.PropertyAssignmentExpression = PropertyAssignmentExpression;
