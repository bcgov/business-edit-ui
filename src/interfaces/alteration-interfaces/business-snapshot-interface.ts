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
  aliases: NameTranslationIF[],
  IncorporationAddressIf,
  directors: Array<GetOrgPersonsIF>,
  shareClasses: ShareStructureIF,
  BusinessContactIF: BusinessContactIF
}
