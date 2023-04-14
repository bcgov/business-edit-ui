import { BusinessInformationIF, FilingHeaderIF, RestorationIF } from '@/interfaces/'

/** Interface for data object UI sends to API. */
export interface RestorationFilingIF {
  header: FilingHeaderIF
  business: BusinessInformationIF
  restoration: RestorationIF
}
