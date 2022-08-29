import { AccountInformationIF, ActionKvIF, AddressesIF, BusinessInformationIF, EntitySnapshotIF, CertifyIF,
  FilingDataIF, CorrectionInformationIF, NameRequestIF, NameTranslationIF, OrgPersonIF, ShareClassIF, StateIF,
  FeesIF, ResourceIF } from '@/interfaces/'
import { CompletingPartyIF, ContactPointIF, NaicsIF, SpecialResolutionIF,
  StaffPaymentIF } from '@bcrs-shared-components/interfaces/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { FilingTypes } from '@/enums/'

export const mutateBusinessId = (state: StateIF, businessId: string) => {
  state.stateModel.tombstone.businessId = businessId
}

export const mutateResource = (state: StateIF, resource: ResourceIF) => {
  state.resourceModel = resource
}

export const mutateKeycloakRoles = (state: StateIF, keyCloakRoles: Array<string>) => {
  state.stateModel.tombstone.keycloakRoles = keyCloakRoles
}

export const mutateAuthRoles = (state: StateIF, authRoles: Array<string>) => {
  state.stateModel.tombstone.authRoles = authRoles
}

export const mutateUserInfo = (state: StateIF, userInfo: any) => {
  state.stateModel.tombstone.userInfo = userInfo
}

export const mutateOrgInfo = (state: StateIF, orgInfo: any) => {
  state.stateModel.tombstone.orgInfo = orgInfo
}

export const mutateIsSaving = (state: StateIF, isSaving: boolean) => {
  state.stateModel.tombstone.isSaving = isSaving
}

export const mutateIsSavingResuming = (state: StateIF, isSavingResuming: boolean) => {
  state.stateModel.tombstone.isSavingResuming = isSavingResuming
}

export const mutateIsFilingPaying = (state: StateIF, isFilingPaying: boolean) => {
  state.stateModel.tombstone.isFilingPaying = isFilingPaying
}

export const mutateCurrentDate = (state: StateIF, dateString: string) => {
  state.stateModel.tombstone.currentDate = dateString
}

export const mutateCurrentJsDate = (state: StateIF, date: Date) => {
  state.stateModel.currentJsDate = date
}

export const mutateIsFutureEffective = (state: StateIF, isFutureEffective: boolean) => {
  state.stateModel.effectiveDateTime.isFutureEffective = isFutureEffective
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutateEffectiveDateTimeString = (state: StateIF, dateTime: string) => {
  state.stateModel.effectiveDateTime.dateTimeString = dateTime
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutateEffectiveDateValid = (state: StateIF, valid: boolean) => {
  state.stateModel.validationFlags.flagsReviewCertify.isValidEffectiveDate = valid
}

export const mutateCertifyState = (state: StateIF, certifyState: CertifyIF) => {
  state.stateModel.certifyState = certifyState
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutateCertifyStateValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.validationFlags.flagsReviewCertify.isValidCertify = validity
}

export const mutateDocumentOptionalEmail = (state: StateIF, documentOptionalEmail: string) => {
  state.stateModel.documentDelivery.documentOptionalEmail = documentOptionalEmail
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutateDocumentOptionalEmailValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.validationFlags.flagsReviewCertify.isValidDocumentOptionalEmail = validity
}

export const mutateCompletingParty = (state: StateIF, cp: CompletingPartyIF) => {
  state.stateModel.completingParty = cp
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutateCompletingPartyValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.validationFlags.flagsReviewCertify.isValidCompletingParty = validity
}

export const mutateTransactionalFolioNumber = (state: StateIF, folioNumber: string) => {
  state.stateModel.tombstone.transactionalFolioNumber = folioNumber
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutateTransactionalFolioNumberValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.validationFlags.flagsReviewCertify.isValidTransactionalFolioNumber = validity
}

export const mutateBusinessContact = (state: StateIF, businessContact: ContactPointIF) => {
  state.stateModel.businessContact = businessContact
  // don't set Have Changes flag for business contact since it's changed directly in Auth API
}

export const mutateOfficeAddresses = (state: StateIF, addresses: AddressesIF) => {
  state.stateModel.officeAddresses = addresses
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutatePeopleAndRoles = (state: StateIF, orgPeople: OrgPersonIF[]) => {
  state.stateModel.peopleAndRoles.orgPeople = orgPeople
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutatePeopleAndRolesChanged = (state: StateIF, changed: boolean) => {
  state.stateModel.peopleAndRoles.changed = changed
}

export const mutatePeopleAndRolesValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.validationFlags.flagsCompanyInfo.isValidOrgPersons = validity
}

export const mutateFolioNumber = (state: StateIF, folioNumber: string) => {
  state.stateModel.tombstone.folioNumber = folioNumber
  // NB: folio number was changed immediately in auth db - do not set unsaved Changes flag
}

export const mutateAccountInformation = (state: StateIF, accountInformation: AccountInformationIF) => {
  state.stateModel.accountInformation = accountInformation
}

export const mutateBusinessInformation = (state: StateIF, businessInformation: BusinessInformationIF) => {
  state.stateModel.businessInformation = businessInformation
}

export const mutateCorrectionInformation = (state: StateIF, correctionInformation: CorrectionInformationIF) => {
  state.stateModel.correctionInformation = correctionInformation
}

export const mutateCorrectionStartDate = (state: StateIF, startDate: string) => {
  state.stateModel.correctionInformation.startDate = startDate
}

export const mutateNameRequest = (state: StateIF, nameRequest: NameRequestIF) => {
  state.stateModel.nameRequest = nameRequest
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutateNameTranslations = (state: StateIF, nameTranslations: NameTranslationIF[]) => {
  state.stateModel.nameTranslations = nameTranslations
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutateFilingId = (state: StateIF, filingId: number) => {
  state.stateModel.tombstone.filingId = filingId
}

export const mutateShareClasses = (state: StateIF, shareClasses: ShareClassIF[]) => {
  state.stateModel.shareStructureStep.shareClasses = shareClasses
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutateShareStructureChanged = (state: StateIF, changed: boolean) => {
  state.stateModel.shareStructureStep.changed = changed
}

export const mutateCreateShareStructureStepValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.validationFlags.flagsCompanyInfo.isValidShareStructure = validity
}

export const mutateIgnoreChanges = (state: StateIF, ignoreChanges: boolean) => {
  state.stateModel.tombstone.ignoreChanges = ignoreChanges
}

export const mutateHaveUnsavedChanges = (state: StateIF, haveUnsavedChanges: boolean) => {
  state.stateModel.tombstone.haveUnsavedChanges = haveUnsavedChanges
}

export const mutateEntityType = (state: StateIF, entityType: CorpTypeCd) => {
  state.stateModel.tombstone.entityType = entityType
}

export const mutateEntitySnapshot = (state: StateIF, entitySnapshot: EntitySnapshotIF) => {
  state.stateModel.entitySnapshot = entitySnapshot
}

export const mutateStaffPayment = (state: StateIF, staffPayment: StaffPaymentIF) => {
  state.stateModel.staffPayment = staffPayment
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutateStaffPaymentValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.validationFlags.flagsReviewCertify.isValidStaffPayment = validity
}

export const mutateFilingData = (state: StateIF, filingData: FilingDataIF[]) => {
  state.stateModel.filingData = filingData
}

export const mutateDetailValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.validationFlags.flagsReviewCertify.isValidDetailComment = validity
}

export const mutateDetailComment = (state: StateIF, comment: string) => {
  state.stateModel.detailComment = comment
}

export const mutateEditingCompanyName = (state: StateIF, editing: boolean) => {
  state.stateModel.editingFlags.companyName = editing
}

export const mutateEditingNameTranslations = (state: StateIF, editing: boolean) => {
  state.stateModel.editingFlags.nameTranslations = editing
}

export const mutateEditingOfficeAddresses = (state: StateIF, editing: boolean) => {
  state.stateModel.editingFlags.officeAddresses = editing
}

export const mutateEditingFolioNumber = (state: StateIF, editing: boolean) => {
  state.stateModel.editingFlags.folioNumber = editing
}

export const mutateEditingPeopleAndRoles = (state: StateIF, editing: boolean) => {
  state.stateModel.editingFlags.peopleAndRoles = editing
}

export const mutateEditingShareStructure = (state: StateIF, editing: boolean) => {
  state.stateModel.editingFlags.shareStructure = editing
}

export const mutateSummaryMode = (state: StateIF, summaryMode: boolean) => {
  state.stateModel.summaryMode = summaryMode
}

export const mutateFilingType = (state: StateIF, filingType: FilingTypes) => {
  state.stateModel.tombstone.filingType = filingType
}

export const mutateProvisionsRemoved = (state: StateIF, provisionsRemoved: boolean) => {
  state.stateModel.newAlteration.provisionsRemoved = provisionsRemoved
}

export const mutateNewResolutionDates = (state: StateIF, resolutionDates: string[]) => {
  state.stateModel.shareStructureStep.resolutionDates = resolutionDates
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutateFileNumber = (state: StateIF, fileNumber: string) => {
  state.stateModel.newAlteration.courtOrder.fileNumber = fileNumber
}

export const mutateHasPlanOfArrangement = (state: StateIF, hasPoa: boolean) => {
  state.stateModel.newAlteration.courtOrder.hasPlanOfArrangement = hasPoa
}

export const mutateAppValidate = (state: StateIF, isValid: boolean) => {
  state.stateModel.validationFlags.appValidate = isValid
}

export const mutateComponentValidate = (state: StateIF, isValid: boolean) => {
  state.stateModel.validationFlags.componentValidate = isValid
}

export const mutateValidCourtOrder = (state: StateIF, isValid: boolean) => {
  state.stateModel.validationFlags.flagsReviewCertify.isValidCourtOrder = isValid
}

export const mutateCurrentFees = (state: StateIF, fees: FeesIF[]) => {
  state.stateModel.currentFees = fees
}

export const mutateFeePrices = (state: StateIF, feePrices: FeesIF[]) => {
  state.stateModel.feePrices = feePrices
}

export const mutateIsValidComponent = (state: StateIF, kv: ActionKvIF) => {
  state.stateModel.validationFlags.flagsCompanyInfo[kv.key] = kv.value
}

export const mutateNaics = (state: StateIF, naics: NaicsIF) => {
  state.stateModel.businessInformation.naicsCode = naics.naicsCode
  state.stateModel.businessInformation.naicsDescription = naics.naicsDescription
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveUnsavedChanges(state, true)
}

export const mutateResolution = (state: StateIF, resolution: SpecialResolutionIF) => {
  state.stateModel.createResolution = resolution
}

export const mutateSpecialResolutionConfirmStateValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.validationFlags.flagsReviewCertify.isValidSpecialResolutionConfirm = validity
}
