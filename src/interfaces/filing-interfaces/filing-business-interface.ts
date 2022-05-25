/** Interface for filing business object UI sends to API. */
export interface FilingBusinessIF {
  foundingDate?: string // not present in all cases
  legalType: string
  legalName: string
  identifier: string
}
