import { BusinessInformationIF, CourtOrderIF, NameRequestIF, NameTranslationIF, ShareStructureIF }
  from '@/interfaces/'
import { CoopTypes } from '@/enums'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/restoration.json
//
export interface RestorationIF {
  provisionsRemoved?: boolean
  business?: BusinessInformationIF
  /** This is different from bcrs-shared-components/interfaces/name-request-interface.ts
   * and should be refactored in the future. */
  nameRequest?: NameRequestIF
  nameTranslations?: NameTranslationIF[]
  shareStructure?: ShareStructureIF
  contactPoint?: ContactPointIF
  courtOrder?: CourtOrderIF
  cooperativeAssociationType?: CoopTypes
  rulesFileKey?: string
  rulesFileName?: string
  memorandumFileKey?: string
  memorandumFileName?: string
}
