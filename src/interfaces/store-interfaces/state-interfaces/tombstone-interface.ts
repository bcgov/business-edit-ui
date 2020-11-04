import { EntityTypes } from '@/enums'

// Tombstone State model
export interface TombStoneIF {
  keycloakRoles: Array<string>
  authRoles: Array<string>
  userInfo: any // from auth profile
  businessId: string
  entityType: EntityTypes
  currentDate: string
  filingDate: string
  filingId: number
  correctedFilingId: number
  isSaving: boolean
  isSavingResuming: boolean
  isFilingPaying: boolean
  ignoreChanges: boolean
  haveChanges: boolean
}
