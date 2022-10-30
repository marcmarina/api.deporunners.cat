import { AuthError, ServiceError } from '../errors/errors';

export abstract class BaseService {
  constructor() {
    return new Proxy(this, {
      get: (target, prop) => {
        const method = target[prop];
        if (typeof method !== 'function') return method;

        return async (...args: any[]) => {
          try {
            return await method.apply(target, args);
          } catch (err) {
            if (err instanceof AuthError || err instanceof ServiceError) {
              throw err;
            }

            throw new ServiceError({
              message: err.message,
              method: prop as string,
              service: target.constructor.name,
            });
          }
        };
      },
    });
  }
}
