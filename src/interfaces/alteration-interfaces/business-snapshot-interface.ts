import {
  BusinessContactIF,
  BusinessInformationIF,
  IncorporationAddressIf,
  NameTranslationSnapshotIF,
  OrgPersonIF,
  ShareStructureIF
} from '@/interfaces'

export interface BusinessSnapshotIF {
  business: BusinessInformationIF,
  aliases: Array<NameTranslationSnapshotIF>,
  IncorporationAddressIf,
  directors: OrgPersonIF,
  shareClasses: ShareStructureIF,
  BusinessContactIF
}
