import {
  BusinessInformationIF,
  NameRequestIF,
  NameTranslationIF,
  ShareStructureIF
} from '@/interfaces'
import { CourtOrderIF } from '@/interfaces/alteration-interfaces/court-order-interface'

// Shared Interfaces
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

export interface AlterationIF {
  provisionsRemoved: boolean,
  business: BusinessInformationIF,
  nameRequest?: NameRequestIF,
  nameTranslations: NameTranslationIF[],
  shareStructure: ShareStructureIF,
  contactPoint: ContactPointIF,
  courtOrder?: CourtOrderIF
}
