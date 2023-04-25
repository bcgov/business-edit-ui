import { AssociationTypes } from '@/bcrs-shared-components/enums'
import {
  BusinessIF, NameRequestIF, NameTranslationIF, ShareStructureIF, ContactPointIF, CourtOrderIF
} from './'

/**
 * A filing's alteration object from the API. See:
 * https://github.com/bcgov/business-schemas/blob/master/src/registry_schemas/schemas/alteration.json
 */

export interface AlterationIF {
  provisionsRemoved: boolean
  business: BusinessIF
  nameRequest?: NameRequestIF
  nameTranslations: NameTranslationIF[]
  shareStructure: ShareStructureIF
  contactPoint: ContactPointIF
  courtOrder: CourtOrderIF
  cooperativeAssociationType?: AssociationTypes
  rulesFileKey?: string
  rulesFileName?: string
  memorandumFileKey?: string
  memorandumFileName?: string
}
