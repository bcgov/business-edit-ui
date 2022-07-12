import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

/** Interface for business information object in store. */
export interface BusinessInformationIF {
  legalType: CorpTypeCd
  identifier: string
  legalName?: string
  foundingDate?: string // actually date-time
  hasRestrictions?: boolean
  naicsCode?: string
  naicsDescription?: string
  naicsKey?: string // from API
  incorporationAgreementType?: string // BENs only
}
