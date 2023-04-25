import { FormIF } from './form-interface'

export interface FormFieldType extends FormIF {
  valid: boolean
  hasError: boolean
}
