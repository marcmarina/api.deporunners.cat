import _ from 'lodash';

export function uniqueArray<T>(array: T[]): T[] {
  return _.uniqWith(array, _.isEqual);
}
