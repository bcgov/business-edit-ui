import { StaffPaymentOptions } from '@/bcrs-shared-components/enums'

/** A filing's business object from the API. */
export interface StaffPaymentIF {
  option: StaffPaymentOptions
  routingSlipNumber: string
  bcolAccountNumber: string
  datNumber: string
  folioNumber: string
  isPriority: boolean
}
