import { SpecialResolutionIF, FilingBusinessIF, FilingHeaderIF, AlterationIF } from '@/interfaces/'

/** Interface for data object UI sends to API. */
// this is may change , it may use alteration name change and special resolution together
export interface SpecialResolutionFilingIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  alteration?: AlterationIF
  specialResolution?: SpecialResolutionIF
}
