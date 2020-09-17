// Libraries
import Vue from 'vue'
import Vuex from 'vuex'

// State
import { stateModel, resourceModel } from './state'

// Getters
import {
  isRoleStaff, isAuthEdit, isAuthView, getEntityType, isEntityType, isPremiumAccount, isTypeBcomp, isTypeCoop,
  isEnableFilePayBtn, isBusySaving, getAgreementType, getEffectiveDate,
  getFilingId, getBusinessId, isNamedBusiness, getNameRequestNumber, getApprovedName, getAccountId, getBusinessNumber,
  getFolioNumber, getNameRequestDetails, getNameRequestApplicant, getOfficeAddresses, getFilingDate, getUserEmail,
  isApplicationValid, getCurrentDate, ignoreChanges, haveChanges, getNameTranslations, getOriginalIA, getOrgPeople,
  getShareClasses, getCurrentBusinessName, getNameRequest, getCorrectedFilingId, getHaveCorrection, getStaffPayment
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
  mutateNameTranslations, mutateBusinessInformation, mutateOriginalIA, mutateCorrectedFilingId, mutateHaveCorrection,
  mutateStaffPayment
} from '@/store/mutations'

// Setters
import {
  setIsSaving, setIsSavingResuming, setIsFilingPaying,
  setKeycloakRoles, setAuthRoles, setUserEmail, setCurrentDate, setCertifyStatementResource, setCertifyState,
  setBusinessContact, setDefineCompanyStepValidity, setNameRequest, setFilingId, setFolioNumber, setFilingDate,
  setOfficeAddresses, setOrgPersonList, setAddPeopleAndRoleStepValidity, setShareClasses,
  setCreateShareStructureStepValidity, setIgnoreChanges, setHaveChanges, setIsFutureEffective,
  setEffectiveDate, setIsIncorporationDateTimeValid, setAccountInformation, setBusinessId, setEntityType,
  setIncorporationAgreementStepData, setNameTranslations, setBusinessInformation, setOriginalIA, setCorrectedFilingId,
  setHaveCorrection, setStaffPayment
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
      getCurrentBusinessName,
      getBusinessNumber,
      getCorrectedFilingId,
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
      getOrgPeople,
      getShareClasses,
      getStaffPayment,
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
      mutateOrgPersonList,
      mutateOriginalIA,
      mutateShareClasses,
      mutateStaffPayment,
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
      setOrgPersonList,
      setOriginalIA,
      setShareClasses,
      setStaffPayment,
      setUserEmail
    }
  })

  return store
}
