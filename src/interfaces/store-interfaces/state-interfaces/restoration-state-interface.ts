import { ApprovalTypes, CorpTypeCd, RestorationTypes } from '@/enums'
import { CourtOrderIF } from '@/interfaces/alteration-interfaces'

export interface RestorationNameRequestIF {
  legalName: string
  legalType: CorpTypeCd
  nrNumber: string
}

export interface RestorationStateIF {
  approvalType: ApprovalTypes
  approvalTypeValid: boolean
  businessNameValid: boolean
  courtOrder?: CourtOrderIF
  type: RestorationTypes
  expiry?: string // YYYY-MM-DD
  expiryValid: boolean
}

export interface StateFilingRestorationIF {
  applicationDate?: string // YYYY-MM-DD
  approvalType: ApprovalTypes
  approvalTypeValid: boolean
  businessNameValid: boolean
  courtOrder?: CourtOrderIF
  expiry?: string // YYYY-MM-DD
  noticeDate?: string // YYYY-MM-DD
  relationships?: string[]
  restorationTypeValid: boolean
  type: RestorationTypes
}
