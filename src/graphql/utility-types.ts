interface Entity {
  id: string;
}

/*
 *
 *
 *
 *
 */
export type WithReferences<T> = {
  [K in keyof T]: T[K] extends Entity
    ? string | WithReferences<T[K]>
    : T[K] extends Array<infer U>
    ? Array<WithReferences<U>>
    : T[K] extends Date
    ? Date
    : WithReferences<T[K]>;
};
