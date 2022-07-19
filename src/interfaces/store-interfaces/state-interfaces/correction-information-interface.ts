import { CorrectionErrorTypes, FilingTypes } from '@/enums/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/correction.json
//

/** Interface for correction information object in store. */
export interface CorrectionInformationIF {
  comment: string // max 4096 characters
  correctedFilingId: number
  correctedFilingDate: string // API format
  correctedFilingType: FilingTypes
  type?: CorrectionErrorTypes

  // optional objects with new correction data:
  business?: any // ** FUTURE: implement this
  contactPoint?: any // ** FUTURE: implement this
  nameRequest?: any // ** FUTURE: implement this
  nameTranslations?: any // ** FUTURE: implement this
  offices?: any // ** FUTURE: implement this
  parties?: any // ** FUTURE: implement this
  shareStructure?: any // ** FUTURE: implement this
  startDate?: any // ** FUTURE: implement this
}
