import { ApprovalTypes, RestorationTypes, RelationshipTypes } from '@/enums'
import { AddressesIF, BusinessInformationIF, CourtOrderIF, NameRequestIF, NameTranslationIF, OrgPersonIF }
  from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/restoration.json
//
export interface RestorationIF {
  approvalType?: ApprovalTypes
  business?: BusinessInformationIF
  contactPoint: ContactPointIF
  courtOrder?: CourtOrderIF
  expiry?: string // YYYY-MM-DD
  nameRequest?: NameRequestIF
  nameTranslations?: NameTranslationIF[]
  offices: AddressesIF
  parties: OrgPersonIF[]
  noticeDate?: string // YYYY-MM-DD
  relationships?: RelationshipTypes[]
  type: RestorationTypes
}
