import { CorrectionErrorTypes, FilingTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

/** Data object used internally only (not to/from API). */
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
  correctedFilingId: number
  isSaving: boolean
  isSavingResuming: boolean
  isFilingPaying: boolean
  ignoreChanges: boolean
  haveUnsavedChanges: boolean
  folioNumber: string
  transactionalFolioNumber: string
  correctionType: CorrectionErrorTypes
}
