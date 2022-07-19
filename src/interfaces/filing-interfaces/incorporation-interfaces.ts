import { AddressesIF, FilingBusinessIF, FilingHeaderIF, NameTranslationIF, OrgPersonIF, ShareClassIF }
  from '@/interfaces/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/incorporation_application.json
//
export interface IncorporationApplicationIF {
  nameRequest: {
    legalType: CorpTypeCd
    nrNumber?: string // only set when there is an NR
    legalName?: string // only set when there is an NR
  }
  nameTranslations: NameTranslationIF[]
  offices: AddressesIF | {}
  contactPoint: {
    email: string
    phone: string
    extension?: number
  }
  parties: OrgPersonIF[]
  shareStructure: {
    shareClasses: ShareClassIF[]
  }
  shareClasses?: ShareClassIF[] // old schema; only use for loading old filings!
}

/** Incorporation Application filing loaded from / saved to the Legal API. */
export interface IncorporationFilingIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  incorporationApplication: IncorporationApplicationIF
}
