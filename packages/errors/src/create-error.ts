export function createValidationError(
  errorMessage: string,
  path: string[],
): Record<string, unknown> {
  return path.reduceRight((prev, cur) => {
    return { [cur]: prev };
  }, errorMessage as unknown as Record<string, unknown>);
}
