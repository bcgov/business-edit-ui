import { ActionIF } from '@/interfaces/store-interfaces/action-interface'
import { EntityTypes } from '@/enums'

export const setEntityType: ActionIF = ({ commit }, entityType: EntityTypes): void => {
  commit('mutateEntityType', entityType)
}

export const setBusinessId: ActionIF = ({ commit }, businessId): void => {
  commit('mutateBusinessId', businessId)
}

export const setIsSaving: ActionIF = ({ commit }, isSaving): void => {
  commit('mutateIsSaving', isSaving)
}

export const setIsSavingResuming: ActionIF = ({ commit }, isSavingResuming): void => {
  commit('mutateIsSavingResuming', isSavingResuming)
}

export const setIsFilingPaying: ActionIF = ({ commit }, isFilingPaying): void => {
  commit('mutateIsFilingPaying', isFilingPaying)
}

export const setKeycloakRoles: ActionIF = ({ commit }, keycloakRoles): void => {
  commit('mutateKeycloakRoles', keycloakRoles)
}

export const setAuthRoles: ActionIF = ({ commit }, authRoles): void => {
  commit('mutateAuthRoles', authRoles)
}

export const setUserInfo: ActionIF = ({ commit }, userInfo): void => {
  commit('mutateUserInfo', userInfo)
}

export const setCurrentDate: ActionIF = ({ commit }, dateString: string): void => {
  commit('mutateCurrentDate', dateString)
}

export const setCurrentJsDate: ActionIF = ({ commit }, date: Date): void => {
  commit('mutateCurrentJsDate', date)
}

export const setIsFutureEffective: ActionIF = ({ commit }, isFutureEffective: boolean): void => {
  commit('mutateIsFutureEffective', isFutureEffective)
}

export const setEffectiveDateTimeString: ActionIF = ({ commit }, dateTimeString: string): void => {
  commit('mutateEffectiveDateTimeString', dateTimeString)
}

export const setEffectiveDateValid: ActionIF = ({ commit }, valid: boolean): void => {
  commit('mutateEffectiveDateValid', valid)
}

export const setCertifyStatementResource: ActionIF = ({ commit }, certifyStatementResource): void => {
  commit('mutateCertifyStatementResource', certifyStatementResource)
}

export const setCertifyState: ActionIF = ({ commit }, certifyState): void => {
  commit('mutateCertifyState', certifyState)
}

export const setCertifyStateValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateCertifyStateValidity', validity)
}

export const setBusinessContact: ActionIF = ({ commit }, businessContact): void => {
  commit('mutateBusinessContact', businessContact)
}

export const setDefineCompanyStepChanged: ActionIF = ({ commit }, changed: boolean): void => {
  commit('mutateDefineCompanyStepChanged', changed)
}

export const setOfficeAddresses: ActionIF = ({ commit }, address): void => {
  commit('mutateOfficeAddresses', address)
}

export const setFolioNumber: ActionIF = ({ commit }, folioNumber): void => {
  commit('mutateFolioNumber', folioNumber)
}

export const setFilingDateTime: ActionIF = ({ commit }, dateTimeString): void => {
  commit('mutateFilingDateTime', dateTimeString)
}

export const setAccountInformation: ActionIF = ({ commit }, accountInformation): void => {
  commit('mutateAccountInformation', accountInformation)
}

export const setBusinessInformation: ActionIF = ({ commit }, businessInformation): void => {
  commit('mutateBusinessInformation', businessInformation)
}

export const setNameRequest: ActionIF = ({ commit }, nameRequest): void => {
  commit('mutateNameRequest', nameRequest)
}

export const setNameTranslations: ActionIF = ({ commit }, nameTranslations): void => {
  commit('mutateNameTranslations', nameTranslations)
}

export const setFilingId: ActionIF = ({ commit }, filingId: number): void => {
  commit('mutateFilingId', filingId)
}

export const setCorrectedFilingId: ActionIF = ({ commit }, correctedFilingId: number): void => {
  commit('mutateCorrectedFilingId', correctedFilingId)
}

export const setPeopleAndRoles: ActionIF = ({ commit }, peopleAndRoles) => {
  commit('mutatePeopleAndRoles', peopleAndRoles)
}

export const setPeopleAndRolesChanged: ActionIF = ({ commit }, changed: boolean) => {
  commit('mutatePeopleAndRolesChanged', changed)
}

export const setPeopleAndRolesValidity: ActionIF = ({ commit }, validity: boolean) => {
  commit('mutatePeopleAndRolesValidity', validity)
}

export const setShareClasses: ActionIF = ({ commit }, shareClasses) => {
  commit('mutateShareClasses', shareClasses)
}

export const setShareStructureChanged: ActionIF = ({ commit }, changed: boolean) => {
  commit('mutateShareStructureChanged', changed)
}

export const setCreateShareStructureStepValidity: ActionIF = ({ commit }, validity: boolean) => {
  commit('mutateCreateShareStructureStepValidity', validity)
}

export const setIncorporationAgreementStepData: ActionIF = ({ commit }, stepData): void => {
  commit('mutateIncorporationAgreementStepData', stepData)
}

export const setIncorporationAgreementValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateIncorporationAgreementValidity', validity)
}

export const setIgnoreChanges: ActionIF = ({ commit }, ignoreChanges): void => {
  commit('mutateIgnoreChanges', ignoreChanges)
}

export const setHaveChanges: ActionIF = ({ commit }, haveChanges): void => {
  commit('mutateHaveChanges', haveChanges)
}

export const setOriginalIA: ActionIF = ({ commit }, originalIA): void => {
  commit('mutateOriginalIA', originalIA)
}

export const setOriginalSnapshot: ActionIF = ({ commit }, originalSnapshot): void => {
  commit('mutateOriginalSnapshot', originalSnapshot)
}

export const setStaffPayment: ActionIF = ({ commit }, staffPayment): void => {
  commit('mutateStaffPayment', staffPayment)
}

export const setStaffPaymentValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateStaffPaymentValidity', validity)
}

export const setFilingData: ActionIF = ({ commit }, filingData): void => {
  commit('mutateFilingData', filingData)
}

export const setDetailComment: ActionIF = ({ commit }, comment): void => {
  commit('mutateDetailComment', comment)
}

export const setDetailValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateDetailValidity', validity)
}

export const setEditingCompanyName: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateEditingCompanyName', editing)
}

export const setEditingNameTranslations: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateEditingNameTranslations', editing)
}

export const setEditingOfficeAddresses: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateEditingOfficeAddresses', editing)
}

export const setEditingPeopleAndRoles: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateEditingPeopleAndRoles', editing)
}

export const setEditingShareStructure: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateEditingShareStructure', editing)
}

export const setEditingIncorporationAgreement: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateEditingIncorporationAgreement', editing)
}

export const setSummaryMode: ActionIF = ({ commit }, summaryMode: boolean): void => {
  commit('mutateSummaryMode', summaryMode)
}
