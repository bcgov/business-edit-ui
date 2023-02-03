import { CoopTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

/** Interface for business information object in store. */
export interface BusinessInformationIF {
  associationType?: CoopTypes // from API
  foundingDate?: string // actually date-time (API format)
  hasRestrictions?: boolean
  identifier: string
  legalName?: string
  legalType: CorpTypeCd
  nrNumber?: string
  startDate?: string // YYYY-MM-DD
  stateFiling?: string
  taxId?: string // may br BN9 or BN15

  // SP/GP only:
  naicsCode?: string
  naicsDescription?: string
  naicsKey?: string // from API
}
