import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

/** Data object used internally only (not to/from API). */
export interface BusinessInformationIF {
  legalType: CorpTypeCd
  identifier: string
  legalName?: string
  foundingDate?: string // actually date-time
  hasRestrictions?: boolean
  naicsCode?: string
  naicsDescription?: string
}
