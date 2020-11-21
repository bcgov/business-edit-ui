import {
  CertifyStatementIF,
  CertifyIF,
  IncorporationAddressIf,
  NameRequestIF,
  BusinessContactIF,
  OrgPersonIF,
  ShareClassIF,
  AccountInformationIF,
  IncorporationAgreementIF,
  BusinessInformationIF,
  IncorporationFilingIF,
  FilingDataIF,
  NameTranslationIF,
  StateIF
} from '@/interfaces'
import { StaffPaymentIF } from '@bcrs-shared-components/interfaces'
import { EntityTypes } from '@/enums'

export const mutateBusinessId = (state: StateIF, businessId: string) => {
  state.stateModel.tombstone.businessId = businessId
}

export const mutateCertifyStatementResource = (state: StateIF, certifyStatementResource: CertifyStatementIF) => {
  state.resourceModel.certifyStatementResource = certifyStatementResource
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

export const mutateIsSaving = (state: StateIF, isSaving: boolean) => {
  state.stateModel.tombstone.isSaving = isSaving
}

export const mutateIsSavingResuming = (state: StateIF, isSavingResuming: boolean) => {
  state.stateModel.tombstone.isSavingResuming = isSavingResuming
}

export const mutateIsFilingPaying = (state: StateIF, isFilingPaying: boolean) => {
  state.stateModel.tombstone.isFilingPaying = isFilingPaying
}

export const mutateCurrentDate = (state: StateIF, currentDate: string) => {
  state.stateModel.tombstone.currentDate = currentDate
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateIsFutureEffective = (state: StateIF, isFutureEffective: boolean) => {
  state.stateModel.incorporationDateTime.isFutureEffective = isFutureEffective
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateEffectiveDate = (state: StateIF, effectiveDate: Date) => {
  state.stateModel.incorporationDateTime.effectiveDate = effectiveDate
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateIsIncorporationDateTimeValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.incorporationDateTime.valid = validity
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateCertifyState = (state: StateIF, certifyState: CertifyIF) => {
  state.stateModel.certifyState = certifyState
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateCertifyStateValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.certifyState.valid = validity
}

export const mutateBusinessContact = (state: StateIF, businessContact: BusinessContactIF) => {
  state.stateModel.defineCompanyStep.businessContact = businessContact
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateDefineCompanyStepValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.defineCompanyStep.valid = validity
}

export const mutateDefineCompanyStepChanged = (state: StateIF, changed: boolean) => {
  state.stateModel.defineCompanyStep.changed = changed
}

export const mutateOfficeAddresses = (state: StateIF, addresses: IncorporationAddressIf) => {
  state.stateModel.defineCompanyStep.officeAddresses = addresses
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutatePeopleAndRoles = (state: StateIF, orgPeople: OrgPersonIF[]) => {
  state.stateModel.peopleAndRolesStep.orgPeople = orgPeople
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutatePeopleAndRolesChanged = (state: StateIF, changed: boolean) => {
  state.stateModel.peopleAndRolesStep.changed = changed
}

export const mutatePeopleAndRolesValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.peopleAndRolesStep.valid = validity
}

export const mutateFolioNumber = (state: StateIF, folioNumber: string) => {
  state.stateModel.defineCompanyStep.folioNumber = folioNumber
}

export const mutateFilingDate = (state: StateIF, filingDate: string) => {
  state.stateModel.tombstone.filingDate = filingDate
}

export const mutateAccountInformation = (state: StateIF, accountInformation: AccountInformationIF) => {
  state.stateModel.accountInformation = accountInformation
}

export const mutateBusinessInformation = (state: StateIF, businessInformation: BusinessInformationIF) => {
  state.stateModel.businessInformation = businessInformation
}

export const mutateNameRequest = (state: StateIF, nameRequest: NameRequestIF) => {
  state.stateModel.nameRequest = nameRequest
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateNameTranslations = (state: StateIF, nameTranslations: NameTranslationIF[]) => {
  state.stateModel.nameTranslations = nameTranslations
}

export const mutateFilingId = (state: StateIF, filingId: number) => {
  state.stateModel.tombstone.filingId = filingId
}

export const mutateCorrectedFilingId = (state: StateIF, correctedFilingId: number) => {
  state.stateModel.tombstone.correctedFilingId = correctedFilingId
}

export const mutateShareClasses = (state: StateIF, shareClasses: ShareClassIF[]) => {
  state.stateModel.shareStructureStep.shareClasses = shareClasses
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateShareStructureChanged = (state: StateIF, changed: boolean) => {
  state.stateModel.shareStructureStep.changed = changed
}

export const mutateCreateShareStructureStepValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.shareStructureStep.valid = validity
}

export const mutateIncorporationAgreementStepData = (state: StateIF, stepData: IncorporationAgreementIF) => {
  state.stateModel.incorporationAgreementStep = stepData
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateIncorporationAgreementChanged = (state: StateIF, changed: boolean) => {
  state.stateModel.incorporationAgreementStep.changed = changed
}

export const mutateIncorporationAgreementValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.incorporationAgreementStep.valid = validity
}

export const mutateIgnoreChanges = (state: StateIF, ignoreChanges: boolean) => {
  state.stateModel.tombstone.ignoreChanges = ignoreChanges
}

export const mutateHaveChanges = (state: StateIF, haveChanges: boolean) => {
  state.stateModel.tombstone.haveChanges = haveChanges
}

export const mutateEntityType = (state: StateIF, entityType: EntityTypes) => {
  state.stateModel.tombstone.entityType = entityType
}

export const mutateOriginalIA = (state: StateIF, originalIa: IncorporationFilingIF) => {
  state.stateModel.originalIA = originalIa
}

export const mutateStaffPayment = (state: StateIF, staffPayment: StaffPaymentIF) => {
  state.stateModel.staffPaymentStep.staffPayment = staffPayment
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateStaffPaymentValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.staffPaymentStep.valid = validity
}

export const mutateFilingData = (state: StateIF, filingData: FilingDataIF) => {
  state.stateModel.filingData = filingData
}

export const mutateDetailValidity = (state: StateIF, validity: boolean) => {
  state.stateModel.detail.valid = validity
}

export const mutateDetailComment = (state: StateIF, comment: string) => {
  state.stateModel.detail.comment = comment
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

export const mutateEditingPeopleAndRoles = (state: StateIF, editing: boolean) => {
  state.stateModel.editingFlags.peopleAndRoles = editing
}

export const mutateEditingShareStructure = (state: StateIF, editing: boolean) => {
  state.stateModel.editingFlags.shareStructure = editing
}

export const mutateEditingIncorporationAgreement = (state: StateIF, editing: boolean) => {
  state.stateModel.editingFlags.incorporationAgreement = editing
}
