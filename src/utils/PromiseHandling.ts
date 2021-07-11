export type PromiseHandlingResult<T = any> =
  | {
      result: T;
      error: null;
    }
  | {
      result: null;
      error: Error;
    };

export async function promiseHandling<T>(
  promise: Promise<T>
): Promise<PromiseHandlingResult<T>> {
  try {
    const result = await promise;

    return {
      result,
      error: null,
    };
  } catch (error) {
    return {
      result: null,
      error,
    };
  }
}
