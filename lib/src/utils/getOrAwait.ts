import { isFunction } from "./isFunction";

export async function getOrAwait<T>(x: T | (() => T) | (() => Promise<T>)) {
  return isFunction(x) ? x() : x;
}
