export function convertCamelCaseToSnakeCase(camelCase) {
  const result = camelCase.replace(/([A-Z])/g, "_$1");
  return result.toLowerCase();
}