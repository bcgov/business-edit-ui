import { BusinessInformationIF, GetOrgPersonIF, IncorporationAddressIf,
  NameTranslationIF, ShareStructureIF, ResolutionsIF } from '@/interfaces'
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

/** Business snapshot object. */
export interface BusinessSnapshotIF {
  businessInfo: BusinessInformationIF
  contactPoint: ContactPointIF
  incorporationAddress: IncorporationAddressIf
  nameTranslations: NameTranslationIF[]
  orgPersons: GetOrgPersonIF[]
  shareStructure: ShareStructureIF,
  resolutions: ResolutionsIF[]
}
