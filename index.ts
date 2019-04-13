/**
 * typeschema.ts
 * Entry for the typeschema library
 * 
 * Author   : Jonathan Steven (yondercode@gmail.com)
 * License  : MIT
 */

import { Ajv, ErrorObject } from 'ajv'
import { JSONSchema7 } from 'json-schema'

/**
 * Validator for a schema
 */
export interface Validator<T> {
  (candidate: any): candidate is T
  errors: ErrorObject[]
}

/**
 * Validation error handler
 */
export interface ValidationErrorHandler { 
  (errors: ErrorObject[]): void 
}

/**
 * Make a validation function from the given schema
 * @param schema 
 * @param ajvInstance 
 */
export function makeValidator<T>(ajvInstance: Ajv, schema: JSONSchema7): Validator<T> {
  let validator = ajvInstance.getSchema(schema.$id)
  if (validator === undefined) validator = ajvInstance.compile(schema)
  function result (candidate: any): candidate is T {
    const assertion = validator(candidate)
    if (assertion === false) (result as Validator<T>).errors = validator.errors
    return assertion === true
  }
  return result as Validator<T>
}