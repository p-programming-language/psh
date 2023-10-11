import type { Token } from "../../../tokenization/token";
import type { InterfaceMemberSignature } from "../../../type-checker";
import type { LiteralExpression } from "../expressions/literal";
import type Syntax from "../../../tokenization/syntax-type";
import AST from "..";

export class InterfaceTypeExpression extends AST.TypeRef {
  public constructor(
    public readonly name: Token<undefined, Syntax.Identifier>,
    public readonly members: Map<LiteralExpression<string>, InterfaceMemberSignature<AST.TypeRef>>,
    public readonly indexSignatures: Map<AST.TypeRef, AST.TypeRef>,
    // public readonly typeParameters?: TypeParameterExpression[]
  ) { super(); }

  public get token(): Token {
    return this.name;
  }
}