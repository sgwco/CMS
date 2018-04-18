"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertCamelCaseToSnakeCase = convertCamelCaseToSnakeCase;
function convertCamelCaseToSnakeCase(camelCase) {
  var result = camelCase.replace(/([A-Z])/g, "_$1");
  return result.toLowerCase();
}