import { CorpTypeCd, RestorationTypes } from '@/enums'

export interface RestorationNameRequestIF {
  legalName: string
  legalType: CorpTypeCd
  nrNumber: string
}

export interface RestorationStateIF {
  businessInfoValid: boolean
  businessNameValid: boolean
  type: RestorationTypes
  expiry?: string // YYYY-MM-DD
  // defineBusinessValid: boolean
  // startDate: string
  // businessAddress: BusinessAddressIF
  // businessNumber?: string
}

export const EmptyRestorationState: RestorationStateIF = {
  businessInfoValid: false,
  businessNameValid: false,
  type: null,
  expiry: null
  // defineBusinessValid: false,
  // startDate: '',
  // businessAddress: null,
  // businessNumber: null
}
