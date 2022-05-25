import { BusinessInformationIF, CourtOrderIF, NameRequestIF, NameTranslationIF, ShareStructureIF }
  from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/alteration.json
//
export interface AlterationIF {
  provisionsRemoved?: boolean,
  business?: BusinessInformationIF,
  nameRequest?: NameRequestIF,
  nameTranslations?: NameTranslationIF[],
  shareStructure?: ShareStructureIF,
  contactPoint?: ContactPointIF,
  courtOrder?: CourtOrderIF
}
