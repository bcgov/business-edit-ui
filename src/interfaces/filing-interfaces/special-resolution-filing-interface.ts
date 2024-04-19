import { FilingHeaderIF, AlterationIF, BusinessInformationIF } from '@/interfaces/'
import { NameRequestIF, SpecialResolutionIF } from '@bcrs-shared-components/interfaces'

/** Override what's in BCRS Shared Components, needs to be refactored in the future. */
export interface ChangeOfNameIF {
  // intersection type so we can save original NR + properties needed by Legal API:
  nameRequest?: NameRequestIF & { legalName: string, nrNumber?: string }
  legalName: string
}

/** Interface for data object UI sends to API. */
export interface SpecialResolutionFilingIF {
  header: FilingHeaderIF
  business: BusinessInformationIF
  changeOfName?: ChangeOfNameIF
  alteration?: AlterationIF
  specialResolution?: SpecialResolutionIF
}
