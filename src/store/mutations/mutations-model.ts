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
  FilingDataIF
} from '@/interfaces'
import { StaffPaymentIF } from '@bcrs-shared-components/interfaces'
import { EntityTypes } from '@/enums'

export const mutateBusinessId = (state: any, businessId: string) => {
  state.stateModel.tombstone.businessId = businessId
}

export const mutateCertifyStatementResource = (state: any, certifyStatementResource: CertifyStatementIF) => {
  state.resourceModel.certifyStatementResource = certifyStatementResource
}

export const mutateKeycloakRoles = (state: any, keyCloakRoles: Array<string>) => {
  state.stateModel.tombstone.keycloakRoles = keyCloakRoles
}

export const mutateAuthRoles = (state: any, authRoles: Array<string>) => {
  state.stateModel.tombstone.authRoles = authRoles
}

export const mutateUserInfo = (state: any, userInfo: any) => {
  state.stateModel.tombstone.userInfo = userInfo
}

export const mutateIsSaving = (state: any, isSaving: boolean) => {
  state.stateModel.tombstone.isSaving = isSaving
}

export const mutateIsSavingResuming = (state: any, isSavingResuming: boolean) => {
  state.stateModel.tombstone.isSavingResuming = isSavingResuming
}

export const mutateIsFilingPaying = (state: any, isFilingPaying: boolean) => {
  state.stateModel.tombstone.isFilingPaying = isFilingPaying
}

export const mutateCurrentDate = (state: any, currentDate: string) => {
  state.stateModel.tombstone.currentDate = currentDate
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateIsFutureEffective = (state: any, isFutureEffective: boolean) => {
  state.stateModel.incorporationDateTime.isFutureEffective = isFutureEffective
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateEffectiveDate = (state: any, effectiveDate: Date) => {
  state.stateModel.incorporationDateTime.effectiveDate = effectiveDate
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateIsIncorporationDateTimeValid = (state: any, incorporationDateTimeValid: boolean) => {
  state.stateModel.incorporationDateTime.valid = incorporationDateTimeValid
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateCertifyState = (state: any, certifyState: CertifyIF) => {
  state.stateModel.certifyState = certifyState
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateBusinessContact = (state: any, businessContact: BusinessContactIF) => {
  state.stateModel.defineCompanyStep.businessContact = businessContact
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateDefineCompanyStepValidity = (state: any, validity: boolean) => {
  state.stateModel.defineCompanyStep.valid = validity
}

export const mutateDefineCompanyStepChanged = (state: any, changed: boolean) => {
  state.stateModel.defineCompanyStep.changed = changed
}

export const mutateOfficeAddresses = (state: any, addresses: IncorporationAddressIf) => {
  state.stateModel.defineCompanyStep.officeAddresses = addresses
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutatePeopleAndRoles = (state: any, orgPeople: OrgPersonIF[]) => {
  state.stateModel.peopleAndRoles.orgPeople = orgPeople
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutatePeopleAndRolesChanged = (state: any, changed: boolean) => {
  state.stateModel.peopleAndRoles.changed = changed
}

export const mutatePeopleAndRolesValid = (state: any, valid: boolean) => {
  state.stateModel.peopleAndRoles.valid = valid
}

export const mutateFolioNumber = (state: any, folioNumber: string) => {
  state.stateModel.defineCompanyStep.folioNumber = folioNumber
}

export const mutateFilingDate = (state: any, filingDate: string) => {
  state.stateModel.tombstone.filingDate = filingDate
}

export const mutateAccountInformation = (state: any, accountInformation: AccountInformationIF) => {
  state.stateModel.accountInformation = accountInformation
}

export const mutateBusinessInformation = (state: any, businessInformation: BusinessInformationIF) => {
  state.stateModel.businessInformation = businessInformation
}

export const mutateNameRequest = (state: any, nameRequest: NameRequestIF) => {
  state.stateModel.nameRequest = nameRequest
}

export const mutateNameTranslations = (state: any, nameTranslations: Array<string>) => {
  state.stateModel.nameTranslations = nameTranslations
}

export const mutateFilingId = (state: any, filingId: number) => {
  state.stateModel.tombstone.filingId = filingId
}

export const mutateCorrectedFilingId = (state: any, correctedFilingId: number) => {
  state.stateModel.tombstone.correctedFilingId = correctedFilingId
}

export const mutateShareClasses = (state: any, shareClasses: ShareClassIF[]) => {
  state.stateModel.createShareStructureStep.shareClasses = shareClasses
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateCreateShareStructureStepValidity = (state: any, validity: boolean) => {
  state.stateModel.createShareStructureStep.valid = validity
}

export const mutateIncorporationAgreementStepData = (state: any, stepData: IncorporationAgreementIF) => {
  state.stateModel.incorporationAgreementStep = stepData
  if (!state.stateModel.tombstone.ignoreChanges) mutateHaveChanges(state, true)
}

export const mutateIgnoreChanges = (state: any, ignoreChanges: boolean) => {
  state.stateModel.tombstone.ignoreChanges = ignoreChanges
}

export const mutateHaveChanges = (state: any, haveChanges: boolean) => {
  state.stateModel.tombstone.haveChanges = haveChanges
}

export const mutateHaveCorrection = (state: any, haveCorrection: boolean) => {
  state.stateModel.tombstone.haveCorrection = haveCorrection
}

export const mutateEntityType = (state: any, entityType: EntityTypes) => {
  state.stateModel.tombstone.entityType = entityType
}

export const mutateOriginalIA = (state: any, originalIa: IncorporationFilingIF) => {
  state.stateModel.originalIA = originalIa
}

export const mutateStaffPayment = (state: any, staffPayment: StaffPaymentIF) => {
  state.stateModel.staffPayment = staffPayment
}

export const mutateStaffPaymentValidity = (state: any, staffPaymentValidity: boolean) => {
  state.stateModel.staffPaymentValidity = staffPaymentValidity
}

export const mutateFilingData = (state: any, filingData: FilingDataIF) => {
  state.stateModel.filingData = filingData
}
