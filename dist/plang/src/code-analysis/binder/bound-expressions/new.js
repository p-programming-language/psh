"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_node_1 = require("../bound-node");
class BoundNewExpression extends bound_node_1.BoundExpression {
    constructor(token, classRef, constructorArgs) {
        super();
        this.token = token;
        this.classRef = classRef;
        this.constructorArgs = constructorArgs;
        if (classRef.type.isClass())
            this.type = classRef.type.getInstanceType();
        else
            this.type = classRef.type;
    }
    accept(visitor) {
        return visitor.visitNewExpression(this);
    }
}
exports.default = BoundNewExpression;
