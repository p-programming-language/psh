"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseStatement = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class UseStatement extends __1.default.Statement {
    constructor(keyword, members, location) {
        super();
        this.keyword = keyword;
        this.members = members;
        this.location = location;
    }
    accept(visitor) {
        return visitor.visitUseStatement(this);
    }
    get token() {
        return this.keyword;
    }
}
exports.UseStatement = UseStatement;
