import { FilingHeaderIF, AlterationIF, BusinessInformationIF, NameRequestIF } from '@/interfaces/'
import { SpecialResolutionIF } from '@bcrs-shared-components/interfaces'

// Override what's in BCRS Shared Components, no easy way to have them work together unfortunately.
export interface ChangeOfNameIF {
  nameRequest: NameRequestIF
}

/** Interface for data object UI sends to API. */
// this is may change , it may use alteration name change and special resolution together
export interface SpecialResolutionFilingIF {
  header: FilingHeaderIF
  business: BusinessInformationIF
  changeOfName?: ChangeOfNameIF
  alteration?: AlterationIF
  specialResolution?: SpecialResolutionIF
}
