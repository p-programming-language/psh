import { KEYWORDS as P_KEYWORDS, Lexer, Syntax, INTRINSIC_TYPES } from "./plang/src";

enum Class {
  Comment = "psh-com",
  Identifier = "psh-id",
  Keyword = "psh-kw",
  Class = "psh-class",
  Function = "psh-fn",
  String = "psh-str",
  Number = "psh-num",
  Operator = "psh-op",
  Bracket1 = "psh-b1",
  Bracket2 = "psh-b2",
  Bracket3 = "psh-b3"
}

const KEYWORDS = Object.keys(P_KEYWORDS);
const TYPE_KEYWORDS = Array.from(INTRINSIC_TYPES.values());
const OPEN_BRACKETS = ["(", "[", "{"];
const CLOSED_BRACKETS = [")", "]", "}"];
const OPERATORS = [
  "@", "+", "-", "*", "/", "^", "%", ":",
  "<", ">", "=", "!", "?", "&", "|", "#",
  "'", '"', ".", ","
];


const TAB = "&ThickSpace;";

function extractLeadingWhitespaces(input: string): string {
  const match = input.match(/\s+/);
  return match ? match[0] : "";
}

function splitPreservingQuotes(input: string): string[] {
  const parts = input.match(/"([^"]+)"|'([^']+)'\s*|[^'"\s]+/g);
  return parts ?? [];
}

function highlightCodeBody(input: string): string {
  const lines = input.split("\n");
  const indentations = lines.map(line => extractLeadingWhitespaces(line));
  const lineParts = lines.map(line => splitPreservingQuotes(line));
  const htmlLines = lineParts.map(parts => parts.map(part => indentations[parts.indexOf(part)] + highlightText(part)).join(" "));
  return htmlLines
    .join("\n")
    .replace(/  /g, TAB)
    .replace(/\t/g, TAB);
}

function highlightText(line: string): string {
  const lexer = new Lexer(line);
  const tokens = lexer.tokenize();
  const html: string[] = [];
  let bracketDepth = 0;

  const getBracketClass = () => <Class>Class[<keyof typeof Class>("Bracket" + (bracketDepth % 3 + 1))] ?? Class.Bracket1;
  const createSpan = (_class: Class, body: string) => `<span class=${_class}>${body}</span>`;
  const addSpan = (_class: Class, body: string) =>
    html.push(createSpan(_class, body));

  for (const token of tokens) {
    if (OPERATORS.includes(token.lexeme))
      addSpan(Class.Operator, token.lexeme);
    else if (KEYWORDS.includes(token.lexeme) || TYPE_KEYWORDS.includes(token.lexeme))
      addSpan(Class.Keyword, token.lexeme);
    else if (token.syntax === Syntax.Identifier)
      if (token.lexeme.toLowerCase() !== token.lexeme)
        addSpan(Class.Class, token.lexeme);
      else
        addSpan(Class.Identifier, token.lexeme);
    else if (token.syntax === Syntax.String) {
      const delimiter = token.lexeme.slice(1);
      addSpan(Class.String, createSpan(Class.Operator, delimiter) + token.value + createSpan(Class.Operator, delimiter));
    } else if (token.syntax === Syntax.Int || token.syntax === Syntax.Float)
      addSpan(Class.Number, token.lexeme);
    else if (OPEN_BRACKETS.includes(token.lexeme)) {
      addSpan(getBracketClass(), token.lexeme);
      bracketDepth++;
    } else if (CLOSED_BRACKETS.includes(token.lexeme)) {
      bracketDepth--;
      addSpan(getBracketClass(), token.lexeme);
    }
  }

  return html.join("");
}

console.log(highlightCodeBody("int x = 1"));