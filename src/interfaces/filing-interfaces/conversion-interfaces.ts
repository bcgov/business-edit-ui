import { AddressesIF, BusinessInformationIF, FilingHeaderIF, OrgPersonIF } from '@/interfaces/'
import { NaicsIF, NameRequestIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/conversion.json
//
interface ConversionIF {
  business: {
    identifier: string
    naics?: NaicsIF
  }
  courtOrder?: string
  // intersection type so we can save original NR + properties needed by Legal API:
  nameRequest?: NameRequestIF & { legalName: string, nrNumber?: string }
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
