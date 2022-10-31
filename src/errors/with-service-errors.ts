import { ServiceError } from './errors';

export function withServiceErrors<T>(service, serviceName): T {
  return new Proxy(service, {
    get: (target, prop) => {
      const method = target[prop];
      if (typeof method !== 'function') return method;

      return async (...args) => {
        try {
          return await method.apply(target, args);
        } catch (err) {
          throw new ServiceError({
            message: err.message,
            method: prop as string,
            service: serviceName,
          });
        }
      };
    },
  });
}
