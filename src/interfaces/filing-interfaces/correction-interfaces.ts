import { ChgRegistrationIF, FilingBusinessIF, FilingHeaderIF, IncorporationApplicationIF, RegistrationIF }
  from '@/interfaces/'
import { CorrectionErrorTypes } from '@/enums/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/correction.json
//
interface CorrectionIF {
  correctedFilingId: number
  correctedFilingType: string
  correctedFilingDate: string
  comment: string
  type: CorrectionErrorTypes
}

/** Interface for data object UI sends to API. */
export interface CorrectionFilingIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  correction: CorrectionIF
  incorporationApplication?: IncorporationApplicationIF
  changeofRegistration?: ChgRegistrationIF
  registration?: RegistrationIF
}
