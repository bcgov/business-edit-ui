import { FilingBusinessIF, FilingHeaderIF, IncorporationApplicationIF } from '@/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/correction.json
//
interface CorrectionIF {
  correctedFilingId: number
  correctedFilingType: string
  correctedFilingDate: string
  comment: string
}

/** Interface for data object UI sends to API. */
export interface CorrectionFilingIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  correction: CorrectionIF
  incorporationApplication?: IncorporationApplicationIF
}
