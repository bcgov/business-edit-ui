import { EntityTypes } from '@/enums'

/** Data object used internally only (not to/from API). */
export interface BusinessInformationIF {
  legalType: EntityTypes
  identifier: string
  legalName?: string
  foundingDateTime?: string
  hasRestrictions?: boolean
}
