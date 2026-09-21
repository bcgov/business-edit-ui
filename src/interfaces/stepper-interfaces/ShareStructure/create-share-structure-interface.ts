import { ActionTypes } from '@/enums/'

export interface ShareClassIF {
  id: string
  type?: string // Indicates whether class or series
  name: string
  priority: number
  hasMaximumShares?: boolean
  maxNumberOfShares: number
  hasParValue?: boolean
  parValue?: number
  currency?: string
  currencyAdditional?: string
  hasRightsOrRestrictions: boolean
  series?: ShareClassIF[]
  action?: ActionTypes // Local state indicates corrected/added/removed
}

/** Local share structure state. */
export interface ShareStructureIF {
  resolutionDates?: string[] // new dates only (YYYY-MM-DD)
  changed?: boolean // FUTURE: change to a getter like the others
  shareClasses?: ShareClassIF[]
}

/**
 * A resolution date in Legal API format.
 * Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/share_structure.json
 */
export interface ResolutionDateIF {
  id?: number // existing resolution id (corrections only)
  date: string // YYYY-MM-DD
}

/** Share structure as sent to and received from the Legal API. */
export interface ShareStructureApiIF {
  resolutionDates?: ResolutionDateIF[]
  shareClasses?: ShareClassIF[]
}
