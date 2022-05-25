import { FilingBusinessIF, FilingHeaderIF, NameRequestIF, OfficeIF, OrgPersonIF } from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/change_of_registration.json
//
interface ChangeOfRegistrationIF {
  business: {
    natureOfBusiness?: string
    naics?: {
      naicsCode: string
      naicsDescription: string
    }
    identifier: string
  }
  offices?: {
    businessOffice: OfficeIF
  }
  contactPoint: ContactPointIF
  nameRequest?: NameRequestIF
  parties?: Array<OrgPersonIF>
  courtOrder?: string
}

/** Interface for data object UI sends to API. */
export interface ChangeFilingIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  changeOfRegistration: ChangeOfRegistrationIF
}
