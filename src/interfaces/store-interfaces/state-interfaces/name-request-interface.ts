import { NameRequestStates, NameRequestTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

// Name Request State interface
export interface NameRequestIF {
  applicant?: NameRequestApplicantIF
  details?: NameRequestDetailsIF | {}
  expiry?: string
  filingId?: number
  legalName: string
  legalType: CorpTypeCd
  nrNumber?: string
  requestType?: NameRequestTypes
  status?: NameRequestStates
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
  legalName: null,
  nrNumber: null
}
