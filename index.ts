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
 * Validator for a schema
 */
export type Validator<T> = (candidate: any, errorHandler?: ValidationErrorHandler) => candidate is T

/**
 * Validation error handler
 */
export type ValidationErrorHandler = (errors: ErrorObject[]) => void

/**
 * Make a validation function from the given schema
 * @param schema 
 * @param ajvInstance 
 */
export function makeValidator<T>(ajvInstance: Ajv, schema: JSONSchema7): Validator<T> {
  let validator = ajvInstance.getSchema(schema.$id)
  if (validator === undefined) validator = ajvInstance.compile(schema)
  return (candidate: any, errorHandler: ValidationErrorHandler = () => {}): candidate is T => {
    const assertion = validator(candidate)
    if (validator.errors) errorHandler(validator.errors)
    return assertion === true
  }
}