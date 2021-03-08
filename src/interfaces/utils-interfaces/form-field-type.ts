import { FormType } from './form-type'

export interface FormFieldType extends FormType {
  valid: boolean
  hasError: boolean
}
