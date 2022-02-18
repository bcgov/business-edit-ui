import { FilingBusinessIF, FilingHeaderIF } from '@/interfaces'

/** Interface for data object UI sends to API. */
export interface ChangeFirmIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  changeFirm: any
}
