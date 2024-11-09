export interface Notation {
  toInfix: () => string[];
  toPostfix: () => string[];
  toPrefix: () => string[];
  evaluate: () => number;
}

// NotationFactory.ts
// import { Infix } from "./Infix";
// import { Postfix } from "./Postfix";
// import { Prefix } from "./Prefix";
// import { Notation } from "./Notation";

export class NotationFactory {
  static create(
    expression: string | string[],
    type: "infix" | "postfix" | "prefix"
  ): Notation {
    switch (type) {
      case "infix":
      // return new Infix(expression as string);
      case "postfix":
      // return new Postfix(expression as string[]);
      case "prefix":
      // return new Prefix(expression as string[]);
      default:
        throw new Error("Invalid notation type");
    }
  }
}
