import {
  AuthInformationIF, BusinessInformationIF, GetOrgPersonIF, IncorporationAddressIf,
  NameTranslationIF, ShareStructureIF, ResolutionsIF, BaseAddressObjIF
} from '@/interfaces'

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

/** Business snapshot object. */
export interface FirmSnapshotIF {
  businessInfo: BusinessInformationIF
  authInfo: AuthInformationIF
  businessAddress?: BaseAddressObjIF
  orgPersons: GetOrgPersonIF[]
}
