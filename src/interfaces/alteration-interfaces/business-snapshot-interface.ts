import { BusinessInformationIF, GetOrgPersonsIF, IncorporationAddressIf, NameTranslationIF,
  ShareStructureIF } from '@/interfaces'
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

/** Business snapshot object. */
export interface BusinessSnapshotIF {
  businessInfo: BusinessInformationIF
  contactPoint: ContactPointIF
  incorporationAddress: IncorporationAddressIf
  nameTranslations: NameTranslationIF[]
  orgPersons: GetOrgPersonsIF[]
  shareStructure: ShareStructureIF
}
