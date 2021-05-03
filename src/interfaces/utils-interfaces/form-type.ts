// Reference to vuetify form api: https://vuetifyjs.com/en/api/v-form/#functions
export interface FormType extends HTMLFormElement {
  reset(): void
  validate(): boolean
  resetValidation(): void
}
// To keep compatibility with the shared components that use FormIF and not FormType
export interface FormIF extends FormType {}
