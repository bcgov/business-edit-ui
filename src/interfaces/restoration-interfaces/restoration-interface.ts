import { RestorationTypes } from '@/enums'
import { AddressesIF, BusinessInformationIF, CourtOrderIF, NameRequestIF, NameTranslationIF, OrgPersonIF }
  from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/restoration.json
//
export interface RestorationIF {
  type: RestorationTypes
  relationships?: any // FUTURE: update type (ticket 15092)
  expiry?: string // YYYY-MM-DD
  approvalType?: any // FUTURE: update type (ticket 15084)
  business?: BusinessInformationIF
  courtOrder?: CourtOrderIF
  nameRequest?: NameRequestIF
  nameTranslations?: NameTranslationIF[]
  parties: OrgPersonIF[]
  offices: AddressesIF
  contactPoint: ContactPointIF
}
