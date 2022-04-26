import { CorpTypeCd, NameRequestStates, NameRequestTypes } from '@/enums/'

// Name Request State interface
export interface NameRequestIF {
  legalType: CorpTypeCd
  legalName: string
  nrNumber?: string
  expiry?: string
  requestType?: NameRequestTypes
  status?: NameRequestStates
  details?: NameRequestDetailsIF | {}
  applicant?: NameRequestApplicantIF
  filingId?: number
}

// Name request response details interface
export interface NameRequestDetailsIF {
  approvedName: string
  status: string
  consentFlag: string
  expirationDate: string
}

// Name request applicant details interface
export interface NameRequestApplicantIF {
  fullAddress?: string
  fullName?: string
  firstName: string
  middleName: string
  lastName: string
  emailAddress: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  addressLine3: string
  city: string
  countryTypeCode: string
  postalCode: string
  stateProvinceCode: string
}

export const EmptyNameRequest: NameRequestIF = {
  legalType: null,
  legalName: '',
  nrNumber: ''
}
