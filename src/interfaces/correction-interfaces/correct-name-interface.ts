import { NameRequestApplicantIF } from '@/interfaces'
import { CorrectionTypes, EntityTypes, NameRequestStates } from '@/enums'

export interface CorrectNameOptionIF {
  id: CorrectionTypes,
  title: string,
  description?: string,
  component: any
}

export interface NrCorrectionIF {
  legalType: EntityTypes,
  nrNumber: string,
  legalName: string,
  expiry: string,
  status: NameRequestStates
  applicant: NameRequestApplicantIF | {}
}

export interface NrResponseIF {
  // eslint-disable-next-line camelcase
  entity_type_cd: EntityTypes, // Ignore lint error on property name served from api.
  expirationDate: string,
  state: NameRequestStates,
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
