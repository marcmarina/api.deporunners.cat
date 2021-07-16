import { Result, ValidationError } from 'express-validator';

export class BaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ServiceError extends BaseError {
  public service: string;
  public method: string;

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
  }
}

export class InputError extends BaseError {
  public errors: ValidationError[];
  public status: number;

  constructor(errors: Result<ValidationError>) {
    super('Validation errors');
    this.status = 400;

    this.errors = errors.array();
  }
}
