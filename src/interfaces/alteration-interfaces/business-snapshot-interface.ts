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
  nameTranslations?: NameTranslationIF[]
  shareStructure?: ShareStructureIF,
  resolutions?: ResolutionsIF[]
}
