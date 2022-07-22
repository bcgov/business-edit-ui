import { ActionTypes } from '@/enums/'

export interface ShareStructureIF {
  resolutionDates?: string[]
  valid?: boolean
  changed?: boolean
  shareClasses?: ShareClassIF[]
}

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
