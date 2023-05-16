import { AddressesIF, AuthInformationIF, BusinessInformationIF, NameTranslationIF, OrgPersonIF,
  ResolutionsIF, ShareStructureIF } from '@/interfaces/'
import { BusinessDocumentsIF } from '../business-document-interface'

/** Entity snapshot object. */
export interface EntitySnapshotIF {
  businessInfo: BusinessInformationIF
  authInfo: AuthInformationIF
  orgPersons: OrgPersonIF[]
  addresses: AddressesIF

  // Properties exclusive to Companies
  nameTranslations?: NameTranslationIF[]
  shareStructure?: ShareStructureIF
  resolutions?: ResolutionsIF[]
  businessDocuments?: BusinessDocumentsIF
}
