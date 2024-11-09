export const PAREN = {
  LEFT: "(",
  RIGHT: ")",
};

export type PAREN = (typeof PAREN)[keyof typeof PAREN];
