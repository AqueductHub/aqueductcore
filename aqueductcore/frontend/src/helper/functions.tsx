import { FocusEvent } from "react";

export const focusInCurrentTarget = ({
  relatedTarget,
  currentTarget,
}: FocusEvent<HTMLDivElement, Element>) => {
  if (relatedTarget === null) return false;

  let node = relatedTarget.parentNode;

  while (node !== null) {
    if (node === currentTarget) return true;
    node = node.parentNode;
  }

  return false;
};
