import {
  AddressesIF, AuthInformationIF, BusinessInformationIF, GetOrgPersonIF,
  NameTranslationIF, ShareStructureIF, ResolutionsIF
} from '@/interfaces'

/** Entity snapshot object. */
export interface EntitySnapshotIF {
  businessInfo: BusinessInformationIF
  authInfo: AuthInformationIF
  orgPersons: GetOrgPersonIF[]
  addresses: AddressesIF

  // Properties exclusive to Companies
  // incorporationAddress?: AddressesIF
  nameTranslations?: NameTranslationIF[]
  shareStructure?: ShareStructureIF,
  resolutions?: ResolutionsIF[]

  // TODO: Api Response SHOULD NOT include Registered/Records: Will update following Api changes to BaseAddressObjIF
  // Properties exclusive to Firms
  // businessAddress?: AddressesIF
}
