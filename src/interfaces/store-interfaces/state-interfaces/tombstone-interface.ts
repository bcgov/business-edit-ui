import { EntityTypes } from '@/enums'

/** Data object used internally only (not to/from API). */
export interface TombStoneIF {
  keycloakRoles: Array<string>
  authRoles: Array<string>
  userInfo: any // from auth profile
  businessId: string
  entityType: EntityTypes
  currentDate: string // YYYY-MM-DD
  filingDateTime: string
  filingId: number
  correctedFilingId: number
  isSaving: boolean
  isSavingResuming: boolean
  isFilingPaying: boolean
  ignoreChanges: boolean
  haveChanges: boolean
}
