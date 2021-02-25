// Enums and Interfaces
import { AccountTypes, EntityTypes } from '@/enums'
import {
  IncorporationFilingIF, NameRequestDetailsIF, NameRequestApplicantIF, OrgPersonIF, ShareClassIF,
  NameRequestIF, BusinessContactIF, BusinessInformationIF, CertifyIF,
  CertifyStatementIF, NameTranslationIF, IncorporationAddressIf, FilingDataIF, StateIF, BusinessSnapshotIF
} from '@/interfaces'
import { StaffPaymentIF } from '@bcrs-shared-components/interfaces'

/** Whether the user has "staff" keycloak role. */
export const isRoleStaff = (state: StateIF): boolean => {
  return state.stateModel.tombstone.keycloakRoles.includes('staff')
}

/** Whether the user is authorized to edit. */
export const isAuthEdit = (state: StateIF): boolean => {
  return state.stateModel.tombstone.authRoles.includes('edit')
}

/** Whether the user is authorized to view. */
export const isAuthView = (state: StateIF): boolean => {
  return state.stateModel.tombstone.authRoles.includes('view')
}

/** The entity type. */
export const getEntityType = (state: StateIF): EntityTypes => {
  return state.stateModel.tombstone.entityType
}

/** Whether the entity type has been identified. */
export const isEntityType = (state: StateIF): boolean => {
  return !!state.stateModel.tombstone.entityType
}

/** Whether the entity is a Benefit Company. */
export const isTypeBcomp = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.entityType === EntityTypes.BENEFIT_COMPANY)
}

/** Whether the entity is a Cooperative. */
export const isTypeCoop = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.entityType === EntityTypes.COOP)
}

/** Whether the current account is a premium account. */
export const isPremiumAccount = (state: StateIF): boolean => {
  return (state.stateModel.accountInformation.accountType === AccountTypes.PREMIUM)
}

/** The filing's effective date. */
export const getEffectiveDate = (state: StateIF): Date => {
  return state.stateModel.incorporationDateTime.effectiveDate
}

/** The filing's effective date. */
export const getBusinessFoundingDate = (state: StateIF): Date => {
  return state.stateModel.businessInformation.foundingDate
}

/** The filing's original effective date. */
export const getOriginalEffectiveDate = (state: StateIF): string => {
  return state.stateModel.originalIA.header.date
}

/** The current account id. */
export const getAccountId = (state: StateIF): number => {
  return state.stateModel.accountInformation.id
}

/** The current date. */
export const getCurrentDate = (state: StateIF): string => {
  return state.stateModel.tombstone.currentDate
}

/** The filing date. */
export const getFilingDate = (state: StateIF): string => {
  return state.stateModel.tombstone.filingDate
}

/** The filing id. */
export const getFilingId = (state: StateIF): number => {
  return state.stateModel.tombstone.filingId
}

/** The corrected filing id. */
export const getCorrectedFilingId = (state: StateIF): number => {
  return state.stateModel.tombstone.correctedFilingId
}

/** The business identifier (aka incorporation number). */
export const getBusinessId = (state: StateIF): string => {
  return state.stateModel.tombstone.businessId
}

/** The business identifier (aka incorporation number). */
export const getCurrentBusinessName = (state: StateIF): string => {
  // Return the legal name from an IA for Corrections or the legal name of the business for Alterations
  return state.stateModel.originalIA.incorporationApplication.nameRequest.legalName ||
    state.stateModel.businessInformation.legalName
}

/** The original Incorporation Application filing( or the filing being corrected). */
export const getOriginalIA = (state: StateIF): IncorporationFilingIF => {
  return state.stateModel.originalIA
}

/** The original business snapshot */
export const getOriginalSnapshot = (state: StateIF): BusinessSnapshotIF[] => {
  return state.stateModel.originalSnapshot
}

/** The business number. */
export const getBusinessNumber = (state: StateIF): string => {
  // remove first 2 chars from Business ID
  return state.stateModel.tombstone.businessId?.substring(2)
}

/** The current user's email. */
export const getUserEmail = (state: StateIF): string => {
  const userInfo = state.stateModel.tombstone.userInfo
  // get email from contacts[0] if it exists (ie, for BCSC users)
  // else get email from root object
  return userInfo?.contacts[0]?.email || userInfo?.email
}

/** The current user's first name. */
export const getUserFirstName = (state: StateIF): string => {
  return state.stateModel.tombstone.userInfo?.firstname
}

/** The current user's last name. */
export const getUserLastName = (state: StateIF): string => {
  return state.stateModel.tombstone.userInfo?.lastname
}

/** The current user's roles. */
export const getUserRoles = (state: StateIF): any => {
  return state.stateModel.tombstone.userInfo?.roles
}

/** The current user's username. */
export const getUserUsername = (state: StateIF): string => {
  return state.stateModel.tombstone.userInfo?.username
}

/** The folio number. */
export const getFolioNumber = (state: StateIF): string => {
  return state.stateModel.defineCompanyStep.folioNumber
}

/** Whether this IA is for a named business. */
export const isNamedBusiness = (state: StateIF): boolean => {
  // a named business has a NR number
  return !!state.stateModel.nameRequest.nrNumber
}

/** The Name request state. */
export const getNameRequest = (state: StateIF): NameRequestIF => {
  return state.stateModel.nameRequest
}

/** The NR number of a name request. */
export const getNameRequestNumber = (state: StateIF): string => {
  return state.stateModel.nameRequest.nrNumber
}

/** Identify if changes were made to the NrNumber */
export const hasNewNr = (state: StateIF): boolean => {
  const newNr = state.stateModel.nameRequest?.nrNumber
  const originalNr = state.stateModel.originalIA.incorporationApplication.nameRequest?.nrNumber ||
    state.stateModel.originalAlteration.alteration.nameRequest.nrNumber

  // Evaluate only if a new NR exists.
  return newNr ? newNr !== originalNr : false
}

/** The approved name of a name request. */
export const getApprovedName = (state: StateIF): string => {
  return state.stateModel.nameRequest.legalName
}

/** The name request details. */
export const getNameRequestDetails = (state: StateIF): NameRequestDetailsIF | {} => {
  return state.stateModel.nameRequest.details
}

/** The name request applicant information. */
export const getNameRequestApplicant = (state: StateIF): NameRequestApplicantIF | {} => {
  return state.stateModel.nameRequest.applicant
}

/** The name translations. */
export const getNameTranslations = (state: StateIF): NameTranslationIF[] => {
  return state.stateModel.nameTranslations
}

/** The office addresses. */
export const getOfficeAddresses = (state: StateIF): IncorporationAddressIf | {} => {
  return state.stateModel.defineCompanyStep.officeAddresses
}

/** The people and roles list. */
export const getPeopleAndRoles = (state: StateIF): Array<OrgPersonIF> => {
  return state.stateModel.peopleAndRolesStep.orgPeople
}

/** The share classes list. */
export const getShareClasses = (state: StateIF): Array<ShareClassIF> => {
  return state.stateModel.shareStructureStep.shareClasses
}

export const getAgreementType = (state: StateIF): string => {
  return state.stateModel.incorporationAgreementStep.agreementType
}

/** The business contact object. */
export const getBusinessContact = (state: StateIF): BusinessContactIF => {
  return state.stateModel.defineCompanyStep.businessContact
}

export const getSnapshotContact = (state: StateIF): BusinessContactIF => {
  const snapShotContact: unknown = state.stateModel.originalSnapshot[5]
  return snapShotContact as BusinessContactIF
}

/** Whether we are ignoring data changes. */
export const ignoreChanges = (state: StateIF): boolean => {
  return state.stateModel.tombstone.ignoreChanges
}

/** Whether there are unsaved data changes. */
export const haveChanges = (state: StateIF): boolean => {
  return state.stateModel.tombstone.haveChanges
}

/** The staff payment. */
export const getStaffPayment = (state: StateIF): StaffPaymentIF => {
  return state.stateModel.staffPaymentStep.staffPayment
}

/** The filing data. */
export const getFilingData = (state: StateIF): FilingDataIF => {
  return state.stateModel.filingData
}

/** Whether People and Roles component is valid. */
export const isPeopleAndRolesValid = (state: StateIF): boolean => {
  return state.stateModel.peopleAndRolesStep.valid
}

/** Whether Define Company Step is valid. */
export const isDefineCompanyStepValid = (state: StateIF): boolean => {
  return state.stateModel.defineCompanyStep.valid
}

/** Whether app is busy saving/saving and resuming/filing and paying. */
export const isBusySaving = (state: StateIF): boolean => {
  return (isSaving(state) || isSavingResuming(state) || isFilingPaying(state))
}

/** Whether app is busy saving. */
export const isSaving = (state: StateIF): boolean => {
  return state.stateModel.tombstone.isSaving
}

/** Whether app is busy saving and resuming. */
export const isSavingResuming = (state: StateIF): boolean => {
  return state.stateModel.tombstone.isSavingResuming
}

/** Whether app is busy filing and paying. */
export const isFilingPaying = (state: StateIF): boolean => {
  return state.stateModel.tombstone.isFilingPaying
}

/** Whether any correction/alteration sections have changed. */
export const isFilingChanged = (state: StateIF): boolean => {
  return (state.stateModel.peopleAndRolesStep.changed ||
    state.stateModel.defineCompanyStep.changed ||
    state.stateModel.shareStructureStep.changed ||
    state.stateModel.incorporationAgreementStep.changed)
}

/** Whether all correction/alteration sections are valid. */
export const isFilingValid = (state: StateIF): boolean => {
  // NB: Define Company and Agreement Type don't have a "valid" state --
  //     they don't allow saving an invalid state to the store.
  return (state.stateModel.peopleAndRolesStep.valid &&
    state.stateModel.detail.valid &&
    state.stateModel.certifyState.valid &&
    state.stateModel.staffPaymentStep.valid)
}

/** Whether any correction/alteration sections are in editing mode. */
export const isEditing = (state: StateIF): boolean => {
  // NB: Detail, Certify and Staff Payment don't have an "editing" mode.
  return (state.stateModel.editingFlags.companyName ||
    state.stateModel.editingFlags.nameTranslations ||
    state.stateModel.editingFlags.officeAddresses ||
    state.stateModel.editingFlags.peopleAndRoles ||
    state.stateModel.editingFlags.shareStructure ||
    state.stateModel.editingFlags.incorporationAgreement)
}

export const getDefaultCorrectionDetailComment = (state: StateIF): string => {
  const filingDate = state.stateModel.originalIA.header.date.split('T')[0] || ''
  return `Correction for Incorporation Application filed on ${filingDate}.`
}

export const getDetailComment = (state: StateIF): string => {
  return state.stateModel.detail.comment
}

/** The business information object. */
export const getBusinessInformation = (state: StateIF): BusinessInformationIF => {
  return state.stateModel.businessInformation
}

export const getCertifyState = (state: StateIF): CertifyIF => {
  return state.stateModel.certifyState
}

export const getCertifyResource = (state: StateIF): CertifyStatementIF => {
  return state.resourceModel.certifyStatementResource
}

/** Check for a 7 digit pattern to identify a Numbered company from the legal name. */
export const isNumberedCompany = (state: StateIF): boolean => {
  return RegExp('^\\d{7}$').test(state.stateModel.businessInformation?.legalName?.split(' ')[0])
}

/** Check for conflicting legal types between current type and altered type. */
export const isConflictingLegalType = (state: StateIF): boolean => {
  return state.stateModel.tombstone.entityType !== state.stateModel.nameRequest.legalType
}

/** Get Summary mode state. */
export const isSummaryMode = (state: StateIF): boolean => {
  return state.stateModel.summaryMode
}

// Alteration Flag Getters
/** Identify changes to business name. */
export const hasBusinessNameChanged = (state: StateIF): boolean => {
  return state.stateModel.nameRequest?.legalName !== state.stateModel.originalSnapshot[0]?.business?.legalName
}

/** Identify changes to business type. */
export const hasBusinessTypeChanged = (state: StateIF): boolean => {
  return state.stateModel.tombstone.entityType !== state.stateModel.originalSnapshot[0]?.business?.legalType
}

/** Check for changes between current contact and original contact. */
export const hasContactInfoChange = (state: StateIF): boolean => {
  const businessContact: BusinessContactIF = state.stateModel.defineCompanyStep.businessContact

  return businessContact.email !== getSnapshotContact(state).email ||
    businessContact.phone !== getSnapshotContact(state).phone ||
    businessContact.extension !== getSnapshotContact(state).extension
}
