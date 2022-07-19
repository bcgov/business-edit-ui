import { AddressesIF, FilingBusinessIF, FilingHeaderIF, NameRequestIF, OrgPersonIF, ShareStructureIF }
  from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/conversion.json
//
interface ConversionIF {
  business: {
    natureOfBusiness?: string
    naics?: {
      naicsCode: string
      naicsDescription: string
    }
    identifier: string
  }
  startDate?: string
  nameRequest?: NameRequestIF
  offices: AddressesIF
  parties: Array<OrgPersonIF>
  shareStructure?: ShareStructureIF
  contactPoint: ContactPointIF
  courtOrder?: string
}

/** Interface for data object UI sends to API. */
export interface ConversionFilingIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  conversion: ConversionIF
}
