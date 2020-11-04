import { ActionIF } from '@/interfaces/store-interfaces/action-interface'

export const setEntityType: ActionIF = ({ commit }, entityType): void => {
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

export const setCurrentDate: ActionIF = ({ commit }, currentDate): void => {
  commit('mutateCurrentDate', currentDate)
}

export const setIsFutureEffective: ActionIF = ({ commit }, isFutureEffective): void => {
  commit('mutateIsFutureEffective', isFutureEffective)
}

export const setEffectiveDate: ActionIF = ({ commit }, effectiveDate): void => {
  commit('mutateEffectiveDate', effectiveDate)
}

export const setIsIncorporationDateTimeValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateIsIncorporationDateTimeValidity', validity)
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

export const setDefineCompanyStepValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateDefineCompanyStepValidity', validity)
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

export const setIgnoreChanges: ActionIF = ({ commit }, ignoreChanges): void => {
  commit('mutateIgnoreChanges', ignoreChanges)
}

export const setHaveChanges: ActionIF = ({ commit }, haveChanges): void => {
  commit('mutateHaveChanges', haveChanges)
}

export const setOriginalIA: ActionIF = ({ commit }, originalIA): void => {
  commit('mutateOriginalIA', originalIA)
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

export const setCompanyNameEditing: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateCompanyNameEditing', editing)
}

export const setNameTranslationsEditing: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateNameTranslationsEditing', editing)
}

export const setOfficeAddressesEditing: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateOfficeAddressesEditing', editing)
}

export const setPeopleAndRolesEditing: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutatePeopleAndRolesEditing', editing)
}

export const setShareStructureEditing: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateShareStructureEditing', editing)
}

export const setIncorporationAgreementValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateIncorporationAgreementValidity', validity)
}

export const setIncorporationAgreementEditing: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateIncorporationAgreementEditing', editing)
}
