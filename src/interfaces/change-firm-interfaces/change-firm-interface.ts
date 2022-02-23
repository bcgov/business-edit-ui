import { FilingBusinessIF, FilingHeaderIF } from '@/interfaces'
import { ChangeOfRegistrationIF } from './change-of-registration-interface'

/** Interface for data object UI sends to API. */
export interface ChangeFirmIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  changeOfRegistration: ChangeOfRegistrationIF
}
