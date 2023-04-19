import { Result, ValidationError } from 'express-validator';

export class BaseError extends Error {
  public status: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status ?? 500;
  }
}

export class ServiceError extends BaseError {
  public service: string;
  public method: string;
  public errorMessage: string;

  constructor({
    service,
    method,
    message,
  }: {
    service: string;
    method: string;
    message: string;
  }) {
    super(`ServiceError in ${service} - ${method}. Error: ${message}`);
    this.service = service;
    this.method = method;
    this.errorMessage = message;
  }
}

export class InputError extends BaseError {
  public errors: ValidationError[];

  constructor(errors: Result<ValidationError>) {
    super('Validation errors', 400);

    this.errors = errors.array();
  }
}

export class AuthError extends BaseError {
  constructor(message: string) {
    super(message, 401);
  }
}
