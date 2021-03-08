import Vue from 'vue'

export interface FormType extends HTMLFormElement {
  reset(): void
  validate(): boolean
}
