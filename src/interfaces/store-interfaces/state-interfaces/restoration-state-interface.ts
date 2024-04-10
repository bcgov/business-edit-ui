import { ApprovalTypes, RestorationTypes, RelationshipTypes } from '@/enums'
import { CourtOrderIF } from '@/interfaces/alteration-interfaces'

export interface RestorationStateIF {
  approvalType: ApprovalTypes
  approvalTypeValid: boolean
  businessNameValid: boolean
  courtOrder?: CourtOrderIF
  type: RestorationTypes
  expiry?: string // YYYY-MM-DD
  expiryValid: boolean
  noticeDate?: string // YYYY-MM-DD
  relationships: RelationshipTypes[]
}

export interface StateFilingRestorationIF {
  applicationDate?: string // YYYY-MM-DD
  approvalType: ApprovalTypes
  approvalTypeValid: boolean
  businessNameValid: boolean
  courtOrder?: CourtOrderIF
  expiry?: string // YYYY-MM-DD
  noticeDate?: string // YYYY-MM-DD
  relationships: RelationshipTypes[]
  restorationTypeValid: boolean
  type: RestorationTypes
}
