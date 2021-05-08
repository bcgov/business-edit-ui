import {
  ActionIF,
  ActionKvIF,
  BusinessInformationIF,
  BusinessSnapshotIF,
  CertifyIF,
  IncorporationAddressIf,
  NameRequestIF,
  NameTranslationIF,
  OrgPersonIF,
  ShareClassIF,
  FeesIF
} from '@/interfaces'
import { ContactPointIF } from '@bcrs-shared-components/interfaces'
import { CorpTypeCd, FilingTypes } from '@/enums'

export const setEntityType: ActionIF = ({ commit }, entityType: CorpTypeCd): void => {
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

export const setEffectiveDateTimeString: ActionIF = ({ commit }, dateTime: string): void => {
  commit('mutateEffectiveDateTimeString', dateTime)
}

export const setEffectiveDateValid: ActionIF = ({ commit }, valid: boolean): void => {
  commit('mutateEffectiveDateValid', valid)
}

export const setCertifyStatementResource: ActionIF = ({ commit }, certifyStatementResource): void => {
  commit('mutateCertifyStatementResource', certifyStatementResource)
}

export const setCertifyState: ActionIF = ({ commit }, certifyState: CertifyIF): void => {
  commit('mutateCertifyState', certifyState)
}

export const setCertifyStateValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateCertifyStateValidity', validity)
}

export const setDocumentOptionalEmail: ActionIF = ({ commit }, documentOptionalEmail: string): void => {
  commit('mutateDocumentOptionalEmail', documentOptionalEmail)
}

export const setDocumentOptionalEmailValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateDocumentOptionalEmailValidity', validity)
}

export const setTransactionalFolioNumber: ActionIF = ({ commit }, folioNumber: string): void => {
  commit('mutateTransactionalFolioNumber', folioNumber)
}

export const setTransactionalFolioNumberValidity: ActionIF = ({ commit }, validity): void => {
  commit('mutateTransactionalFolioNumberValidity', validity)
}

export const setBusinessContact: ActionIF = ({ commit }, businessContact: ContactPointIF): void => {
  commit('mutateBusinessContact', businessContact)
}

export const setDefineCompanyStepChanged: ActionIF = ({ commit }, changed: boolean): void => {
  commit('mutateDefineCompanyStepChanged', changed)
}

export const setOfficeAddresses: ActionIF = ({ commit }, address: IncorporationAddressIf): void => {
  commit('mutateOfficeAddresses', address)
}

export const setFolioNumber: ActionIF = ({ commit }, folioNumber: string): void => {
  commit('mutateFolioNumber', folioNumber)
}

export const setFilingDateTime: ActionIF = ({ commit }, dateTime: string): void => {
  commit('mutateFilingDateTime', dateTime)
}

export const setAccountInformation: ActionIF = ({ commit }, accountInformation): void => {
  commit('mutateAccountInformation', accountInformation)
}

export const setBusinessInformation: ActionIF = ({ commit }, businessInformation: BusinessInformationIF): void => {
  commit('mutateBusinessInformation', businessInformation)
}

export const setNameRequest: ActionIF = ({ commit }, nameRequest: NameRequestIF): void => {
  commit('mutateNameRequest', nameRequest)
}

export const setNameTranslations: ActionIF = ({ commit }, nameTranslations: NameTranslationIF[]): void => {
  commit('mutateNameTranslations', nameTranslations)
}

export const setFilingId: ActionIF = ({ commit }, filingId: number): void => {
  commit('mutateFilingId', filingId)
}

export const setCorrectedFilingId: ActionIF = ({ commit }, correctedFilingId: number): void => {
  commit('mutateCorrectedFilingId', correctedFilingId)
}

export const setPeopleAndRoles: ActionIF = ({ commit }, peopleAndRoles: OrgPersonIF[]) => {
  commit('mutatePeopleAndRoles', peopleAndRoles)
}

export const setPeopleAndRolesChanged: ActionIF = ({ commit }, changed: boolean) => {
  commit('mutatePeopleAndRolesChanged', changed)
}

export const setPeopleAndRolesValidity: ActionIF = ({ commit }, validity: boolean) => {
  commit('mutatePeopleAndRolesValidity', validity)
}

export const setShareClasses: ActionIF = ({ commit }, shareClasses: ShareClassIF[]) => {
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

export const setIgnoreChanges: ActionIF = ({ commit }, ignoreChanges: boolean): void => {
  commit('mutateIgnoreChanges', ignoreChanges)
}

export const setHaveUnsavedChanges: ActionIF = ({ commit }, haveUnsavedChanges: boolean): void => {
  commit('mutateHaveUnsavedChanges', haveUnsavedChanges)
}

export const setOriginalIA: ActionIF = ({ commit }, originalIA): void => {
  commit('mutateOriginalIA', originalIA)
}

export const setBusinessSnapshot: ActionIF = ({ commit }, businessSnapshot: BusinessSnapshotIF): void => {
  commit('mutateBusinessSnapshot', businessSnapshot)
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

export const setDetailComment: ActionIF = ({ commit }, comment: string): void => {
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

export const setEditingFolioNumber: ActionIF = ({ commit }, editing: boolean): void => {
  commit('mutateEditingFolioNumber', editing)
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

export const setFilingType: ActionIF = ({ commit }, filingType: FilingTypes): void => {
  commit('mutateFilingType', filingType)
}

export const setProvisionsRemoved: ActionIF = ({ commit }, provisionsRemoved: boolean): void => {
  commit('mutateProvisionsRemoved', provisionsRemoved)
}

export const setOriginalResolutionDates: ActionIF = ({ commit }, resolutionDates: string[]): void => {
  commit('mutateOriginalResolutionDates', resolutionDates)
}

export const setResolutionDates: ActionIF = ({ commit }, resolutionDates: string[]): void => {
  commit('mutateResolutionDates', resolutionDates)
}

export const setFileNumber: ActionIF = ({ commit }, courtOrderNumber: string): void => {
  commit('mutateFileNumber', courtOrderNumber)
}

export const setHasPlanOfArrangement: ActionIF = ({ commit }, hasPoa: boolean): void => {
  commit('mutateHasPlanOfArrangement', hasPoa)
}

export const setAppValidate: ActionIF = ({ commit }, validate: boolean): void => {
  commit('mutateAppValidate', validate)
}

export const setComponentValidate: ActionIF = ({ commit }, validate: boolean): void => {
  commit('mutateComponentValidate', validate)
}

export const setValidCourtOrder: ActionIF = ({ commit }, isValid: boolean): void => {
  commit('mutateValidCourtOrder', isValid)
}

export const setCurrentFees: ActionIF = ({ commit }, fees: FeesIF): void => {
  commit('mutateCurrentFees', fees)
}

export const setFeePrices: ActionIF = ({ commit }, feePrices: FeesIF): void => {
  commit('mutateFeePrices', feePrices)
}

export const setValidComponent: ActionIF = ({ commit }, kv: ActionKvIF): void => {
  commit('mutateIsValidComponent', kv)
}
