"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class BlockStatement extends __1.default.Statement {
    constructor(token, members) {
        super();
        this.token = token;
        this.members = members;
    }
    accept(visitor) {
        return visitor.visitBlockStatement(this);
    }
}
exports.BlockStatement = BlockStatement;
