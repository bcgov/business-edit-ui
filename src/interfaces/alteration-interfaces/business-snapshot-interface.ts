import { AddressesIF, AuthInformationIF, BusinessDocumentsIF, BusinessInformationIF, NameTranslationIF, OrgPersonIF,
  ResolutionsIF, ShareStructureIF } from '@/interfaces/'

/** Entity snapshot object. */
export interface EntitySnapshotIF {
  businessInfo: BusinessInformationIF
  authInfo: AuthInformationIF
  orgPersons: OrgPersonIF[]
  addresses: AddressesIF
  resolutions?: ResolutionsIF[]

  // Properties exclusive to Companies
  nameTranslations?: NameTranslationIF[]
  shareStructure?: ShareStructureIF
  businessDocuments?: BusinessDocumentsIF
}
