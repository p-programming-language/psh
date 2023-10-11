import util from "util";

import type { Token } from "../../tokenization/token";
import type { LiteralExpression } from "./expressions/literal";
import type { StringInterpolationExpression } from "./expressions/string-interpolation";
import type { RangeLiteralExpression } from "./expressions/range-literal";
import type { ArrayLiteralExpression } from "./expressions/array-literal";
import type { ObjectLiteralExpression } from "./expressions/object-literal";
import type { ParenthesizedExpression } from "./expressions/parenthesized";
import type { UnaryExpression } from "./expressions/unary";
import type { BinaryExpression } from "./expressions/binary";
import type { TernaryExpression } from "./expressions/ternary";
import type { IdentifierExpression } from "./expressions/identifier";
import type { CompoundAssignmentExpression } from "./expressions/compound-assignment";
import type { VariableAssignmentExpression } from "./expressions/variable-assignment";
import type { PropertyAssignmentExpression } from "./expressions/property-assignment";
import type { CallExpression } from "./expressions/call";
import type { AccessExpression } from "./expressions/access";
import type { TypeOfExpression } from "./expressions/typeof";
import type { IsExpression } from "./expressions/is";
import type { IsInExpression } from "./expressions/is-in";
import type { NewExpression } from "./expressions/new";
import type { ExpressionStatement } from "./statements/expression";
import type { VariableAssignmentStatement } from "./statements/variable-assignment";
import type { VariableDeclarationStatement } from "./statements/variable-declaration";
import type { BlockStatement } from "./statements/block";
import type { IfStatement } from "./statements/if";
import type { WhileStatement } from "./statements/while";
import type { FunctionDeclarationStatement } from "./statements/function-declaration";
import type { ReturnStatement } from "./statements/return";
import type { TypeDeclarationStatement } from "./statements/type-declaration";
import type { UseStatement } from "./statements/use";
import type { BreakStatement } from "./statements/break";
import type { NextStatement } from "./statements/next";
import type { EveryStatement } from "./statements/every";
import type { ClassBodyStatement } from "./statements/class-body";
import type { ClassDeclarationStatement } from "./statements/class-declaration";
import type { PropertyDeclarationStatement } from "./statements/property-declaration";
import type { MethodDeclarationStatement } from "./statements/method-declaration";

import type BoundLiteralExpression from "../../binder/bound-expressions/literal";
import type BoundStringInterpolationExpression from "../../binder/bound-expressions/string-interpolation";
import type BoundRangeLiteralExpression from "../../binder/bound-expressions/range-literal";
import type BoundArrayLiteralExpression from "../../binder/bound-expressions/array-literal";
import type BoundObjectLiteralExpression from "../../binder/bound-expressions/object-literal";
import type BoundParenthesizedExpression from "../../binder/bound-expressions/parenthesized";
import type BoundBinaryExpression from "../../binder/bound-expressions/binary";
import type BoundUnaryExpression from "../../binder/bound-expressions/unary";
import type BoundTernaryExpression from "../../binder/bound-expressions/ternary";
import type BoundIdentifierExpression from "../../binder/bound-expressions/identifier";
import type BoundCompoundAssignmentExpression from "../../binder/bound-expressions/compound-assignment";
import type BoundVariableAssignmentExpression from "../../binder/bound-expressions/variable-assignment";
import type BoundPropertyAssignmentExpression from "../../binder/bound-expressions/property-assignment";
import type BoundCallExpression from "../../binder/bound-expressions/call";
import type BoundAccessExpression from "../../binder/bound-expressions/access";
import type BoundIsExpression from "../../binder/bound-expressions/is";
import type BoundTypeOfExpression from "../../binder/bound-expressions/typeof";
import type BoundIsInExpression from "../../binder/bound-expressions/is-in";
import type BoundNewExpression from "../../binder/bound-expressions/new";
import type BoundExpressionStatement from "../../binder/bound-statements/expression";
import type BoundVariableAssignmentStatement from "../../binder/bound-statements/variable-assignment";
import type BoundVariableDeclarationStatement from "../../binder/bound-statements/variable-declaration";
import type BoundBlockStatement from "../../binder/bound-statements/block";
import type BoundIfStatement from "../../binder/bound-statements/if";
import type BoundWhileStatement from "../../binder/bound-statements/if";
import type BoundFunctionDeclarationStatement from "../../binder/bound-statements/function-declaration";
import type BoundReturnStatement from "../../binder/bound-statements/return";
import type BoundTypeDeclarationStatement from "../../binder/bound-statements/type-declaration";
import type BoundUseStatement from "../../binder/bound-statements/use";
import type BoundBreakStatement from "../../binder/bound-statements/break";
import type BoundEveryStatement from "../../binder/bound-statements/every";
import type BoundNextStatement from "../../binder/bound-statements/next";
import type BoundClassBodyStatement from "../../binder/bound-statements/class-body";
import type BoundClassDeclarationStatement from "../../binder/bound-statements/class-declaration";
import type BoundPropertyDeclarationStatement from "../../binder/bound-statements/property-declaration";
import type BoundMethodDeclarationStatement from "../../binder/bound-statements/method-declaration";

namespace AST {
  export abstract class Node {
    public abstract get token(): Token;

    public toString(): string {
      return util.inspect(this);
    }
  }

  export abstract class TypeRef extends Node {}
  export abstract class Expression extends Node {
    abstract accept<R>(visitor: Visitor.Expression<R>): R
  }
  export abstract class Statement extends Node {
    abstract accept<R>(visitor: Visitor.Statement<R>): R
  }

  export namespace Visitor {
    export abstract class Expression<R> {
      public abstract visitNewExpression(expr: NewExpression): R
      public abstract visitIsInExpression(expr: IsInExpression): R
      public abstract visitIsExpression(expr: IsExpression): R
      public abstract visitTypeOfExpression(expr: TypeOfExpression): R
      public abstract visitIndexExpression(expr: AccessExpression): R
      public abstract visitCallExpression(expr: CallExpression): R
      public abstract visitPropertyAssignmentExpression(expr: PropertyAssignmentExpression): R
      public abstract visitVariableAssignmentExpression(expr: VariableAssignmentExpression): R
      public abstract visitCompoundAssignmentExpression(expr: CompoundAssignmentExpression): R
      public abstract visitIdentifierExpression(expr: IdentifierExpression): R
      public abstract visitTernaryExpression(expr: TernaryExpression): R
      public abstract visitBinaryExpression(expr: BinaryExpression): R
      public abstract visitUnaryExpression(expr: UnaryExpression): R
      public abstract visitParenthesizedExpression(expr: ParenthesizedExpression): R
      public abstract visitObjectLiteralExpression(expr: ObjectLiteralExpression): R
      public abstract visitArrayLiteralExpression(expr: ArrayLiteralExpression): R
      public abstract visitRangeLiteralExpression(expr: RangeLiteralExpression): R
      public abstract visitStringInterpolationExpression(expr: StringInterpolationExpression): R
      public abstract visitLiteralExpression(expr: LiteralExpression): R
    }

    export abstract class Statement<R> {
      public abstract visitMethodDeclarationStatement(stmt: MethodDeclarationStatement): R
      public abstract visitPropertyDeclarationStatement(stmt: PropertyDeclarationStatement): R
      public abstract visitClassBodyStatement(stmt: ClassBodyStatement): R
      public abstract visitClassDeclarationStatement(stmt: ClassDeclarationStatement): R
      public abstract visitEveryStatement(stmt: EveryStatement): R
      public abstract visitNextStatement(stmt: NextStatement): R
      public abstract visitBreakStatement(stmt: BreakStatement): R
      public abstract visitUseStatement(stmt: UseStatement): R
      public abstract visitTypeDeclarationStatement(stmt: TypeDeclarationStatement): R
      public abstract visitReturnStatement(stmt: ReturnStatement): R
      public abstract visitFunctionDeclarationStatement(stmt: FunctionDeclarationStatement): R
      public abstract visitWhileStatement(stmt: WhileStatement): R
      public abstract visitIfStatement(stmt: IfStatement): R
      public abstract visitBlockStatement(stmt: BlockStatement): R
      public abstract visitVariableDeclarationStatement(stmt: VariableDeclarationStatement): R
      public abstract visitVariableAssignmentStatement(stmt: VariableAssignmentStatement): R
      public abstract visitExpressionStatement(stmt: ExpressionStatement): R
    }

    export abstract class BoundExpression<R> {
      public abstract visitNewExpression(expr: BoundNewExpression): R
      public abstract visitIsInExpression(expr: BoundIsInExpression): R
      public abstract visitIsExpression(expr: BoundIsExpression): R
      public abstract visitTypeOfExpression(expr: BoundTypeOfExpression): R
      public abstract visitIndexExpression(expr: BoundAccessExpression): R
      public abstract visitCallExpression(expr: BoundCallExpression): R
      public abstract visitPropertyAssignmentExpression(expr: BoundPropertyAssignmentExpression): R
      public abstract visitVariableAssignmentExpression(expr: BoundVariableAssignmentExpression): R
      public abstract visitCompoundAssignmentExpression(expr: BoundCompoundAssignmentExpression): R
      public abstract visitIdentifierExpression(expr: BoundIdentifierExpression): R
      public abstract visitTernaryExpression(expr: BoundTernaryExpression): R
      public abstract visitBinaryExpression(expr: BoundBinaryExpression): R
      public abstract visitUnaryExpression(expr: BoundUnaryExpression): R
      public abstract visitParenthesizedExpression(expr: BoundParenthesizedExpression): R
      public abstract visitObjectLiteralExpression(expr: BoundObjectLiteralExpression): R
      public abstract visitArrayLiteralExpression(expr: BoundArrayLiteralExpression): R
      public abstract visitRangeLiteralExpression(expr: BoundRangeLiteralExpression): R
      public abstract visitStringInterpolationExpression(expr: BoundStringInterpolationExpression): R
      public abstract visitLiteralExpression(expr: BoundLiteralExpression): R
    }

    export abstract class BoundStatement<R> {
      public abstract visitMethodDeclarationStatement(stmt: BoundMethodDeclarationStatement): R
      public abstract visitPropertyDeclarationStatement(stmt: BoundPropertyDeclarationStatement): R
      public abstract visitClassBodyStatement(stmt: BoundClassBodyStatement): R
      public abstract visitClassStatement(stmt: BoundClassDeclarationStatement): R
      public abstract visitEveryStatement(stmt: BoundEveryStatement): R
      public abstract visitNextStatement(stmt: BoundNextStatement): R
      public abstract visitBreakStatement(stmt: BoundBreakStatement): R
      public abstract visitUseStatement(stmt: BoundUseStatement): R
      public abstract visitTypeDeclarationStatement(stmt: BoundTypeDeclarationStatement): R
      public abstract visitReturnStatement(stmt: BoundReturnStatement): R
      public abstract visitFunctionDeclarationStatement(stmt: BoundFunctionDeclarationStatement): R
      public abstract visitWhileStatement(stmt: BoundWhileStatement): R
      public abstract visitIfStatement(stmt: BoundIfStatement): R
      public abstract visitBlockStatement(stmt: BoundBlockStatement): R
      public abstract visitVariableDeclarationStatement(stmt: BoundVariableDeclarationStatement): R
      public abstract visitVariableAssignmentStatement(stmt: BoundVariableAssignmentStatement): R
      public abstract visitExpressionStatement(stmt: BoundExpressionStatement): R
    }
  }
}

export default AST;