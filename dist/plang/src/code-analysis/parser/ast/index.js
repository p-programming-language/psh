"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
var AST;
(function (AST) {
    class Node {
        toString() {
            return util_1.default.inspect(this);
        }
    }
    AST.Node = Node;
    class TypeRef extends Node {
    }
    AST.TypeRef = TypeRef;
    class Expression extends Node {
    }
    AST.Expression = Expression;
    class Statement extends Node {
    }
    AST.Statement = Statement;
    let Visitor;
    (function (Visitor) {
        class Expression {
        }
        Visitor.Expression = Expression;
        class Statement {
        }
        Visitor.Statement = Statement;
        class BoundExpression {
        }
        Visitor.BoundExpression = BoundExpression;
        class BoundStatement {
        }
        Visitor.BoundStatement = BoundStatement;
    })(Visitor = AST.Visitor || (AST.Visitor = {}));
})(AST || (AST = {}));
exports.default = AST;
