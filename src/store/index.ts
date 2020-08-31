// Libraries
import Vue from 'vue'
import Vuex from 'vuex'

// State
import { stateModel, resourceModel } from './state'

// Getters
import {
  isRoleStaff, isAuthEdit, isAuthView, getEntityType, isEntityType, isPremiumAccount, isTypeBcomp, isTypeCoop,
  isEnableFilePayBtn, isBusySaving,
  getFilingId, getBusinessId, isNamedBusiness, getNameRequestNumber, getApprovedName, getAccountId,
  getFolioNumber, getNameRequestDetails, getNameRequestApplicant, getOfficeAddresses, getFilingDate, getUserEmail,
  isApplicationValid, getCurrentDate, ignoreChanges, haveChanges, getNameTranslations, getOrgPeople
} from '@/store/getters'

// Mutations
import {
  mutateIsSaving, mutateIsSavingResuming, mutateIsFilingPaying,
  mutateKeycloakRoles, mutateAuthRoles, mutateUserEmail, mutateCurrentDate, mutateFolioNumber, mutateFilingDate,
  mutateCertifyStatementResource, mutateCertifyState, mutateBusinessContact, mutateDefineCompanyStepValidity,
  mutateAccountInformation, mutateNameRequest, mutateFilingId, mutateOfficeAddresses, mutateOrgPersonList,
  mutateAddPeopleAndRoleStepValidity, mutateShareClasses, mutateCreateShareStructureStepValidity,
  mutateIgnoreChanges, mutateHaveChanges, mutateIsFutureEffective, mutateEffectiveDate,
  mutateIsIncorporationDateTimeValid, mutateBusinessId, mutateIncorporationAgreementStepData, mutateEntityType,
  mutateNameTranslations, mutateBusinessInformation
} from '@/store/mutations'

// Setters
import {
  setIsSaving, setIsSavingResuming, setIsFilingPaying,
  setKeycloakRoles, setAuthRoles, setUserEmail, setCurrentDate, setCertifyStatementResource, setCertifyState,
  setBusinessContact, setDefineCompanyStepValidity, setNameRequest, setFilingId, setFolioNumber, setFilingDate,
  setOfficeAddresses, setOrgPersonList, setAddPeopleAndRoleStepValidity, setShareClasses,
  setCreateShareStructureStepValidity, setIgnoreChanges, setHaveChanges, setIsFutureEffective,
  setEffectiveDate, setIsIncorporationDateTimeValid, setAccountInformation, setBusinessId, setEntityType,
  setIncorporationAgreementStepData, setNameTranslations, setBusinessInformation
} from './actions'

/**
 * Configures and returns Vuex Store.
 */
export function getVuexStore () {
  Vue.use(Vuex)

  const store = new Vuex.Store<any>({
    state: {
      stateModel,
      resourceModel
    },
    getters: {
      getAccountId,
      getApprovedName,
      getBusinessId,
      getCurrentDate,
      getFilingDate,
      getFilingId,
      getEntityType,
      getFolioNumber,
      getNameRequestApplicant,
      getNameRequestDetails,
      getNameRequestNumber,
      getNameTranslations,
      getOfficeAddresses,
      getOrgPeople,
      getUserEmail,
      haveChanges,
      ignoreChanges,
      isApplicationValid,
      isAuthEdit,
      isAuthView,
      isBusySaving,
      isEnableFilePayBtn,
      isEntityType,
      isNamedBusiness,
      isPremiumAccount,
      isRoleStaff,
      isTypeBcomp,
      isTypeCoop
    },
    mutations: {
      mutateAccountInformation,
      mutateAddPeopleAndRoleStepValidity,
      mutateAuthRoles,
      mutateBusinessContact,
      mutateBusinessId,
      mutateBusinessInformation,
      mutateCertifyState,
      mutateCertifyStatementResource,
      mutateCreateShareStructureStepValidity,
      mutateCurrentDate,
      mutateDefineCompanyStepValidity,
      mutateEffectiveDate,
      mutateEntityType,
      mutateFilingDate,
      mutateFilingId,
      mutateFolioNumber,
      mutateHaveChanges,
      mutateIgnoreChanges,
      mutateIncorporationAgreementStepData,
      mutateIsFilingPaying,
      mutateIsFutureEffective,
      mutateIsIncorporationDateTimeValid,
      mutateIsSaving,
      mutateIsSavingResuming,
      mutateKeycloakRoles,
      mutateNameRequest,
      mutateNameTranslations,
      mutateOfficeAddresses,
      mutateOrgPersonList,
      mutateShareClasses,
      mutateUserEmail
    },
    actions: {
      setAccountInformation,
      setAddPeopleAndRoleStepValidity,
      setAuthRoles,
      setBusinessContact,
      setBusinessId,
      setBusinessInformation,
      setCertifyState,
      setCertifyStatementResource,
      setCreateShareStructureStepValidity,
      setCurrentDate,
      setDefineCompanyStepValidity,
      setEffectiveDate,
      setEntityType,
      setFilingDate,
      setFilingId,
      setFolioNumber,
      setHaveChanges,
      setIgnoreChanges,
      setIncorporationAgreementStepData,
      setIsFilingPaying,
      setIsFutureEffective,
      setIsIncorporationDateTimeValid,
      setIsSaving,
      setIsSavingResuming,
      setKeycloakRoles,
      setNameRequest,
      setNameTranslations,
      setOfficeAddresses,
      setOrgPersonList,
      setShareClasses,
      setUserEmail
    }
  })

  return store
}
