import {
  BusinessContactIF,
  BusinessInformationIF,
  IncorporationAddressIf,
  NameTranslationSnapshotIF,
  getOrgPersonsIF,
  ShareStructureIF
} from '@/interfaces'

export interface BusinessSnapshotIF {
  business: BusinessInformationIF,
  aliases: Array<NameTranslationSnapshotIF>,
  offices: IncorporationAddressIf,
  directors: Array<getOrgPersonsIF>,
  shareClasses: ShareStructureIF,
  contacts: BusinessContactIF
}
