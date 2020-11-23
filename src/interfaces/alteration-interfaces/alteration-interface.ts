import {
  BusinessContactIF,
  BusinessInformationIF,
  NameRequestIF,
  NameTranslationIF,
  ShareStructureIF
} from '@/interfaces'

export interface AlterationIF {
  provisionsRemoved: boolean,
  business: BusinessInformationIF,
  nameRequest: {
    legalType: string
    nrNumber?: string // only set when there is an NR
    legalName?: string // only set when there is an NR
  }
  nameTranslations: NameTranslationIF[],
  shareStructure: ShareStructureIF,
  contactPoint: BusinessContactIF
}
