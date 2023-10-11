import { Type } from "./type";
import type { IndexType, InterfaceMemberSignature } from "..";
import type LiteralType from "./literal-type";
import TypeKind from "./type-kind";
import SingularType from "./singular-type";

export default class InterfaceType extends SingularType {
  public override readonly kind = TypeKind.Interface;

  public constructor(
    public readonly members: Map<LiteralType<string>, InterfaceMemberSignature<Type>>,
    public readonly indexSignatures: Map<IndexType, Type>,
    // public readonly typeParameters?: TypeParameter[],
    name = "Object"
  ) { super(name); }

  public toString(colors?: boolean, indent = 0): string {
    let result = (this.name === "Object" ? "" : this.name + " ") + "{";
    if (this.indexSignatures.size > 0 || this.members.size > 0)
      indent += 1;

    for (const [key, value] of this.indexSignatures) {
      result += "\n";
      result += "  ".repeat(indent);
      result += `[${key.toString()}]: ${value instanceof InterfaceType ? value.toString(colors, indent + 1) : value.toString()};`;
    }

    for (const [key, value] of this.members) {
      result += "\n";
      result += "  ".repeat(indent);
      result += `${value instanceof InterfaceType ? value.toString(colors, indent + 1) : (value instanceof Type ? value.toString().replace(/\"/g, "") : value.valueType.toString())} ${key};`;
    }

    return result + "\n}";
  }
}