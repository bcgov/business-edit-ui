import {
  BusinessContactIF,
  BusinessInformationIF, NameRequestApplicantIF,
  NameRequestIF,
  NameTranslationIF,
  ShareStructureIF
} from '@/interfaces'

export interface AlterationIF {
  provisionsRemoved: boolean,
  business: BusinessInformationIF,
  nameRequest: NameRequestIF,
  nameTranslations: NameTranslationIF[],
  shareStructure: ShareStructureIF,
  contactPoint: BusinessContactIF
}
