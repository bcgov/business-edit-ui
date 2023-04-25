/**
 * See:
 * https://github.com/bcgov/business-schemas/blob/master/src/registry_schemas/schemas/contact_point.json
 */
export interface ContactPointIF {
  email: string
  confirmEmail?: string
  phone: string
  extension?: number
}

export const EmptyContactPoint: ContactPointIF = {
  email: '',
  confirmEmail: '',
  phone: '',
  extension: null
}
