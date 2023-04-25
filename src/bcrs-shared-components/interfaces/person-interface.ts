/**
 * A person object from the API. See:
 * https://github.com/bcgov/business-schemas/blob/master/src/registry_schemas/schemas/person.json
 */

export interface PersonIF {
  givenName?: string
  familyName?: string
  additionalName?: string
  middleInitial?: string
  email?: string
}
