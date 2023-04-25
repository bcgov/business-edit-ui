import { CorpTypeCd } from '@/bcrs-shared-components/enums'
import { ApiDateTimeUtc } from './date-interfaces'

/**
 * Name Request State interface.
 * (Used by our UI/API - not the same as namex response object.)
 * See:
 * https://github.com/bcgov/business-schemas/blob/master/src/registry_schemas/schemas/name_request.json
 */
/** Name request response details interface. */
export interface NameRequestDetailsIF {
  approvedName: string
  status: string
  consentFlag: string
  expirationDate: ApiDateTimeUtc
}

/** Name request applicant details interface. */
export interface NameRequestApplicantIF {
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

export interface NameRequestIF {
  nrNumber: string
  entityType: CorpTypeCd
  details: NameRequestDetailsIF
  applicant: NameRequestApplicantIF
  filingId: number
}
