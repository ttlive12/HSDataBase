export const to = <T, U = Error>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U, undefined] | [null, T]> => {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }
      return [err, undefined];
    });
};

export function throttle<T extends (...args: any[]) => void>(
  func: T, 
  wait: number
): T {
  let lastTime = 0;

  return function (this: any, ...args: any[]) {
    const now = Date.now();

    // 如果距离上次执行时间超过了指定的间隔时间
    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  } as T;
}
