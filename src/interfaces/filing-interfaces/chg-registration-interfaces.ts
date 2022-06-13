import { AddressesIF, FilingBusinessIF, FilingHeaderIF, NameRequestIF, OrgPersonIF } from '@/interfaces/'
import { ContactPointIF, NaicsIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/change_of_registration.json
//
export interface ChgRegistrationIF {
  business: {
    identifier: string
    naics?: NaicsIF
    natureOfBusiness?: string
  }
  offices?: AddressesIF
  contactPoint: ContactPointIF
  nameRequest?: NameRequestIF
  parties?: Array<OrgPersonIF>
  courtOrder?: string
}

/** Interface for data object UI sends to API. */
export interface ChgRegistrationFilingIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  changeOfRegistration: ChgRegistrationIF
}
