import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

/** Interface for filing business object UI sends to API. */
export interface FilingBusinessIF {
  foundingDate?: string // not present in all cases
  legalType: CorpTypeCd
  legalName: string
  identifier: string
  naicsCode?: string
  naicsDescription?: string
}
