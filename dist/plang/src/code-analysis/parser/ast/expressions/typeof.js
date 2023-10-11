"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOfExpression = void 0;
const unary_1 = require("./unary");
class TypeOfExpression extends unary_1.UnaryExpression {
    accept(visitor) {
        return visitor.visitTypeOfExpression(this);
    }
}
exports.TypeOfExpression = TypeOfExpression;
