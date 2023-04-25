import { CorpTypeCd } from '@/bcrs-shared-components/enums'

/**
 * A filing's business object from the API. See:
 * https://github.com/bcgov/business-schemas/blob/master/src/registry_schemas/schemas/business.json
 */
export interface BusinessIF {
  cacheId?: number
  lastLedgerTimestamp?: string
  lastPreBobFilingTimestamp?: string
  dissolutionDate?: string
  fiscalYearEndDate?: string
  foundingDate?: string
  identifier: string
  legalName?: string
  legalType?: CorpTypeCd
  taxId?: string
  nextAnnualReport?: string // not yet in schema
}
