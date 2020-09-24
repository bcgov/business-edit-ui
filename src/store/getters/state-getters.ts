// Enums and Interfaces
import { AccountTypes, EntityTypes } from '@/enums'
import {
  IncorporationFilingIF, NameRequestDetailsIF, NameRequestApplicantIF, OrgPersonIF, ShareClassIF,
  NameRequestIF, BusinessContactIF
} from '@/interfaces'

/** Whether the user has "staff" keycloak role. */
export const isRoleStaff = (state: any): boolean => {
  return state.stateModel.tombstone.keycloakRoles.includes('staff')
}

/** Whether the user is authorized to edit. */
export const isAuthEdit = (state: any): boolean => {
  return state.stateModel.tombstone.authRoles.includes('edit')
}

/** Whether the user is authorized to view. */
export const isAuthView = (state: any): boolean => {
  return state.stateModel.tombstone.authRoles.includes('view')
}

/** The entity type. */
export const getEntityType = (state: any): EntityTypes => {
  return state.stateModel.tombstone.entityType
}

/** Whether the entity type has been identified. */
export const isEntityType = (state: any): boolean => {
  return !!state.stateModel.tombstone.entityType
}

/** Whether the entity is a BCOMP. */
export const isTypeBcomp = (state: any): boolean => {
  return (state.stateModel.tombstone.entityType === EntityTypes.BCOMP)
}

/** Whether the entity is a COOP. */
export const isTypeCoop = (state: any): boolean => {
  return (state.stateModel.tombstone.entityType === EntityTypes.COOP)
}

/** Whether the current account is a premium account. */
export const isPremiumAccount = (state: any): boolean => {
  return (state.stateModel.accountInformation.accountType === AccountTypes.PREMIUM)
}

/** The filing's effective date. */
export const getEffectiveDate = (state: any): Date => {
  return state.stateModel.incorporationDateTime.effectiveDate
}

/** The current account id. */
export const getAccountId = (state: any): number => {
  return state.stateModel.accountInformation.id
}

/** The current date. */
export const getCurrentDate = (state: any): string => {
  return state.stateModel.tombstone.currentDate
}

/** The filing date. */
export const getFilingDate = (state: any): string => {
  return state.stateModel.tombstone.filingDate
}

/** The filing id. */
export const getFilingId = (state: any): number => {
  return state.stateModel.tombstone.filingId
}

/** The corrected filing id. */
export const getCorrectedFilingId = (state: any): number => {
  return state.stateModel.tombstone.correctedFilingId
}

/** The business identifier (aka incorporation number). */
export const getBusinessId = (state: any): string => {
  return state.stateModel.tombstone.businessId
}

/** The business identifier (aka incorporation number). */
export const getCurrentBusinessName = (state: any): string => {
  return state.stateModel.originalIA.incorporationApplication.nameRequest.legalName
}

/** The original Incorporation Application filing( or the filing being corrected). */
export const getOriginalIA = (state: any): IncorporationFilingIF => {
  return state.stateModel.originalIA
}

/** The business number. */
export const getBusinessNumber = (state: any): string => {
  // remove first 2 chars from Business ID
  return state.stateModel.tombstone.businessId?.substring(2)
}

/** The current user's email. */
export const getUserEmail = (state: any): string => {
  const userInfo = state.stateModel.tombstone.userInfo
  // get email from contacts[0] if it exists (ie, for BCSC users)
  // else get email from root object
  return userInfo?.contacts[0]?.email || userInfo?.email
}

/** The current user's first name. */
export const getUserFirstName = (state: any): any => {
  return state.stateModel.tombstone.userInfo?.firstname
}

/** The current user's last name. */
export const getUserLastName = (state: any): any => {
  return state.stateModel.tombstone.userInfo?.lastname
}

/** The current user's roles. */
export const getUserRoles = (state: any): any => {
  return state.stateModel.tombstone.userInfo?.roles
}

/** The current user's username. */
export const getUserUsername = (state: any): any => {
  return state.stateModel.tombstone.userInfo?.username
}

/** The folio number. */
export const getFolioNumber = (state: any): string => {
  return state.stateModel.defineCompanyStep.folioNumber
}

/** Whether this IA is for a named business. */
export const isNamedBusiness = (state: any): boolean => {
  // a named business has a NR number
  return !!state.stateModel.nameRequest.nrNumber
}

/** The Name request state. */
export const getNameRequest = (state: any): NameRequestIF => {
  return state.stateModel.nameRequest
}

/** The NR number of a name request. */
export const getNameRequestNumber = (state: any): string => {
  return state.stateModel.nameRequest.nrNumber
}

/** The approved name of a name request. */
export const getApprovedName = (state: any): string => {
  return state.stateModel.nameRequest.legalName
}

/** The name request details. */
export const getNameRequestDetails = (state: any): NameRequestDetailsIF => {
  return state.stateModel.nameRequest.details
}

/** The name request applicant information. */
export const getNameRequestApplicant = (state: any): NameRequestApplicantIF => {
  return state.stateModel.nameRequest.applicant
}

/** The name translations. */
export const getNameTranslations = (state: any): Array<string> => {
  return state.stateModel.nameTranslations
}

/** The office addresses. */
export const getOfficeAddresses = (state: any): any => {
  return state.stateModel.defineCompanyStep.officeAddresses
}

/** The people and roles list. */
export const getPeopleAndRoles = (state: any): Array<OrgPersonIF> => {
  return state.stateModel.peopleAndRoles.orgPeople
}

/** The share classes list. */
export const getShareClasses = (state: any): Array<ShareClassIF> => {
  return state.stateModel.createShareStructureStep.shareClasses
}

export const getAgreementType = (state: any): string | null => {
  return state.stateModel.incorporationAgreementStep.agreementType
}

export const getBusinessContact = (state: any): BusinessContactIF => {
  return state.stateModel.defineCompanyStep.businessContact
}

/** Whether we are ignoring data changes. */
export const ignoreChanges = (state: any): boolean => {
  return state.stateModel.tombstone.ignoreChanges
}

/** Whether there are unsaved data changes. */
export const haveChanges = (state: any): boolean => {
  return state.stateModel.tombstone.haveChanges
}

/** The staff payment. */
export const getStaffPayment = (state: any): any => {
  return state.stateModel.staffPayment
}

/** The staff payment validity. */
export const isStaffPaymentValid = (state: any): any => {
  return state.stateModel.staffPaymentValidity
}

/** The filing data. */
export const getFilingData = (state: any): any => {
  return state.stateModel.filingData
}

/** Whether People and Roles component is valid. */
export const isPeopleAndRoleValid = (state: any): boolean => {
  return state.stateModel.peopleAndRoles.valid
}

//
// Below is the business logic that allows the Actions, etc
// to know how they should behave (ie, what to show or enable).
//

/** Whether File and Pay button should be enabled. */
export const isEnableFilePayBtn = (state: any, getters: any): boolean => {
  const step1Valid = state.stateModel.defineCompanyStep.valid
  const step2Valid = state.stateModel.peopleAndRoles.valid
  const step3Valid = getters.isTypeBcomp ? state.stateModel.createShareStructureStep.valid : false
  const step4Valid = getters.isTypeBcomp ? state.stateModel.incorporationAgreementStep.valid : false
  const step5Valid = state.stateModel.certifyState.valid && state.stateModel.incorporationDateTime.valid
  return (step1Valid && step2Valid && step3Valid && step4Valid && step5Valid)
}

/** Whether app is busy saving or resuming. */
export const isBusySaving = (state: any): boolean => {
  return (state.stateModel.tombstone.isSaving ||
    state.stateModel.tombstone.isSavingResuming ||
    state.stateModel.tombstone.isFilingPaying)
}

/** Whether any correction/alteration sections have changed. */
export const isFilingChanged = (state: any): boolean => {
  // TODO: add other sections here
  return (state.stateModel.peopleAndRoles.changed ||
    state.stateModel.defineCompanyStep.changed ||
    state.stateModel.createShareStructureStep.changed ||
    state.stateModel.incorporationAgreementStep.changed)
}

/** Whether any correction/alteration sections have changed. */
export const isFilingValid = (state: any): boolean => {
  // Add sections that can have only invalid data like people and roles and share structure
  // Define company, Agreement Type wont allow saving and invalid state to the store
  return (state.stateModel.peopleAndRoles.valid)
}
