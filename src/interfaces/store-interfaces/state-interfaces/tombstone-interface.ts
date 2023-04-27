import { FilingTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

/** Interface for tombstone object in store (not to/from API). */
export interface TombStoneIF {
  filingType: FilingTypes
  keycloakRoles: Array<string>
  authRoles: Array<string>
  userInfo: any // from auth profile
  orgInfo: any // from auth
  businessId: string
  entityType: CorpTypeCd
  currentDate: string // YYYY-MM-DD
  filingId: number
  isSaving: boolean
  isSavingResuming: boolean
  isFilingPaying: boolean
  ignoreChanges: boolean
  haveUnsavedChanges: boolean
  folioNumber: string
  transactionalFolioNumber: string
  userEmail?: string
}
