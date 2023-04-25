import { CorpTypeCd, FilingCodes } from '@/bcrs-shared-components/enums'

/** Filing data object passed to the SBC Fee Summary. */
export interface FilingDataIF {
  filingDescription?: string
  filingTypeCode: FilingCodes
  entityType: CorpTypeCd
  priority: boolean
  waiveFees?: boolean
  futureEffective?: boolean
}
