import { AddressesIF, CourtOrderIF, BusinessInformationIF, FilingHeaderIF, OrgPersonIF } from '@/interfaces/'
import { ContactPointIF, NaicsIF, NameRequestIF } from '@bcrs-shared-components/interfaces/'

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
  // intersection type so we can save original NR + properties needed by Legal API:
  nameRequest?: NameRequestIF & { legalName: string, nrNumber?: string }
  offices?: AddressesIF
  parties: Array<OrgPersonIF>
  startDate?: string // YYYY-MM-DD
}

/** Interface for data object UI sends to API. */
export interface ChgRegistrationFilingIF {
  header: FilingHeaderIF
  business: BusinessInformationIF
  changeOfRegistration: ChgRegistrationIF
}
