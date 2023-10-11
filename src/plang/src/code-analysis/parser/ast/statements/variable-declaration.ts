import type { Token } from "../../../tokenization/token";
import type { IdentifierExpression } from "../expressions/identifier";
import AST from "..";

export class VariableDeclarationStatement extends AST.Statement {
  public constructor(
    public readonly typeRef: AST.TypeRef,
    public readonly identifier: IdentifierExpression,
    public readonly mutable: boolean,
    public readonly initializer?: AST.Expression,
  ) { super(); }

  public accept<R>(visitor: AST.Visitor.Statement<R>): R {
    return visitor.visitVariableDeclarationStatement(this);
  }

  public get token(): Token {
    return this.typeRef.token;
  }
}