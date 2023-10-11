"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableAssignmentExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class VariableAssignmentExpression extends __1.default.Expression {
    constructor(identifier, value) {
        super();
        this.identifier = identifier;
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitVariableAssignmentExpression(this);
    }
    get token() {
        return this.identifier.token;
    }
}
exports.VariableAssignmentExpression = VariableAssignmentExpression;
