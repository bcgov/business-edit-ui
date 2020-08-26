// Enums
import { AccountTypes, EntityTypes, RouteNames } from '@/enums'
import { NameRequestDetailsIF, NameRequestApplicantIF } from '@/interfaces'

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

/** Whether the entity type has been identified. */
export const isEntityType = (state: any): boolean => {
  return !!state.stateModel.entityType
}

/** Whether the entity is a BCOMP. */
export const isTypeBcomp = (state: any): boolean => {
  return (state.stateModel.entityType === EntityTypes.BCOMP)
}

/** Whether the entity is a COOP. */
export const isTypeCoop = (state: any): boolean => {
  return (state.stateModel.entityType === EntityTypes.COOP)
}

/** Whether the current account is a premium account. */
export const isPremiumAccount = (state: any): boolean => {
  return (state.stateModel.accountInformation.accountType === AccountTypes.PREMIUM)
}

/** The current account id. */
export const getAccountId = (state: any): number => {
  return state.stateModel.accountInformation.id
}

/** The current date. */
export const getCurrentDate = (state: any): string => {
  return state.stateModel.currentDate
}

/** The filing date. */
export const getFilingDate = (state: any): string => {
  return state.stateModel.filingDate
}

/** The filing id. */
export const getFilingId = (state: any): number => {
  return state.stateModel.filingId
}

/** The business identifier. */
export const getBusinessId = (state: any): string => {
  return state.stateModel.businessId
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
export const getOfficeAddresses = (state: any): string => {
  return state.stateModel.defineCompanyStep.officeAddresses
}

/** Whether we are ignoring data changes. */
export const ignoreChanges = (state: any): boolean => {
  return state.stateModel.ignoreChanges
}

/** Whether there are unsaved data changes. */
export const haveChanges = (state: any): boolean => {
  return state.stateModel.haveChanges
}

//
// Below is the business logic that allows the Actions, etc
// to know how they should behave (ie, what to show or enable).
//

/** Whether File and Pay button should be enabled. */
export const isEnableFilePayBtn = (state: any, getters: any): boolean => {
  const step1Valid = state.stateModel.defineCompanyStep.valid
  const step2Valid = state.stateModel.addPeopleAndRoleStep.valid
  const step3Valid = getters.isTypeBcomp ? state.stateModel.createShareStructureStep.valid : false
  const step4Valid = getters.isTypeBcomp ? state.stateModel.incorporationAgreementStep.valid : false
  const step5Valid = state.stateModel.certifyState.valid && state.stateModel.incorporationDateTime.valid
  return (step1Valid && step2Valid && step3Valid && step4Valid && step5Valid)
}

/** Whether app is busy saving or resuming. */
export const isBusySaving = (state: any): boolean => {
  return (state.stateModel.isSaving || state.stateModel.isSavingResuming || state.stateModel.isFilingPaying)
}

// TODO: change this to "all sections"?
/** Whether all the incorporation steps are valid. */
export const isApplicationValid = (state: any): boolean => {
  return (state.stateModel.defineCompanyStep.valid && state.stateModel.addPeopleAndRoleStep.valid &&
    state.stateModel.createShareStructureStep.valid && state.stateModel.incorporationDateTime.valid &&
    state.stateModel.incorporationAgreementStep.valid && state.stateModel.certifyState.valid)
}
