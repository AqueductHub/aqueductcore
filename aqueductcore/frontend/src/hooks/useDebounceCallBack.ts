import { useEffect, useState } from "react";

function useDebouncedCallback<T>(debounceCallBack: (item: T) => void, delay: number) {
  const [debounce, debounced] = useState<T>();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (debounce) {
        debounceCallBack(debounce);
      }
    }, delay);
    return () => {
      clearInterval(timer);
    };
  }, [debounce]);

  return debounced;
}

export default useDebouncedCallback;
