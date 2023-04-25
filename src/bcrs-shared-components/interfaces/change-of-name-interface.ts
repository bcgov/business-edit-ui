/**
 * A filing's business object from the API. See:
 * https://github.com/bcgov/business-schemas/blob/master/src/registry_schemas/schemas/change_of_name.json
 * This requires either nameRequest or legalName:
*   "anyOf": [
        {"required": ["legalName"]},
        {"required": ["nameRequest"]}
    ]
 */

import { NameRequestIF } from './name-request-interface'

export interface ChangeOfNameNameRequestIF {
    nameRequest: NameRequestIF
}

export interface ChangeOfNameLegalNameIF {
    legalName: string
}

export type ChangeOfNameIF = ChangeOfNameLegalNameIF | ChangeOfNameNameRequestIF
