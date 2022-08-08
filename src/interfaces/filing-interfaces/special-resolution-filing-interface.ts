import { FilingHeaderIF, AlterationIF, BusinessInformationIF, CreateResolutionIF } from '@/interfaces/'

/** Interface for data object UI sends to API. */
// this is may change , it may use alteration name change and special resolution together
export interface SpecialResolutionFilingIF {
  header: FilingHeaderIF
  business: BusinessInformationIF
  alteration?: AlterationIF
  specialResolution?: CreateResolutionIF
}
