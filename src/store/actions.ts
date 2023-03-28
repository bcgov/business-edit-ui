import { ActionKvIF, AddressesIF, BusinessInformationIF, CertifyIF, CourtOrderIF, EntitySnapshotIF,
  NameRequestIF, NameTranslationIF, OrgPersonIF, FeesIF, ResourceIF, FilingDataIF,
  CorrectionInformationIF } from '@/interfaces/'
import { CompletingPartyIF, ContactPointIF,
  NaicsIF, ShareClassIF, SpecialResolutionIF } from '@bcrs-shared-components/interfaces/'
import { ApprovalTypes, FilingTypes, RestorationTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { LegalServices } from '@/services'

export default {
  setEntityType ({ commit }, entityType: CorpTypeCd) {
    commit('mutateEntityType', entityType)
  },

  setBusinessId ({ commit }, businessId) {
    commit('mutateBusinessId', businessId)
  },

  setIsSaving ({ commit }, isSaving) {
    commit('mutateIsSaving', isSaving)
  },

  setIsSavingResuming ({ commit }, isSavingResuming) {
    commit('mutateIsSavingResuming', isSavingResuming)
  },

  setIsFilingPaying ({ commit }, isFilingPaying) {
    commit('mutateIsFilingPaying', isFilingPaying)
  },

  setKeycloakRoles ({ commit }, keycloakRoles) {
    commit('mutateKeycloakRoles', keycloakRoles)
  },

  setAuthRoles ({ commit }, authRoles) {
    commit('mutateAuthRoles', authRoles)
  },

  setUserInfo ({ commit }, userInfo) {
    commit('mutateUserInfo', userInfo)
  },

  setOrgInfo ({ commit }, orgInfo) {
    commit('mutateOrgInfo', orgInfo)
  },

  setCurrentDate ({ commit }, dateString: string) {
    commit('mutateCurrentDate', dateString)
  },

  setCurrentJsDate ({ commit }, date: Date) {
    commit('mutateCurrentJsDate', date)
  },

  setIsFutureEffective (context, isFutureEffective: boolean) {
    context.commit('mutateIsFutureEffective', isFutureEffective)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setEffectiveDateTimeString (context, dateTime: string) {
    context.commit('mutateEffectiveDateTimeString', dateTime)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setEffectiveDateValid ({ commit }, valid: boolean) {
    commit('mutateEffectiveDateValid', valid)
  },

  setResource ({ commit }, resource: ResourceIF) {
    commit('mutateResource', resource)
  },

  setCertifyState (context, certifyState: CertifyIF) {
    context.commit('mutateCertifyState', certifyState)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setCertifyStateValidity ({ commit }, validity) {
    commit('mutateCertifyStateValidity', validity)
  },

  setDocumentOptionalEmail (context, documentOptionalEmail: string) {
    context.commit('mutateDocumentOptionalEmail', documentOptionalEmail)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setDocumentOptionalEmailValidity ({ commit }, validity) {
    commit('mutateDocumentOptionalEmailValidity', validity)
  },

  setCompletingParty (context, cp: CompletingPartyIF) {
    context.commit('mutateCompletingParty', cp)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setCompletingPartyValidity ({ commit }, validity: boolean) {
    commit('mutateCompletingPartyValidity', validity)
  },

  setTransactionalFolioNumber (context, folioNumber: string) {
    context.commit('mutateTransactionalFolioNumber', folioNumber)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setTransactionalFolioNumberValidity ({ commit }, validity) {
    commit('mutateTransactionalFolioNumberValidity', validity)
  },

  setBusinessContact ({ commit }, businessContact: ContactPointIF) {
    commit('mutateBusinessContact', businessContact)
  },

  setOfficeAddresses (context, addresses: AddressesIF) {
    context.commit('mutateOfficeAddresses', addresses)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setFolioNumber ({ commit }, folioNumber: string) {
    commit('mutateFolioNumber', folioNumber)
  },

  setAccountInformation ({ commit }, accountInformation) {
    commit('mutateAccountInformation', accountInformation)
  },

  setBusinessInformation ({ commit }, businessInformation: BusinessInformationIF) {
    commit('mutateBusinessInformation', businessInformation)
  },

  setCorrectionInformation ({ commit }, correctionInformation: CorrectionInformationIF) {
    commit('mutateCorrectionInformation', correctionInformation)
  },

  setCorrectionStartDate ({ commit }, startDate: string) {
    commit('mutateCorrectionStartDate', startDate)
  },

  setNameRequest (context, nameRequest: NameRequestIF) {
    context.commit('mutateNameRequest', nameRequest)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setNameTranslations (context, nameTranslations: NameTranslationIF[]) {
    context.commit('mutateNameTranslations', nameTranslations)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setFilingId ({ commit }, filingId: number) {
    commit('mutateFilingId', filingId)
  },

  setPeopleAndRoles (context, peopleAndRoles: OrgPersonIF[]) {
    context.commit('mutatePeopleAndRoles', peopleAndRoles)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setPeopleAndRolesChanged ({ commit }, changed: boolean) {
    commit('mutatePeopleAndRolesChanged', changed)
  },

  setPeopleAndRolesValidity ({ commit }, validity: boolean) {
    commit('mutatePeopleAndRolesValidity', validity)
  },

  setShareClasses (context, shareClasses: ShareClassIF[]) {
    context.commit('mutateShareClasses', shareClasses)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setShareStructureChanged ({ commit }, changed: boolean) {
    commit('mutateShareStructureChanged', changed)
  },

  setCreateShareStructureStepValidity ({ commit }, validity: boolean) {
    commit('mutateCreateShareStructureStepValidity', validity)
  },

  setIgnoreChanges ({ commit }, ignoreChanges: boolean) {
    commit('mutateIgnoreChanges', ignoreChanges)
  },

  setHaveUnsavedChanges ({ commit }, haveUnsavedChanges: boolean) {
    commit('mutateHaveUnsavedChanges', haveUnsavedChanges)
  },

  setEntitySnapshot ({ commit }, entitySnapshot: EntitySnapshotIF) {
    commit('mutateEntitySnapshot', entitySnapshot)
  },

  setStaffPayment (context, staffPayment) {
    context.commit('mutateStaffPayment', staffPayment)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setStaffPaymentValidity ({ commit }, validity: boolean) {
    commit('mutateStaffPaymentValidity', validity)
  },

  setFilingData ({ commit }, filingData: FilingDataIF[]) {
    commit('mutateFilingData', filingData)
  },

  setDetailComment ({ commit }, comment: string) {
    commit('mutateDetailComment', comment)
  },

  setDetailValidity ({ commit }, validity: boolean) {
    commit('mutateDetailValidity', validity)
  },

  setEditingCompanyName ({ commit }, editing: boolean) {
    commit('mutateEditingCompanyName', editing)
  },

  setEditingNameTranslations ({ commit }, editing: boolean) {
    commit('mutateEditingNameTranslations', editing)
  },

  setEditingOfficeAddresses ({ commit }, editing: boolean) {
    commit('mutateEditingOfficeAddresses', editing)
  },

  setEditingFolioNumber ({ commit }, editing: boolean) {
    commit('mutateEditingFolioNumber', editing)
  },

  setEditingPeopleAndRoles ({ commit }, editing: boolean) {
    commit('mutateEditingPeopleAndRoles', editing)
  },

  setEditingShareStructure ({ commit }, editing: boolean) {
    commit('mutateEditingShareStructure', editing)
  },

  setSummaryMode ({ commit }, summaryMode: boolean) {
    commit('mutateSummaryMode', summaryMode)
  },

  setFilingType ({ commit }, filingType: FilingTypes) {
    commit('mutateFilingType', filingType)
  },

  setProvisionsRemoved ({ commit }, provisionsRemoved: boolean) {
    commit('mutateProvisionsRemoved', provisionsRemoved)
  },

  setNewResolutionDates (context, resolutionDates: string[]) {
    context.commit('mutateSpecialResolutionDates', resolutionDates)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setFileNumber ({ commit }, courtOrderNumber: string) {
    commit('mutateFileNumber', courtOrderNumber)
  },

  setHasPlanOfArrangement ({ commit }, hasPoa: boolean) {
    commit('mutateHasPlanOfArrangement', hasPoa)
  },

  setAppValidate ({ commit }, validate: boolean) {
    commit('mutateAppValidate', validate)
  },

  setComponentValidate ({ commit }, validate: boolean) {
    commit('mutateComponentValidate', validate)
  },

  setValidCourtOrder ({ commit }, isValid: boolean) {
    commit('mutateValidCourtOrder', isValid)
  },

  setCurrentFees ({ commit }, fees: FeesIF[]) {
    commit('mutateCurrentFees', fees)
  },

  setFeePrices ({ commit }, feePrices: FeesIF[]) {
    commit('mutateFeePrices', feePrices)
  },

  setValidComponent ({ commit }, kv: ActionKvIF) {
    commit('mutateIsValidComponent', kv)
  },

  setNaics (context, naics: NaicsIF) {
    context.commit('mutateNaics', naics)
    if (!context.getters.ignoreChanges) context.commit('mutateHaveUnsavedChanges', true)
  },

  setSpecialResolution ({ commit }, specialResolution: SpecialResolutionIF) {
    commit('mutateSpecialResolution', specialResolution)
  },

  setSpecialResolutionConfirmStateValidity ({ commit }, validity: boolean) {
    commit('mutateSpecialResolutionConfirmStateValidity', validity)
  },

  setStateFilingRestoration (context): Promise<any> {
    return new Promise((resolve, reject) => {
      LegalServices.fetchFiling(context.getters.getStateFilingUrl)
        .then((response) => {
          const stateFilingRestoration = response.restoration
          // commit data to store
          context.commit('mutateStateFilingRestoration', stateFilingRestoration)
          // return the state filing restoration object
          resolve(stateFilingRestoration)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
