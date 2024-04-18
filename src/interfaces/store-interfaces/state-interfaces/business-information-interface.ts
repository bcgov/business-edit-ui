import { CoopTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { AlternateNameIF, ApiDateTimeUtc, IsoDatePacific } from '@bcrs-shared-components/interfaces'

/**
 * Interface for business information object in store
 * and sent to/from the API.
 * Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/business.json
 */
export interface BusinessInformationIF {
  alternateNames?: Array<AlternateNameIF>
  foundingDate: string // actually date-time (API format)
  hasRestrictions?: boolean
  identifier: string
  legalName: string
  legalType: CorpTypeCd
  nrNumber?: string
  startDate?: string // YYYY-MM-DD
  stateFiling?: string
  taxId?: string // may br BN9 or BN15

  // CP only:
  associationType?: CoopTypes // from API (Coop)

  // SP/GP only:
  naicsCode?: string
  naicsDescription?: string
  naicsKey?: string // from API
}

export const EmptyBusinessInfo: BusinessInformationIF = {
  associationType: null,
  foundingDate: null,
  identifier: '',
  legalName: null,
  legalType: null
}
