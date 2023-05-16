import { CourtOrderIF, NameRequestIF, NameTranslationIF, ShareStructureIF }
  from '@/interfaces/'
import { CoopTypes } from '@/enums'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'
import { CorpTypeCd } from '@bcrs-shared-components/enums'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/alteration.json
//
export interface AlterationIF {
  provisionsRemoved?: boolean
  business: {
    identifier: string
    legalType: CorpTypeCd
  }
  /** This is different from bcrs-shared-components/interfaces/name-request-interface.ts
   * and should be refactored in the future. */
  nameRequest?: NameRequestIF
  nameTranslations?: NameTranslationIF[]
  shareStructure?: ShareStructureIF
  contactPoint: ContactPointIF
  courtOrder?: CourtOrderIF
  cooperativeAssociationType?: CoopTypes
  rulesInResolution?: boolean
  rulesFileKey?: string
  rulesFileName?: string
  memorandumInResolution?: boolean
  memorandumFileKey?: string
  memorandumFileName?: string
}
