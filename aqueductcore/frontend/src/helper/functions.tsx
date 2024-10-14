import { DependencyList, FocusEvent, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";

import { ExperimentFileType } from "types/globalTypes";
import { SortOrder } from "types/componentTypes";

// ################## DOM related functions ################## //
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

// Function from https://stackoverflow.com/a/53180013/10597542
export function useDidUpdateEffect(fn: () => void, inputs: DependencyList) {
  const isMountingRef = useRef(false);

  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  useEffect(() => {
    if (!isMountingRef.current) {
      return fn();
    } else {
      isMountingRef.current = false;
    }
  }, inputs);
}

// ################## Sort functions ################## //
export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  let itemA = a[orderBy]
  let itemB = b[orderBy]
  // ###  Special cases
  // # 1- Date
  if (dayjs(new Date(String(a[orderBy]))).isValid() && dayjs(new Date(String(b[orderBy]))).isValid()) {
    itemA = new Date(String(a[orderBy])).getTime() as T[keyof T]
    itemB = new Date(String(b[orderBy])).getTime() as T[keyof T]
  }
  // Comparison
  if (itemB < itemA) {
    return -1;
  }
  if (itemB > itemA) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof ExperimentFileType>(
  order: SortOrder,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

// ################## Copy to Clipboard Functions ################## //
export function copyToClipboardWithSuccessMessage(message?: string): void | PromiseLike<void> {
  toast.success(message ?? "Copied to clipboard!", {
    id: "clipboard",
  });
}
export function copyToClipboardFailedWithMessage(message?: string): void | PromiseLike<void> {
  toast.error(message ?? "Copy to clipboard Failed!", {
    id: "clipboard-failed",
  });
}
