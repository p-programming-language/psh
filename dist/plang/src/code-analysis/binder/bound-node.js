"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundStatement = exports.BoundExpression = exports.BoundNode = void 0;
const tslib_1 = require("tslib");
const ast_1 = tslib_1.__importDefault(require("../parser/ast"));
class BoundNode extends ast_1.default.Node {
}
exports.BoundNode = BoundNode;
class BoundExpression extends BoundNode {
}
exports.BoundExpression = BoundExpression;
class BoundStatement extends BoundNode {
    constructor() {
        super(...arguments);
        this.type = undefined;
    }
}
exports.BoundStatement = BoundStatement;
