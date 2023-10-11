"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bound_node_1 = require("../bound-node");
const union_type_1 = tslib_1.__importDefault(require("../../type-checker/types/union-type"));
const return_1 = tslib_1.__importDefault(require("./return"));
const function_declaration_1 = tslib_1.__importDefault(require("./function-declaration"));
const singular_type_1 = tslib_1.__importDefault(require("../../type-checker/types/singular-type"));
function containsReturn(stmt) {
    if (stmt instanceof function_declaration_1.default)
        return false;
    if ("body" in stmt)
        return containsReturn(stmt.body);
    else if ("statements" in stmt) {
        let contains = false;
        for (const statement of stmt.statements)
            contains || (contains = containsReturn(statement));
        return contains;
    }
    return stmt instanceof return_1.default;
}
function getReturn(stmt) {
    if ("body" in stmt)
        return getReturn(stmt.body);
    else if ("statements" in stmt) {
        const returns = [];
        for (const statement of stmt.statements) {
            const returnStmt = getReturn(statement);
            if (!returnStmt)
                continue;
            returns.push(returnStmt);
        }
        return returns.flat();
    }
    if (stmt instanceof return_1.default)
        return stmt;
    else
        for (const value of Object.values(stmt))
            if (value instanceof return_1.default)
                return value;
}
class BoundBlockStatement extends bound_node_1.BoundStatement {
    constructor(token, statements) {
        super();
        this.token = token;
        this.statements = statements;
        this.returnStatements = this.statements
            .filter(containsReturn)
            .flatMap(getReturn)
            .map(returnStmt => returnStmt === null || returnStmt === void 0 ? void 0 : returnStmt.type)
            .filter(stmt => stmt !== undefined);
        this.type = this.returnStatements.length === 0 ?
            new singular_type_1.default("undefined")
            : this.returnStatements.reduce((accum, current) => {
                if (accum instanceof union_type_1.default)
                    if (current instanceof union_type_1.default)
                        return new union_type_1.default([...accum.types, ...current.types]);
                    else
                        return new union_type_1.default([...accum.types, current]);
                else if (current instanceof union_type_1.default)
                    return new union_type_1.default([accum, ...current.types]);
                else
                    return new union_type_1.default([accum, current]);
            });
    }
    accept(visitor) {
        return visitor.visitBlockStatement(this);
    }
}
exports.default = BoundBlockStatement;
