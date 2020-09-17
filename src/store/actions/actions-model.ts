import { ActionIF } from '@/interfaces/store-interfaces/action-interface'

export const setEntityType = ({ commit }, entityType): void => {
  commit('mutateEntityType', entityType)
}

export const setBusinessId = ({ commit }, businessId): void => {
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

export const setCurrentDate: ActionIF = ({ commit }, currentDate): void => {
  commit('mutateCurrentDate', currentDate)
}

export const setIsFutureEffective: ActionIF = ({ commit }, isFutureEffective): void => {
  commit('mutateIsFutureEffective', isFutureEffective)
}

export const setEffectiveDate: ActionIF = ({ commit }, effectiveDate): void => {
  commit('mutateEffectiveDate', effectiveDate)
}

export const setIsIncorporationDateTimeValid: ActionIF = ({ commit }, incorporationDateTimeValid): void => {
  commit('mutateIsIncorporationDateTimeValid', incorporationDateTimeValid)
}

export const setCertifyStatementResource: ActionIF = ({ commit }, certifyStatementResource): void => {
  commit('mutateCertifyStatementResource', certifyStatementResource)
}

export const setCertifyState: ActionIF = ({ commit }, certifyState): void => {
  commit('mutateCertifyState', certifyState)
}

export const setBusinessContact: ActionIF = ({ commit }, businessContact): void => {
  commit('mutateBusinessContact', businessContact)
}

export const setDefineCompanyStepValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateDefineCompanyStepValidity', validity)
}

export const setOfficeAddresses: ActionIF = ({ commit }, address): void => {
  commit('mutateOfficeAddresses', address)
}

export const setFolioNumber: ActionIF = ({ commit }, folioNumber): void => {
  commit('mutateFolioNumber', folioNumber)
}

export const setFilingDate: ActionIF = ({ commit }, filingDate): void => {
  commit('mutateFilingDate', filingDate)
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

export const setFilingId: ActionIF = ({ commit }, filingId): void => {
  commit('mutateFilingId', filingId)
}

export const setCorrectedFilingId: ActionIF = ({ commit }, correctedFilingId): void => {
  commit('mutateCorrectedFilingId', correctedFilingId)
}

export const setPeopleAndRoles = ({ commit }, orgPeople) => {
  commit('mutatePeopleAndRoles', orgPeople)
}

export const setPeopleAndRoleStepChanged = ({ commit }, validity) => {
  commit('mutatePeopleAndRoleStepChanged', validity)
}

export const setPeopleAndRoleStepValidity = ({ commit }, validity) => {
  commit('mutatePeopleAndRoleStepValidity', validity)
}

export const setShareClasses = ({ commit }, shareClasses) => {
  commit('mutateShareClasses', shareClasses)
}

export const setCreateShareStructureStepValidity = ({ commit }, validity) => {
  commit('mutateCreateShareStructureStepValidity', validity)
}

export const setIncorporationAgreementStepData: ActionIF = ({ commit }, stepData): void => {
  commit('mutateIncorporationAgreementStepData', stepData)
}

export const setIgnoreChanges: ActionIF = ({ commit }, ignoreChanges): void => {
  commit('mutateIgnoreChanges', ignoreChanges)
}

export const setHaveChanges: ActionIF = ({ commit }, haveChanges): void => {
  commit('mutateHaveChanges', haveChanges)
}

export const setHaveCorrection: ActionIF = ({ commit }, haveCorrection): void => {
  commit('mutateHaveCorrection', haveCorrection)
}

export const setOriginalIA: ActionIF = ({ commit }, originalIA): void => {
  commit('mutateOriginalIA', originalIA)
}

export const setStaffPayment: ActionIF = ({ commit }, staffPayment): void => {
  commit('mutateStaffPayment', staffPayment)
}
