import { AddressesIF, FilingBusinessIF, FilingHeaderIF, NameRequestIF, OrgPersonIF } from '@/interfaces/'
import { ContactPointIF, NaicsIF } from '@bcrs-shared-components/interfaces/'
import { BusinessTypes } from '@/enums'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/conversion.json
//
export interface RegistrationIF {
  business: {
    identifier: string
    naics?: NaicsIF
    natureOfBusiness?: string
  }
  businessType?: BusinessTypes // SP only
  contactPoint: ContactPointIF
  nameRequest: NameRequestIF
  offices: AddressesIF
  parties: Array<OrgPersonIF>
  courtOrder?: string
  startDate?: string
}

/** Interface for data object UI sends to API. */
export interface RegistrationFilingIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  registration: RegistrationIF
}
