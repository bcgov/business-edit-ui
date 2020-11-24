import {
  BusinessContactIF,
  BusinessInformationIF,
  IncorporationAddressIf,
  NameTranslationIF,
  GetOrgPersonsIF,
  ShareStructureIF
} from '@/interfaces'

export interface BusinessSnapshotIF {
  business: BusinessInformationIF,
  aliases: Array<NameTranslationIF>,
  offices: IncorporationAddressIf,
  directors: Array<GetOrgPersonsIF>,
  shareClasses: ShareStructureIF,
  contacts: BusinessContactIF
}
