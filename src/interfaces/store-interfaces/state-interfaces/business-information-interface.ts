import { AssociationTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

/** Interface for business information object in store. */
export interface BusinessInformationIF {
  associationType?: AssociationTypes // from API
  foundingDate?: string // actually date-time (API format)
  hasRestrictions?: boolean
  identifier: string
  legalName?: string
  legalType: CorpTypeCd
  naicsCode?: string
  naicsDescription?: string
  naicsKey?: string // from API
  nrNumber?: string
  startDate?: string // YYYY-MM-DD
}
