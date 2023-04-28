import { NameRequestApplicantIF } from '@/interfaces/'
import { NameChangeOptions, NameRequestStates } from '@/enums/'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

export interface CorrectNameOptionIF {
  id: NameChangeOptions,
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
  applicant: NameRequestApplicantIF
}

export interface NrResponseIF {
  legalType: CorpTypeCd,
  entity_type_cd: CorpTypeCd, // eslint-disable-line camelcase
  expirationDate: string,
  state: NameRequestStates,
  request_action_cd: NrRequestActionCodes, // eslint-disable-line camelcase
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
