import { FilingHeaderIF, AlterationIF, BusinessInformationIF, NameRequestIF } from '@/interfaces/'
import { SpecialResolutionIF } from '@/bcrs-shared-components/interfaces'

/** Override what's in BCRS Shared Components, needs to be refactored in the future. */
export interface ChangeOfNameIF {
  nameRequest: NameRequestIF
}

/** Interface for data object UI sends to API. */
export interface SpecialResolutionFilingIF {
  header: FilingHeaderIF
  business: BusinessInformationIF
  changeOfName?: ChangeOfNameIF
  alteration?: AlterationIF
  specialResolution?: SpecialResolutionIF
}
