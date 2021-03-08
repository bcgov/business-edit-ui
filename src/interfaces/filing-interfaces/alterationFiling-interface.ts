import { AlterationIF, FilingBusinessIF, FilingHeaderIF } from '@/interfaces'

/** Interface for data object UI sends to API. */
export interface AlterationFilingIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  alteration: AlterationIF
}
