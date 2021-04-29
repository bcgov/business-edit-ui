import { AuthInformationIF, BusinessInformationIF, GetOrgPersonIF, IncorporationAddressIf,
  NameTranslationIF, ShareStructureIF, ResolutionsIF } from '@/interfaces'

/** Business snapshot object. */
export interface BusinessSnapshotIF {
  businessInfo: BusinessInformationIF
  authInfo: AuthInformationIF
  incorporationAddress: IncorporationAddressIf
  nameTranslations: NameTranslationIF[]
  orgPersons: GetOrgPersonIF[]
  shareStructure: ShareStructureIF,
  resolutions: ResolutionsIF[]
}
