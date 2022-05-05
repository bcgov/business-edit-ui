import { BusinessInformationIF, CourtOrderIF, NameRequestIF, NameTranslationIF, ShareStructureIF }
  from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

export interface AlterationIF {
  provisionsRemoved?: boolean,
  business?: BusinessInformationIF,
  nameRequest?: NameRequestIF,
  nameTranslations?: NameTranslationIF[],
  shareStructure?: ShareStructureIF,
  contactPoint?: ContactPointIF,
  courtOrder?: CourtOrderIF
}
