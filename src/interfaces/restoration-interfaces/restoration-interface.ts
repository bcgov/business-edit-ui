import { ApprovalTypes, RestorationTypes, RelationshipTypes } from '@/enums'
import { AddressesIF, CourtOrderIF, NameRequestIF, NameTranslationIF, OrgPersonIF } from '@/interfaces/'
import { CorpTypeCd } from '@/bcrs-shared-components/enums'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/restoration.json
//
export interface RestorationIF {
  applicationDate?: string // YYYY-MM-DD
  approvalType: ApprovalTypes
  business: {
    identifier: string
    legalType: CorpTypeCd
  }
  contactPoint: ContactPointIF
  courtOrder?: CourtOrderIF
  expiry?: string // YYYY-MM-DD
  nameRequest?: NameRequestIF
  nameTranslations?: NameTranslationIF[]
  noticeDate?: string // YYYY-MM-DD
  offices: AddressesIF
  parties: OrgPersonIF[]
  relationships?: RelationshipTypes[]
  type: RestorationTypes
}
