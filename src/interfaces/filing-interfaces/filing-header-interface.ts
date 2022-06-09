/** Interface for filing header object UI sends to API. */
export interface FilingHeaderIF {
  name: string
  certifiedBy: string
  date: string
  folioNumber?: string
  filingId?: number
  status?: string
  isTransactionalFolioNumber?: boolean

  // future effective properties:
  effectiveDate?: string
  isFutureEffective?: boolean

  // document delivery optional email property:
  documentOptionalEmail?: string

  // staff payment properties:
  routingSlipNumber?: string
  bcolAccountNumber?: string
  datNumber?: string
  waiveFees?: boolean
  priority?: boolean
}
