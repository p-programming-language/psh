"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableAssignmentStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class VariableAssignmentStatement extends __1.default.Statement {
    constructor(identifier, // | AccessExpression
    value) {
        super();
        this.identifier = identifier;
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitVariableAssignmentStatement(this);
    }
    get token() {
        return this.identifier.token;
    }
}
exports.VariableAssignmentStatement = VariableAssignmentStatement;
