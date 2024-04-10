import { ApprovalTypes, RestorationTypes, RelationshipTypes } from '@/enums'
import { AddressesIF, CourtOrderIF, NameTranslationIF, OrgPersonIF } from '@/interfaces/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { ContactPointIF, NameRequestIF } from '@bcrs-shared-components/interfaces/'

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
  // intersection type so we can save original NR + properties needed by Legal API:
  nameRequest?: NameRequestIF & { legalName: string, nrNumber?: string }
  nameTranslations?: NameTranslationIF[]
  noticeDate?: string // YYYY-MM-DD
  offices: AddressesIF
  parties: OrgPersonIF[]
  relationships?: RelationshipTypes[]
  type: RestorationTypes
}
