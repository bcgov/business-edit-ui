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
  entity_type_cd: string, // Ignore lint error on property name served from api.
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
