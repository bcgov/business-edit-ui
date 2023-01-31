import { RestorationTypes } from '@/enums'
import { AddressesIF, BusinessInformationIF, CourtOrderIF, NameRequestIF, NameTranslationIF, OrgPersonIF }
  from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/restoration.json
//
export interface RestorationIF {
  date: string // today, as YYYY-MM-DD
  type: RestorationTypes
  relationships?: any // *** TPDP: update type
  expiry?: string // YYYY-MM-DD
  approvalType?: any // *** TODO: update type
  business?: BusinessInformationIF
  courtOrder?: CourtOrderIF
  nameRequest?: NameRequestIF
  nameTranslations?: NameTranslationIF[]
  parties: OrgPersonIF[]
  offices: AddressesIF
  contactPoint: ContactPointIF
}
