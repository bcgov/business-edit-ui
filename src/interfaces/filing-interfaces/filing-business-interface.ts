import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

/** Interface for filing business object UI sends to API. */
export interface FilingBusinessIF {
  foundingDate?: string // not present in all cases
  identifier: string
  legalName: string
  legalType: CorpTypeCd
  naicsCode?: string
  naicsDescription?: string
  nrNumber?: string
}
