"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteralTypeExpression = void 0;
const singular_type_1 = require("./singular-type");
class LiteralTypeExpression extends singular_type_1.SingularTypeExpression {
    constructor(literalToken) {
        super(literalToken);
        this.literalToken = literalToken;
    }
}
exports.LiteralTypeExpression = LiteralTypeExpression;
