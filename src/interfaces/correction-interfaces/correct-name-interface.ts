import { NameRequestApplicantIF } from '@/interfaces'
import { CorrectionTypes, CorpTypeCd, NameRequestStates, NameRequestTypes } from '@/enums'

export interface CorrectNameOptionIF {
  id: CorrectionTypes,
  title: string,
  description?: string,
  component: any
}

export interface NrCorrectionIF {
  legalType: CorpTypeCd,
  nrNumber: string,
  legalName: string,
  expiry: string,
  requestType: string,
  status: NameRequestStates,
  applicant: NameRequestApplicantIF | {}
}

export interface NrResponseIF {
  legalType: CorpTypeCd,
  // eslint-disable-next-line camelcase
  entity_type_cd: CorpTypeCd,
  expirationDate: string,
  state: NameRequestStates,
  // eslint-disable-next-line camelcase
  request_action_cd: NameRequestTypes,
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
