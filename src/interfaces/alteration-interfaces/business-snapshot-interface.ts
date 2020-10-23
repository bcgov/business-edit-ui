import {
  BusinessContactIF,
  BusinessInformationIF,
  IncorporationAddressIf,
  NameTranslationSnapshotIF,
  GetOrgPersonsIF,
  ShareStructureIF
} from '@/interfaces'

export interface BusinessSnapshotIF {
  business: BusinessInformationIF,
  aliases: Array<NameTranslationSnapshotIF>,
  offices: IncorporationAddressIf,
  directors: Array<GetOrgPersonsIF>,
  shareClasses: ShareStructureIF,
  contacts: BusinessContactIF
}
