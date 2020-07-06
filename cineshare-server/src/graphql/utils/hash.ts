export const toCursorHash = (val: string) =>
  Buffer.from(val).toString("base64");
export const fromCursorHash = (val: string) =>
  Buffer.from(val, "base64").toString("ascii");
