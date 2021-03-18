import { EntityTypes } from '@/enums'

/** Data object used internally only (not to/from API). */
export interface BusinessInformationIF {
  legalType: EntityTypes
  identifier: string
  legalName?: string
  foundingDate?: string // actually date-time
  hasRestrictions?: boolean
}
