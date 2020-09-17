// Libraries
import Vue from 'vue'
import Vuex from 'vuex'

// State
import { stateModel, resourceModel } from './state'

// Getters
import {
  isRoleStaff, isAuthEdit, isAuthView, getEntityType, isEntityType, isPremiumAccount, isTypeBcomp, isTypeCoop,
  isEnableFilePayBtn, isBusySaving, getAgreementType, getEffectiveDate, isPeopleAndRoleStepValid, getFilingId,
  getBusinessId, isNamedBusiness, getNameRequestNumber, getApprovedName, getAccountId, getBusinessNumber,
  getFolioNumber, getNameRequestDetails, getNameRequestApplicant, getOfficeAddresses, getFilingDate, getCurrentDate,
  ignoreChanges, haveChanges, getNameTranslations, getOriginalIA, getPeopleAndRoles, getShareClasses,
  getCurrentBusinessName, getNameRequest, getCorrectedFilingId, getHaveCorrection, isCorrectionChanged,
  isCorrectionValid, getUserEmail, getUserFirstName, getUserLastName, getUserRoles, getUserUsername
} from '@/store/getters'

// Mutations
import {
  mutateIsSaving, mutateIsSavingResuming, mutateIsFilingPaying, mutateKeycloakRoles, mutateAuthRoles, mutateUserInfo,
  mutateCurrentDate, mutateFolioNumber, mutateFilingDate, mutateCertifyStatementResource, mutateCertifyState,
  mutateBusinessContact, mutateDefineCompanyStepValidity, mutateAccountInformation, mutateNameRequest, mutateFilingId,
  mutateOfficeAddresses, mutatePeopleAndRoles, mutatePeopleAndRoleStepValidity, mutatePeopleAndRoleStepChanged,
  mutateShareClasses, mutateCreateShareStructureStepValidity, mutateIgnoreChanges, mutateHaveChanges,
  mutateIsFutureEffective, mutateEffectiveDate, mutateIsIncorporationDateTimeValid, mutateBusinessId,
  mutateIncorporationAgreementStepData, mutateEntityType, mutateNameTranslations, mutateBusinessInformation,
  mutateOriginalIA, mutateCorrectedFilingId, mutateHaveCorrection
} from '@/store/mutations'

// Setters
import {
  setIsSaving, setIsSavingResuming, setIsFilingPaying, setKeycloakRoles, setAuthRoles, setUserInfo, setCurrentDate,
  setCertifyStatementResource, setCertifyState, setBusinessContact, setDefineCompanyStepValidity, setNameRequest,
  setFilingId, setFolioNumber, setFilingDate, setOfficeAddresses, setPeopleAndRoles, setPeopleAndRoleStepChanged,
  setPeopleAndRoleStepValidity, setShareClasses, setCreateShareStructureStepValidity, setIgnoreChanges,
  setHaveChanges, setIsFutureEffective, setEffectiveDate, setIsIncorporationDateTimeValid, setAccountInformation,
  setBusinessId, setEntityType, setIncorporationAgreementStepData, setNameTranslations, setBusinessInformation,
  setOriginalIA, setCorrectedFilingId, setHaveCorrection
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
      getAgreementType,
      getApprovedName,
      getBusinessId,
      getBusinessNumber,
      getCorrectedFilingId,
      getCurrentBusinessName,
      getCurrentDate,
      getFilingDate,
      getFilingId,
      getEffectiveDate,
      getEntityType,
      getFolioNumber,
      getHaveCorrection,
      getNameRequest,
      getNameRequestApplicant,
      getNameRequestDetails,
      getNameRequestNumber,
      getNameTranslations,
      getOfficeAddresses,
      getOriginalIA,
      getPeopleAndRoles,
      getShareClasses,
      getUserEmail,
      getUserFirstName,
      getUserLastName,
      getUserRoles,
      getUserUsername,
      haveChanges,
      ignoreChanges,
      isAuthEdit,
      isAuthView,
      isBusySaving,
      isCorrectionChanged,
      isCorrectionValid,
      isEnableFilePayBtn,
      isEntityType,
      isNamedBusiness,
      isPeopleAndRoleStepValid,
      isPremiumAccount,
      isRoleStaff,
      isTypeBcomp,
      isTypeCoop
    },
    mutations: {
      mutateAccountInformation,
      mutateAuthRoles,
      mutateBusinessContact,
      mutateBusinessId,
      mutateBusinessInformation,
      mutateCertifyState,
      mutateCertifyStatementResource,
      mutateCorrectedFilingId,
      mutateCreateShareStructureStepValidity,
      mutateCurrentDate,
      mutateDefineCompanyStepValidity,
      mutateEffectiveDate,
      mutateEntityType,
      mutateFilingDate,
      mutateFilingId,
      mutateFolioNumber,
      mutateHaveChanges,
      mutateHaveCorrection,
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
      mutateOriginalIA,
      mutatePeopleAndRoles,
      mutatePeopleAndRoleStepChanged,
      mutatePeopleAndRoleStepValidity,
      mutateShareClasses,
      mutateUserInfo
    },
    actions: {
      setAccountInformation,
      setAuthRoles,
      setBusinessContact,
      setBusinessId,
      setBusinessInformation,
      setCertifyState,
      setCertifyStatementResource,
      setCorrectedFilingId,
      setCreateShareStructureStepValidity,
      setCurrentDate,
      setDefineCompanyStepValidity,
      setEffectiveDate,
      setEntityType,
      setFilingDate,
      setFilingId,
      setFolioNumber,
      setHaveChanges,
      setHaveCorrection,
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
      setOriginalIA,
      setPeopleAndRoles,
      setPeopleAndRoleStepChanged,
      setPeopleAndRoleStepValidity,
      setShareClasses,
      setUserInfo
    }
  })

  return store
}
