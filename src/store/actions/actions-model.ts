import { ActionIF, ActionKvIF, AddressesIF, BusinessInformationIF, CertifyIF, EntitySnapshotIF,
  NameRequestIF, NameTranslationIF, OrgPersonIF, ShareClassIF, FeesIF, ResourceIF, FilingDataIF,
  CorrectionInformationIF, CreateResolutionIF } from '@/interfaces/'
import { CompletingPartyIF, ContactPointIF, NaicsIF } from '@bcrs-shared-components/interfaces/'
import { FilingTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

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

export const setOrgInfo: ActionIF = ({ commit }, orgInfo): void => {
  commit('mutateOrgInfo', orgInfo)
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

export const setResource: ActionIF = ({ commit }, resource: ResourceIF): void => {
  commit('mutateResource', resource)
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

export const setCompletingParty: ActionIF = ({ commit }, cp: CompletingPartyIF): void => {
  commit('mutateCompletingParty', cp)
}

export const setCompletingPartyValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateCompletingPartyValidity', validity)
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

export const setOfficeAddresses: ActionIF = ({ commit }, addresses: AddressesIF): void => {
  commit('mutateOfficeAddresses', addresses)
}

export const setFolioNumber: ActionIF = ({ commit }, folioNumber: string): void => {
  commit('mutateFolioNumber', folioNumber)
}

export const setAccountInformation: ActionIF = ({ commit }, accountInformation): void => {
  commit('mutateAccountInformation', accountInformation)
}

export const setBusinessInformation: ActionIF = ({ commit }, businessInformation: BusinessInformationIF): void => {
  commit('mutateBusinessInformation', businessInformation)
}

export const setCorrectionInformation: ActionIF = ({ commit }, correctionInformation: CorrectionInformationIF)
: void => {
  commit('mutateCorrectionInformation', correctionInformation)
}

export const setCorrectionStartDate: ActionIF = ({ commit }, startDate: string): void => {
  commit('mutateCorrectionStartDate', startDate)
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

export const setIgnoreChanges: ActionIF = ({ commit }, ignoreChanges: boolean): void => {
  commit('mutateIgnoreChanges', ignoreChanges)
}

export const setHaveUnsavedChanges: ActionIF = ({ commit }, haveUnsavedChanges: boolean): void => {
  commit('mutateHaveUnsavedChanges', haveUnsavedChanges)
}

export const setEntitySnapshot: ActionIF = ({ commit }, entitySnapshot: EntitySnapshotIF): void => {
  commit('mutateEntitySnapshot', entitySnapshot)
}

export const setStaffPayment: ActionIF = ({ commit }, staffPayment): void => {
  commit('mutateStaffPayment', staffPayment)
}

export const setStaffPaymentValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateStaffPaymentValidity', validity)
}

export const setFilingData: ActionIF = ({ commit }, filingData: FilingDataIF[]): void => {
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

export const setSummaryMode: ActionIF = ({ commit }, summaryMode: boolean): void => {
  commit('mutateSummaryMode', summaryMode)
}

export const setFilingType: ActionIF = ({ commit }, filingType: FilingTypes): void => {
  commit('mutateFilingType', filingType)
}

export const setProvisionsRemoved: ActionIF = ({ commit }, provisionsRemoved: boolean): void => {
  commit('mutateProvisionsRemoved', provisionsRemoved)
}

export const setNewResolutionDates: ActionIF = ({ commit }, resolutionDates: string[]): void => {
  commit('mutateNewResolutionDates', resolutionDates)
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

export const setCurrentFees: ActionIF = ({ commit }, fees: FeesIF[]): void => {
  commit('mutateCurrentFees', fees)
}

export const setFeePrices: ActionIF = ({ commit }, feePrices: FeesIF[]): void => {
  commit('mutateFeePrices', feePrices)
}

export const setValidComponent: ActionIF = ({ commit }, kv: ActionKvIF): void => {
  commit('mutateIsValidComponent', kv)
}

export const setNaics: ActionIF = ({ commit }, naics: NaicsIF): void => {
  commit('mutateNaics', naics)
}

export const setResolution = ({ commit }, resolution: CreateResolutionIF) => {
  commit('mutateResolution', resolution)
}

export const setSpecialResolutionConfirmStateValidity: ActionIF = ({ commit }, validity: boolean): void => {
  commit('mutateSpecialResolutionConfirmStateValidity', validity)
}

export const setCorrectionResolutionDate: ActionIF = ({ commit }, resolutionDate: string): void => {
  commit('mutateCorrectionResolutionDate', resolutionDate)
}
