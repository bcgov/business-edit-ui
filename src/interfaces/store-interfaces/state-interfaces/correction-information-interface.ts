import { AddressesIF, NameTranslationIF, OrgPersonIF, ShareClassIF } from '@/interfaces/'
import { CorrectionErrorTypes, FilingTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { ContactPointIF, NaicsIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/correction.json
//

/**
 * Interface for correction information object in store
 * and sent to/from the API.
 */
export interface CorrectionInformationIF {
  comment: string // max 4096 characters
  correctedFilingId: number
  correctedFilingDate?: string // API format
  correctedFilingType: FilingTypes
  type: CorrectionErrorTypes
  legalType?: CorpTypeCd

  //
  // optional objects with new correction data:
  //
  business?: {
    identifier: string
    naics?: NaicsIF
  }
  contactPoint?: ContactPointIF
  nameRequest?: {
    legalType: CorpTypeCd
    nrNumber?: string // only set when there is an NR
    legalName?: string // only set when there is an NR
  }
  nameTranslations?: NameTranslationIF[]
  offices?: AddressesIF
  parties: OrgPersonIF[]
  shareStructure?: {
    shareClasses: ShareClassIF[]
    resolutionDates?: string[]
  }
  startDate?: string // YYYY-MM-DD (firms only)
  provisionsRemoved?: boolean
}
