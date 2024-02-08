export function removeWhiteSpace(text: string | number) {
  if (typeof text === "string") return text.trim();
  else return text;
}
