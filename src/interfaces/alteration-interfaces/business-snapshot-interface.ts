import {
  AuthInformationIF, BusinessInformationIF, GetOrgPersonIF, IncorporationAddressIf,
  NameTranslationIF, ShareStructureIF, ResolutionsIF, BaseAddressObjIF
} from '@/interfaces'

/** Entity snapshot object. */
export interface EntitySnapshotIF {
  businessInfo: BusinessInformationIF
  authInfo: AuthInformationIF
  orgPersons: GetOrgPersonIF[]

  // Properties exclusive to Companies
  incorporationAddress?: IncorporationAddressIf
  nameTranslations?: NameTranslationIF[]
  shareStructure?: ShareStructureIF,
  resolutions?: ResolutionsIF[]

  // TODO: Api Response SHOULD NOT include Registered/Records: Will update following Api changes to BaseAddressObjIF
  // Properties exclusive to Firms
  businessAddress?: IncorporationAddressIf
}
