import { AddressesIF, BusinessInformationIF, FilingHeaderIF, NameRequestIF, OrgPersonIF } from '@/interfaces/'
import { NaicsIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/conversion.json
//
interface ConversionIF {
  business: {
    identifier: string
    naics?: NaicsIF
  }
  courtOrder?: string
  nameRequest?: NameRequestIF
  offices: AddressesIF
  parties: Array<OrgPersonIF>
  startDate?: string // YYYY-MM-DD
}

/** Interface for data object UI sends to API. */
export interface ConversionFilingIF {
  header: FilingHeaderIF
  business: BusinessInformationIF
  conversion: ConversionIF
}
