import {
  BusinessContactIF,
  BusinessInformationIF,
  IncorporationAddressIf,
  NameTranslationSnapshotIF,
  OrgPersonIF,
  ShareStructureIF
} from '@/interfaces'

export interface BusinessSnapshotIF {
  businessData: {
    business: BusinessInformationIF
  },
  businessAliases: {
    aliases: Array<NameTranslationSnapshotIF>
  },
  businessAddresses: IncorporationAddressIf,
  contactInfo: BusinessContactIF,
  businessDirectors: {
    directors: OrgPersonIF
  },
  businessShareStructure: ShareStructureIF
}
