import { CorrectionInformationIF, FilingBusinessIF, FilingHeaderIF } from '@/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/correction.json
//

/** Interface for data object UI sends to API. */
export interface CorrectionFilingIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  correction: CorrectionInformationIF
}
