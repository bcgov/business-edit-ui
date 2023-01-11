import { AddressesIF, CourtOrderIF, BusinessInformationIF, FilingHeaderIF, NameRequestIF, OrgPersonIF }
  from '@/interfaces/'
import { ContactPointIF, NaicsIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/change_of_registration.json
//
export interface ChgRegistrationIF {
  business: {
    identifier: string
    naics?: NaicsIF
  }
  courtOrder?: CourtOrderIF
  contactPoint: ContactPointIF
  nameRequest?: NameRequestIF
  offices?: AddressesIF
  parties?: Array<OrgPersonIF>
  startDate?: string // YYYY-MM-DD
}

/** Interface for data object UI sends to API. */
export interface ChgRegistrationFilingIF {
  header: FilingHeaderIF
  business: BusinessInformationIF
  changeOfRegistration: ChgRegistrationIF
}
