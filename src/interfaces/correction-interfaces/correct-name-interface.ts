import { NameRequestApplicantIF } from '@/interfaces'
import { CorrectionTypes } from '@/enums'

export interface CorrectNameOptionIF {
  id: CorrectionTypes,
  title: string,
  description?: string,
  component: any
}

export interface NrCorrectionIF {
  legalType: string,
  nrNumber: string,
  legalName: string,
  expiry: string,
  status: string
  applicant: NameRequestApplicantIF | {}
}

export interface NrResponseIf {
  // eslint-disable-next-line camelcase
  entity_type_cd: string,
  expirationDate: string,
  state: string,
  applicants: {
    firstName: string,
    lastName: string
    addrLine1: string,
    addrLine2: string,
    addrLine3: string,
    countryTypeCd: string,
    phoneNumber: string,
    emailAddress: string
  }
}

// TEST DOWNLOADS CORP.
// Business Type: BC Limited Company
// Request Type: BC Benefit Company
// Expiry Date: BC Benefit Company
// Status: BC Benefit Company
// Condition/Consent: BC Benefit Company
// Name Request Applicant
// Name: BC Benefit Company
// Address: BC Benefit Company
// Email: BC Benefit Company
// Phone: BC Benefit Company
