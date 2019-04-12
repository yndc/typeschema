/**
 * typeschema.ts
 * Entry for the typeschema library
 * 
 * Author   : Jonathan Steven (yondercode@gmail.com)
 * License  : MIT
 */

import { Ajv, ErrorObject, ValidateFunction as AjvValidateFunction } from 'ajv'
import { JSONSchema7 } from 'json-schema'

/**
 * Wrapper over validation function for specific type
 */
export interface ValidateFunction<T> extends AjvValidateFunction {
  _t?: T
}

/**
 * Validation error handler
 */
export type ValidationErrorHandler = (errors: ErrorObject[]) => void

/**
 * Make a validation function from the given schema
 * @param schema 
 * @param ajvInstance 
 */
export function makeValidator<T>(schema: JSONSchema7, ajvInstance: Ajv): ValidateFunction<T> {
  let validator = ajvInstance.getSchema(schema.$id)
  if (validator === undefined) {
    validator = ajvInstance.compile(schema)
  }
  return validator
}

/**
 * Asserts the given value as with the provided validation function
 * @param validator 
 * @param candidate 
 */
export function assert<T>(validator: ValidateFunction<T>, candidate: any, errorHandler: ValidationErrorHandler = () => {}): candidate is T {
  const assertion = validator(candidate)
  if (validator.errors) errorHandler(validator.errors)
  return assertion === true
}