import type { Token } from "../../../tokenization/token";
import type { VariableDeclarationStatement } from "./variable-declaration";
import type { BlockStatement } from "./block";
import type Syntax from "../../../tokenization/syntax-type";
import AST from "..";

export class FunctionDeclarationStatement extends AST.Statement {
  public constructor(
    public readonly token: Token<undefined, Syntax.Function>,
    public readonly name: Token<undefined, Syntax.Identifier>,
    public readonly returnType: AST.TypeRef,
    public readonly parameters: VariableDeclarationStatement[],
    public readonly body: BlockStatement
  ) { super(); }

  public accept<R>(visitor: AST.Visitor.Statement<R>): R {
    return visitor.visitFunctionDeclarationStatement(this);
  }
}