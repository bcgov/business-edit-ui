import { AccountInformationIF, ActionKvIF, AddressesIF, BusinessInformationIF, CourtOrderIF, EntitySnapshotIF,
  CertifyIF, FilingDataIF, CorrectionInformationIF, NameRequestIF, NameTranslationIF, OrgPersonIF, ShareClassIF,
  StateIF, FeesIF, ResourceIF, StateFilingRestorationIF } from '@/interfaces/'
import { CompletingPartyIF, ContactPointIF, NaicsIF, SpecialResolutionIF,
  StaffPaymentIF } from '@bcrs-shared-components/interfaces/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { ApprovalTypes, FilingTypes, RestorationTypes } from '@/enums/'

export default {
  mutateBusinessId (state: StateIF, businessId: string) {
    state.stateModel.tombstone.businessId = businessId
  },

  mutateResource (state: StateIF, resource: ResourceIF) {
    state.resourceModel = resource
  },

  mutateKeycloakRoles (state: StateIF, keyCloakRoles: Array<string>) {
    state.stateModel.tombstone.keycloakRoles = keyCloakRoles
  },

  mutateAuthRoles (state: StateIF, authRoles: Array<string>) {
    state.stateModel.tombstone.authRoles = authRoles
  },

  mutateUserInfo (state: StateIF, userInfo: any) {
    state.stateModel.tombstone.userInfo = userInfo
  },

  mutateOrgInfo (state: StateIF, orgInfo: any) {
    state.stateModel.tombstone.orgInfo = orgInfo
  },

  mutateIsSaving (state: StateIF, isSaving: boolean) {
    state.stateModel.tombstone.isSaving = isSaving
  },

  mutateIsSavingResuming (state: StateIF, isSavingResuming: boolean) {
    state.stateModel.tombstone.isSavingResuming = isSavingResuming
  },

  mutateIsFilingPaying (state: StateIF, isFilingPaying: boolean) {
    state.stateModel.tombstone.isFilingPaying = isFilingPaying
  },

  mutateCurrentDate (state: StateIF, dateString: string) {
    state.stateModel.tombstone.currentDate = dateString
  },

  mutateCurrentJsDate (state: StateIF, date: Date) {
    state.stateModel.currentJsDate = date
  },

  mutateIsFutureEffective (state: StateIF, isFutureEffective: boolean) {
    state.stateModel.effectiveDateTime.isFutureEffective = isFutureEffective
  },

  mutateEffectiveDateTimeString (state: StateIF, dateTime: string) {
    state.stateModel.effectiveDateTime.dateTimeString = dateTime
  },

  mutateEffectiveDateValid (state: StateIF, valid: boolean) {
    state.stateModel.validationFlags.flagsReviewCertify.isValidEffectiveDate = valid
  },

  mutateCertifyState (state: StateIF, certifyState: CertifyIF) {
    state.stateModel.certifyState = certifyState
  },

  mutateCertifyStateValidity (state: StateIF, validity: boolean) {
    state.stateModel.validationFlags.flagsReviewCertify.isValidCertify = validity
  },

  mutateDocumentOptionalEmail (state: StateIF, documentOptionalEmail: string) {
    state.stateModel.documentDelivery.documentOptionalEmail = documentOptionalEmail
  },

  mutateDocumentOptionalEmailValidity (state: StateIF, validity: boolean) {
    state.stateModel.validationFlags.flagsReviewCertify.isValidDocumentOptionalEmail = validity
  },

  mutateCompletingParty (state: StateIF, cp: CompletingPartyIF) {
    state.stateModel.completingParty = cp
  },

  mutateCompletingPartyValidity (state: StateIF, validity: boolean) {
    state.stateModel.validationFlags.flagsReviewCertify.isValidCompletingParty = validity
  },

  mutateTransactionalFolioNumber (state: StateIF, folioNumber: string) {
    state.stateModel.tombstone.transactionalFolioNumber = folioNumber
  },

  mutateTransactionalFolioNumberValidity (state: StateIF, validity: boolean) {
    state.stateModel.validationFlags.flagsReviewCertify.isValidTransactionalFolioNumber = validity
  },

  mutateBusinessContact (state: StateIF, businessContact: ContactPointIF) {
    state.stateModel.businessContact = businessContact
    // don't set Have Changes flag for business contact since it's changed directly in Auth API
  },

  mutateOfficeAddresses (state: StateIF, addresses: AddressesIF) {
    state.stateModel.officeAddresses = addresses
  },

  mutatePeopleAndRoles (state: StateIF, orgPeople: OrgPersonIF[]) {
    state.stateModel.peopleAndRoles.orgPeople = orgPeople
  },

  mutatePeopleAndRolesChanged (state: StateIF, changed: boolean) {
    state.stateModel.peopleAndRoles.changed = changed
  },

  mutatePeopleAndRolesValidity (state: StateIF, validity: boolean) {
    state.stateModel.validationFlags.flagsCompanyInfo.isValidOrgPersons = validity
  },

  mutateFolioNumber (state: StateIF, folioNumber: string) {
    state.stateModel.tombstone.folioNumber = folioNumber
    // NB: folio number was changed immediately in auth db - do not set unsaved Changes flag
  },

  mutateAccountInformation (state: StateIF, accountInformation: AccountInformationIF) {
    state.stateModel.accountInformation = accountInformation
  },

  mutateBusinessInformation (state: StateIF, businessInformation: BusinessInformationIF) {
    state.stateModel.businessInformation = businessInformation
  },

  mutateCorrectionInformation (state: StateIF, correctionInformation: CorrectionInformationIF) {
    state.stateModel.correctionInformation = correctionInformation
  },

  mutateCorrectionStartDate (state: StateIF, startDate: string) {
    state.stateModel.correctionInformation.startDate = startDate
  },

  mutateNameRequest (state: StateIF, nameRequest: NameRequestIF) {
    state.stateModel.nameRequest = nameRequest
  },

  mutateNameTranslations (state: StateIF, nameTranslations: NameTranslationIF[]) {
    state.stateModel.nameTranslations = nameTranslations
  },

  mutateFilingId (state: StateIF, filingId: number) {
    state.stateModel.tombstone.filingId = filingId
  },

  mutateShareClasses (state: StateIF, shareClasses: ShareClassIF[]) {
    state.stateModel.shareStructureStep.shareClasses = shareClasses
  },

  mutateShareStructureChanged (state: StateIF, changed: boolean) {
    state.stateModel.shareStructureStep.changed = changed
  },

  mutateCreateShareStructureStepValidity (state: StateIF, validity: boolean) {
    state.stateModel.validationFlags.flagsCompanyInfo.isValidShareStructure = validity
  },

  mutateIgnoreChanges (state: StateIF, ignoreChanges: boolean) {
    state.stateModel.tombstone.ignoreChanges = ignoreChanges
  },

  mutateHaveUnsavedChanges (state: StateIF, haveUnsavedChanges: boolean) {
    state.stateModel.tombstone.haveUnsavedChanges = haveUnsavedChanges
  },

  mutateEntityType (state: StateIF, entityType: CorpTypeCd) {
    state.stateModel.tombstone.entityType = entityType
  },

  mutateEntitySnapshot (state: StateIF, entitySnapshot: EntitySnapshotIF) {
    state.stateModel.entitySnapshot = entitySnapshot
  },

  mutateStaffPayment (state: StateIF, staffPayment: StaffPaymentIF) {
    state.stateModel.staffPayment = staffPayment
  },

  mutateStaffPaymentValidity (state: StateIF, validity: boolean) {
    state.stateModel.validationFlags.flagsReviewCertify.isValidStaffPayment = validity
  },

  mutateFilingData (state: StateIF, filingData: FilingDataIF[]) {
    state.stateModel.filingData = filingData
  },

  mutateDetailValidity (state: StateIF, validity: boolean) {
    state.stateModel.validationFlags.flagsReviewCertify.isValidDetailComment = validity
  },

  mutateDetailComment (state: StateIF, comment: string) {
    state.stateModel.detailComment = comment
  },

  mutateEditingCompanyName (state: StateIF, editing: boolean) {
    state.stateModel.editingFlags.companyName = editing
  },

  mutateEditingNameTranslations (state: StateIF, editing: boolean) {
    state.stateModel.editingFlags.nameTranslations = editing
  },

  mutateEditingOfficeAddresses (state: StateIF, editing: boolean) {
    state.stateModel.editingFlags.officeAddresses = editing
  },

  mutateEditingFolioNumber (state: StateIF, editing: boolean) {
    state.stateModel.editingFlags.folioNumber = editing
  },

  mutateEditingPeopleAndRoles (state: StateIF, editing: boolean) {
    state.stateModel.editingFlags.peopleAndRoles = editing
  },

  mutateEditingShareStructure (state: StateIF, editing: boolean) {
    state.stateModel.editingFlags.shareStructure = editing
  },

  mutateSummaryMode (state: StateIF, summaryMode: boolean) {
    state.stateModel.summaryMode = summaryMode
  },

  mutateFilingType (state: StateIF, filingType: FilingTypes) {
    state.stateModel.tombstone.filingType = filingType
  },

  mutateProvisionsRemoved (state: StateIF, provisionsRemoved: boolean) {
    state.stateModel.newAlteration.provisionsRemoved = provisionsRemoved
  },

  mutateSpecialResolutionDates (state: StateIF, specialResolutionDates: string[]) {
    state.stateModel.shareStructureStep.resolutionDates = specialResolutionDates
  },

  mutateFileNumber (state: StateIF, fileNumber: string) {
    state.stateModel.newAlteration.courtOrder.fileNumber = fileNumber
  },

  mutateHasPlanOfArrangement (state: StateIF, hasPoa: boolean) {
    state.stateModel.newAlteration.courtOrder.hasPlanOfArrangement = hasPoa
  },

  mutateAppValidate (state: StateIF, isValid: boolean) {
    state.stateModel.validationFlags.appValidate = isValid
  },

  mutateComponentValidate (state: StateIF, isValid: boolean) {
    state.stateModel.validationFlags.componentValidate = isValid
  },

  mutateValidCourtOrder (state: StateIF, isValid: boolean) {
    state.stateModel.validationFlags.flagsReviewCertify.isValidCourtOrder = isValid
  },

  mutateCurrentFees (state: StateIF, fees: FeesIF[]) {
    state.stateModel.currentFees = fees
  },

  mutateFeePrices (state: StateIF, feePrices: FeesIF[]) {
    state.stateModel.feePrices = feePrices
  },

  mutateIsValidComponent (state: StateIF, kv: ActionKvIF) {
    state.stateModel.validationFlags.flagsCompanyInfo[kv.key] = kv.value
  },

  mutateNaics (state: StateIF, naics: NaicsIF) {
    state.stateModel.businessInformation.naicsCode = naics.naicsCode
    state.stateModel.businessInformation.naicsDescription = naics.naicsDescription
  },

  mutateSpecialResolution (state: StateIF, specialResolution: SpecialResolutionIF) {
    state.stateModel.specialResolution = specialResolution
  },

  mutateSpecialResolutionConfirmStateValidity (state: StateIF, validity: boolean) {
    state.stateModel.validationFlags.flagsReviewCertify.isValidSpecialResolutionConfirm = validity
  },

  mutateRestorationType (state: StateIF, type: RestorationTypes) {
    state.stateModel.restoration.type = type
  },

  mutateRestorationExpiry (state: StateIF, expiry: string) {
    state.stateModel.restoration.expiry = expiry
  },

  mutateRestorationApprovalType (state: StateIF, type: ApprovalTypes) {
    state.stateModel.restoration.approvalType = type
  },

  mutateStateFilingRestoration (state: StateIF, restoration: StateFilingRestorationIF) {
    state.stateModel.stateFilingRestoration = restoration
  },

  mutateRestorationCourtOrder (state: StateIF, courtOrder: CourtOrderIF) {
    state.stateModel.restoration.courtOrder = courtOrder
  },

  mutateApprovalTypeValid (state: StateIF, valid: boolean) {
    state.stateModel.validationFlags.flagsCompanyInfo.isValidApprovalType = valid
  },

  mutateExpiryValid (state: StateIF, valid: boolean) {
    state.stateModel.validationFlags.flagsCompanyInfo.isValidExtensionTime = valid
  }
}
