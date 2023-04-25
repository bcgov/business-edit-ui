import { ActionTypes } from '@/bcrs-shared-components/enums'

/**
 * See:
 * https://github.com/bcgov/business-schemas/blob/master/src/registry_schemas/schemas/share_structure.json
 */
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
  hasRightsOrRestrictions: boolean
  series?: ShareClassIF[]
  action?: ActionTypes // Local state indicates corrected/added/removed
}

export interface ShareStructureIF {
  resolutionDates?: string[]
  valid?: boolean
  changed?: boolean
  shareClasses: ShareClassIF[]
}
