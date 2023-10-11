"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewExpression = void 0;
const tslib_1 = require("tslib");
const __1 = tslib_1.__importDefault(require(".."));
class NewExpression extends __1.default.Expression {
    constructor(token, classRef, constructorArgs) {
        super();
        this.token = token;
        this.classRef = classRef;
        this.constructorArgs = constructorArgs;
    }
    accept(visitor) {
        return visitor.visitNewExpression(this);
    }
}
exports.NewExpression = NewExpression;
