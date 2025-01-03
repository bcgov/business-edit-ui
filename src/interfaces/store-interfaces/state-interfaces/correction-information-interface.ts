import { AddressesIF, CoopAlterationIF, CourtOrderIF, NameTranslationIF, OrgPersonIF, ShareClassIF }
  from '@/interfaces/'
import { CorrectionErrorTypes, FilingTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { ContactPointIF, NaicsIF, NameRequestIF, SpecialResolutionIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/correction.json
//

/**
 * Interface for correction information object in store
 * and sent to/from the API.
 */
export interface CorrectionInformationIF extends CoopAlterationIF, SpecialResolutionIF {
  comment: string // max 4096 characters
  correctedFilingId: number
  correctedFilingDate?: string //filing date is in YYYY-MM-DD format
  correctedFilingType: FilingTypes
  type: CorrectionErrorTypes
  legalType?: CorpTypeCd
  business?: { // optional objects with new correction data
    identifier: string
    naics?: NaicsIF
  }
  contactPoint?: ContactPointIF
  courtOrder?: CourtOrderIF // Required for Special Resolution Corrections.
  // intersection type so we can save original NR + properties needed by Legal API:
  nameRequest?: NameRequestIF & { legalName: string, nrNumber?: string }
  nameTranslations?: NameTranslationIF[]
  offices?: AddressesIF
  parties?: OrgPersonIF[]
  shareStructure?: {
    shareClasses: ShareClassIF[]
    resolutionDates?: string[]
  }
  startDate?: string // YYYY-MM-DD (firms only)
  provisionsRemoved?: boolean
}
