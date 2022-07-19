import { ChgRegistrationIF, CorrectionInformationIF, FilingBusinessIF, FilingHeaderIF, IncorporationApplicationIF,
  RegistrationIF } from '@/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/correction.json
//

/** Interface for data object UI sends to API. */
export interface CorrectionFilingIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  correction: CorrectionInformationIF
  incorporationApplication?: IncorporationApplicationIF
  changeofRegistration?: ChgRegistrationIF
  registration?: RegistrationIF
}
