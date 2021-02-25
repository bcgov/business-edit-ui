import {
  BusinessInformationIF,
  IncorporationAddressIf,
  NameTranslationIF,
  GetOrgPersonsIF,
  ShareStructureIF
} from '@/interfaces'

// Shared Interfaces
import {
  ContactPointIF
} from '@bcrs-shared-components/interfaces'

export interface BusinessSnapshotIF {
  business: BusinessInformationIF,
  aliases: NameTranslationIF[],
  addresses: IncorporationAddressIf,
  directors: Array<GetOrgPersonsIF>,
  shareClasses: ShareStructureIF,
  ContactPointIF
}
