import { FilingStatus } from '@/enums'

/** Interface for filing header object UI sends to API. */
export interface FilingHeaderIF {
  name: string
  certifiedBy: string
  date: string
  folioNumber?: string // also used for staff BCOL payments
  isTransactionalFolioNumber?: boolean
  documentOptionalEmail?: string
  status?: FilingStatus

  // future effective properties:
  effectiveDate?: string
  isFutureEffective?: boolean

  // staff payment properties:
  routingSlipNumber?: string
  bcolAccountNumber?: string
  datNumber?: string
  waiveFees?: boolean
  priority?: boolean
}
