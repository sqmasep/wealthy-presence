export type AnyFunction<T> = (() => T) | (() => Promise<T>);

export type MaybeAnyFunction<T> = T | AnyFunction<T>;

export type Except<TObj, TKey extends keyof TObj> = Omit<TObj, TKey>;
