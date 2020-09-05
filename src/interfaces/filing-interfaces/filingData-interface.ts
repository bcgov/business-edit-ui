import { FilingCodes, EntityTypes } from '@/enums'

/** Filing data object passed to the SBC Fee Summary. */
export interface FilingDataIF {
  filingDescription?: string
  filingTypeCode: FilingCodes
  entityType: EntityTypes
  waiveFees?: boolean;
  futureEffective?: boolean
}
