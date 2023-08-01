import { NameRequestApplicantIF } from '@/interfaces/'
import { CorrectNameOptions, NameRequestStates } from '@/enums/'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

export interface CorrectNameOptionIF {
  id: CorrectNameOptions,
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

export interface NrActionIF {
  URL: string | null,
  entitiesFilingName: string | null,
  filingName: string,
  learTemplate: string | null
}

export interface NrResponseIF {
  actions?: NrActionIF[]
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
