/** Data object used internally only (not to/from API). */
export interface BusinessInformationIF {
  legalType: string
  identifier: string
  legalName?: string
  foundingDateTime?: string
  hasRestrictions?: boolean
}
