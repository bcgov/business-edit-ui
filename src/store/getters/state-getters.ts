import { AccountTypes, ActionTypes, CorpTypeCd, FilingCodes, FilingTypes } from '@/enums'
import {
  IncorporationFilingIF,
  NameRequestDetailsIF,
  NameRequestApplicantIF,
  OrgPersonIF,
  ShareClassIF,
  NameRequestIF,
  BusinessInformationIF,
  CertifyIF,
  CertifyStatementIF,
  NameTranslationIF,
  IncorporationAddressIf,
  FilingDataIF,
  StateIF,
  BusinessSnapshotIF,
  EffectiveDateTimeIF,
  ShareStructureIF,
  ValidFlagsIF,
  ValidComponentsIF,
  ResolutionsIF,
  FeesIF
} from '@/interfaces'
import { ContactPointIF, StaffPaymentIF } from '@bcrs-shared-components/interfaces'
import { isEqual, omit } from 'lodash'

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

/** Whether the current filing is a correction. */
export const isCorrectionFiling = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.filingType === FilingTypes.CORRECTION)
}

/** Whether the current filing is an alteration. */
export const isAlterationFiling = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.filingType === FilingTypes.ALTERATION)
}

/** The entity type. */
export const getEntityType = (state: StateIF): CorpTypeCd => {
  return state.stateModel.tombstone.entityType
}

/** Whether the entity is a Benefit Company. */
export const isTypeBcomp = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.entityType === CorpTypeCd.BENEFIT_COMPANY)
}

/** Whether the entity is a Cooperative. */
export const isTypeCoop = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.entityType === CorpTypeCd.COOP)
}

/** Whether the current account is a premium account. */
export const isPremiumAccount = (state: StateIF): boolean => {
  return (state.stateModel.accountInformation.accountType === AccountTypes.PREMIUM)
}

/** The filing's effective date-time object. */
export const getEffectiveDateTime = (state: StateIF): EffectiveDateTimeIF => {
  return state.stateModel.effectiveDateTime
}

/** The business' founding date (actually date-time). */
export const getBusinessFoundingDate = (state: StateIF): string => {
  return state.stateModel.businessInformation.foundingDate
}

/** The filing's original effective date-time. */
export const getOriginalFilingDateTime = (state: StateIF): string => {
  return state.stateModel.originalIA.header.date
}

/** The filing's original effective date-time. */
export const getOriginalEffectiveDateTime = (state: StateIF): string => {
  return state.stateModel.originalIA.header.effectiveDate
}

/** The current account id. */
export const getAccountId = (state: StateIF): number => {
  return state.stateModel.accountInformation.id
}

/** The current date, which is refreshed every time the app inits. */
export const getCurrentDate = (state: StateIF): string => {
  return state.stateModel.tombstone.currentDate
}

/** The current JS Date object, which is refreshed every minute. */
export const getCurrentJsDate = (state: StateIF): Date => {
  return state.stateModel.currentJsDate
}

/** The filing date. */
export const getFilingDateTime = (state: StateIF): string => {
  return state.stateModel.tombstone.filingDateTime
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
export const getOriginalSnapshot = (state: StateIF): BusinessSnapshotIF => {
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
  return newNr ? (newNr !== originalNr) : false
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

/** Whether name translations data has changed. */
export const hasNameTranslationChanged = (state: StateIF): boolean => {
  return (getNameTranslations(state).filter(x => x.action).length > 0)
}

/** Whether folio number has changed. */
export const hasFolioNumberChanged = (state: StateIF): boolean => {
  return false // TODO: implement this (#5024)
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
export const getBusinessContact = (state: StateIF): ContactPointIF => {
  return state.stateModel.defineCompanyStep.businessContact
}

export const getSnapshotContact = (state: StateIF): ContactPointIF => {
  return state.stateModel.originalSnapshot?.contactPoint
}

export const getSnapshotShareStructure = (state: StateIF): ShareStructureIF => {
  return state.stateModel.originalSnapshot?.shareStructure
}

/** Whether we are ignoring data changes. */
export const ignoreChanges = (state: StateIF): boolean => {
  return state.stateModel.tombstone.ignoreChanges
}

/** Whether there are unsaved data changes. */
export const haveUnsavedChanges = (state: StateIF): boolean => {
  return state.stateModel.tombstone.haveUnsavedChanges
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

/**
 * Whether any correction data has changed (for the purpose of showing the
 * fee summary), ie, does not include:
 * - detail
 * - certify
 * - staff payment
 */
export const hasCorrectionChanged = (state: StateIF): boolean => {
  return (
    state.stateModel.peopleAndRolesStep.changed ||
    state.stateModel.defineCompanyStep.changed ||
    state.stateModel.shareStructureStep.changed ||
    state.stateModel.incorporationAgreementStep.changed
  )
}

/**
 * Whether any alteration data has changed (for the purpose of showing the
 * fee summary), ie, does not include:
 * - alteration date and time
 * - alteration documents delivery
 * - certify
 * - court order and POA
 * - staff payment
 */
export const hasAlterationChanged = (state: StateIF): boolean => {
  return (
    hasBusinessNameChanged(state) ||
    hasBusinessTypeChanged(state) ||
    hasNameTranslationChanged(state) ||
    hasShareStructureChanged(state) ||
    getProvisionsRemoved(state) ||
    hasNewResolutionDatesChanged(state)
  )
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

/** Flag to prompt app level validations. */
export const getAppValidate = (state: StateIF): boolean => {
  return state.stateModel.newAlteration.appValidate
}

/** Flag to prompt component level validations. */
export const getComponentValidate = (state: StateIF): boolean => {
  return state.stateModel.newAlteration.componentValidate
}

/** Get state of alterations validity. */
export const getAlterationValidFlags = (state: StateIF): ValidFlagsIF => {
  return state.stateModel.newAlteration.validFlags
}

/** Get state of alterations components validity. */
export const getValidComponentFlags = (state: StateIF): ValidComponentsIF => {
  return state.stateModel.newAlteration.validComponents
}

export const getDefaultCorrectionDetailComment = (state: StateIF): string => {
  // *** TODO: fix this, since header.data is UTC
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

export const getDocumentOptionalEmail = (state: StateIF): string => {
  return state.stateModel.documentDelivery.documentOptionalEmail
}

/** Check for a 7 digit pattern to identify a Numbered company from the legal name. */
export const isNumberedCompany = (state: StateIF): boolean => {
  return RegExp('^\\d{7}$').test(state.stateModel.businessInformation?.legalName?.split(' ')[0])
}

/** Check for conflicting legal types between current type and altered type. */
export const isConflictingLegalType = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.entityType !== state.stateModel.nameRequest.legalType)
}

/** Get Summary mode state. */
export const isSummaryMode = (state: StateIF): boolean => {
  return state.stateModel.summaryMode
}

/** Whether business name has changed. */
export const hasBusinessNameChanged = (state: StateIF): boolean => {
  const originalLegalName = state.stateModel.originalSnapshot?.businessInfo.legalName
  return (state.stateModel.nameRequest?.legalName !== originalLegalName)
}

/** Whether business type has changed. */
export const hasBusinessTypeChanged = (state: StateIF): boolean => {
  const originalLegalType = state.stateModel.originalSnapshot?.businessInfo.legalType
  return (state.stateModel.tombstone.entityType !== originalLegalType)
}

/** Check for changes between current contact and original contact. */
export const hasContactInfoChanged = (state: StateIF): boolean => {
  const businessContact = state.stateModel.defineCompanyStep.businessContact

  return (
    (businessContact.email !== getSnapshotContact(state).email) ||
    (businessContact.phone !== getSnapshotContact(state).phone) ||
    (businessContact.extension !== getSnapshotContact(state).extension)
  )
}

/** Whether share structure data has changed. */
export const hasShareStructureChanged = (state: StateIF): boolean => {
  let currentShareClasses = getShareClasses(state)
  let originalShareClasses = state.stateModel.originalSnapshot?.shareStructure.shareClasses

  // Null action properties can be assigned to the ShareClasses when cancelling edits
  // This is fail safe to ensure null actions are not included in the comparison
  const removeNullProps = (obj) => {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v != null)
        .map(([k, v]) => [k, v === Object(v) ? removeNullProps(v) : v])
    )
  }

  currentShareClasses = currentShareClasses && removeNullProps(currentShareClasses)
  originalShareClasses = originalShareClasses && removeNullProps(originalShareClasses)

  return (!isEqual(originalShareClasses, currentShareClasses))
}

/** Get Provisions Removed state. */
export const getProvisionsRemoved = (state: StateIF): boolean => {
  return (state.stateModel.newAlteration.provisionsRemoved === true)
}

/** Get original resolution dates. */
export const getPreviousResolutionDates = (state: StateIF): ResolutionsIF[] => {
  return state.stateModel.shareStructureStep.previousResolutionDates
}

/** Get new resolution dates. */
export const getNewResolutionDates = (state: StateIF): string[] => {
  return state.stateModel.shareStructureStep.resolutionDates
}

/** Whether new resolution dates has changed. */
export const hasNewResolutionDatesChanged = (state: StateIF): boolean => {
  return (getNewResolutionDates(state)?.length > 0)
}

/** Get the court order number. fileNumber is the backend name for Court Order Number */
export const getFileNumber = (state: StateIF): string => {
  return state.stateModel.newAlteration.courtOrder.fileNumber
}

/** Get Plan of Arrangement state. */
export const getHasPlanOfArrangement = (state: StateIF): boolean => {
  return state.stateModel.newAlteration.courtOrder.hasPlanOfArrangement
}

/** Get boolean indicating if the share structure contains any special rights of restrictions. */
export const getHasRightsOrRestrictions = (state: StateIF): any => {
  const shareClasses = state.stateModel.shareStructureStep.shareClasses

  // Search and return on the first match
  // Don't need to search Series, as they can't exist on a parent without rights or restrictions
  return shareClasses.some(shareClass => shareClass.hasRightsOrRestrictions)
}

/** Get boolean indicating if the share structure contains any special rights of restrictions. */
export const getHasOriginalRightsOrRestrictions = (state: StateIF): any => {
  const shareClasses = state.stateModel.originalSnapshot?.shareStructure?.shareClasses

  // Search and return on the first match
  // Don't need to search Series, as they can't exist on a parent without rights or restrictions
  return shareClasses?.some(shareClass => shareClass.hasRightsOrRestrictions)
}

/** Get resolution dates validity. */
export const getIsResolutionDatesValid = (state: StateIF): boolean => {
  if (hasShareStructureChanged(state) &&
    (getHasOriginalRightsOrRestrictions(state) || getHasRightsOrRestrictions(state))
  ) {
    return getNewResolutionDates(state).length >= 1
  }
  return true
}

/**
 * Whether to show the fee summary.
 * This is a safety check to ensure that fee summary component is not loaded
 * until there is a valid filing type and entity code.
 */
export const showFeeSummary = (state: StateIF): boolean => {
  const defaultFilingData = {
    filingTypeCode: null as FilingCodes,
    entityType: null as CorpTypeCd,
    priority: false,
    waiveFees: false
  }
  const haveFilingChange = (
    (isCorrectionFiling(state) && hasCorrectionChanged(state)) ||
    (isAlterationFiling(state) && hasAlterationChanged(state))
  )
  return (haveFilingChange && !isEqual(getFilingData(state), defaultFilingData))
}

/** Get current fees state. */
export const getCurrentFees = (state: StateIF): FeesIF => {
  return state.stateModel.currentFees
}

/** Get fee prices state. */
export const getFeePrices = (state: StateIF): FeesIF => {
  return state.stateModel.feePrices
}

/** A boolean indicating if the minimum share classes requirements are not met. */
export const invalidMinimumShareClass = (state: StateIF): boolean => {
  const shareClasses = state.stateModel.shareStructureStep.shareClasses

  // Filter out REMOVED class actions
  const currentShareClasses = shareClasses.filter(x => x.action !== ActionTypes.REMOVED)

  return currentShareClasses.length < 1
}
