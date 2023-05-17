export type Maybe<T> = T | null;

/**
 * Returns a type with all properties of T set to nullable.
 */
export type Nullable<T> = { [K in keyof T]: Maybe<T[K]> };

/**
 * Returns a type with the same properties as T but the selected K properties are made nullable.
 */
export type MakeNullable<T, K extends keyof T> = Omit<T, K> &
  Nullable<Pick<T, K>>;
