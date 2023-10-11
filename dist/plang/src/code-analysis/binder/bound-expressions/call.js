"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundCallExpression extends bound_node_1.BoundExpression {
    constructor(callee, args) {
        var _a;
        super();
        this.callee = callee;
        this.args = args;
        this.type = (_a = this.callee.type) === null || _a === void 0 ? void 0 : _a.returnType;
    }
    accept(visitor) {
        return visitor.visitCallExpression(this);
    }
    get token() {
        return this.callee.token;
    }
}
exports.default = BoundCallExpression;
