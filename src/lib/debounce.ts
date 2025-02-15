let timeoutId: NodeJS.Timeout;
export const debounce = (fn: Function, delay: number) => {
  return function (...args: any) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};