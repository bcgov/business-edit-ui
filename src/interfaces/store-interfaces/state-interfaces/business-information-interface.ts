import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

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
