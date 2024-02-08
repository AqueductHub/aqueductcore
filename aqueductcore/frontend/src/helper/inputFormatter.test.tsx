import { removeWhiteSpace } from "./inputFormatter";

test("removeWhiteSpace function to remove white space", () => {
  const text = "test  ";
  const newText = "test";
  const formattedText = removeWhiteSpace(text);
  expect(formattedText).toEqual(newText);
});
test("removeWhiteSpace function to do nothing on numbers", () => {
  const number = 100;
  const formattedNumber = removeWhiteSpace(number);
  expect(formattedNumber).toEqual(number);
});
