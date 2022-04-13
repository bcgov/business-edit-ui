import { AccountTypes, ActionTypes, CorpTypeCd, FilingCodes, FilingNames, FilingTypes, OfficeTypes } from '@/enums'
import {
  AddressesIF,
  IncorporationFilingIF,
  NameRequestDetailsIF,
  NameRequestApplicantIF,
  OrgPersonIF,
  ShareClassIF,
  NameRequestIF,
  BusinessInformationIF,
  CertifyIF,
  NameTranslationIF,
  NaicsIF,
  FilingDataIF,
  StateIF,
  EffectiveDateTimeIF,
  ShareStructureIF,
  FlagsReviewCertifyIF,
  FlagsCompanyInfoIF,
  ResolutionsIF,
  FeesIF,
  ResourceIF,
  EntitySnapshotIF
} from '@/interfaces'
import { ContactPointIF, StaffPaymentIF } from '@bcrs-shared-components/interfaces'
import { isEqual } from 'lodash'
import { isSame } from '@/utils/common-helper'

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

/** Is True if entity is a Benefit Company. */
export const isBComp = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.BENEFIT_COMPANY)
}

/** Whether the current filing is a correction. */
export const isCorrectionFiling = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.filingType === FilingTypes.CORRECTION)
}

/** Whether the current filing is an alteration. */
export const isAlterationFiling = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.filingType === FilingTypes.ALTERATION)
}

/** Whether the current filing is a change filing. */
export const isChangeFiling = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.filingType === FilingTypes.CHANGE_OF_REGISTRATION)
}

/** The entity type. */
export const getEntityType = (state: StateIF): CorpTypeCd => {
  return state.stateModel.tombstone.entityType
}

/** Whether the entity is a Benefit Company. */
export const isTypeBcomp = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.BENEFIT_COMPANY)
}

/** Whether the entity is a Cooperative. */
export const isTypeCoop = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.COOP)
}

/** Whether the entity is a BC Company. */
export const isTypeBcCompany = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.BC_COMPANY)
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

/** The original business snapshot. */
export const getEntitySnapshot = (state: StateIF): EntitySnapshotIF => {
  return state.stateModel.entitySnapshot
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
  return state.stateModel.tombstone.folioNumber
}

/** The transactional folio number. */
export const getTransactionalFolioNumber = (state: StateIF): string => {
  return state.stateModel.tombstone.transactionalFolioNumber
}

/** The current Naics code and description. */
export const getCurrentNaics = (state: StateIF): NaicsIF => {
  return {
    naicsCode: getBusinessInformation(state).naicsCode,
    naicsDescription: getBusinessInformation(state).naicsDescription
  }
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

/** The office addresses. */
export const getOfficeAddresses = (state: StateIF): AddressesIF => {
  return state.stateModel.officeAddresses
}

/** The people and roles list. */
export const getPeopleAndRoles = (state: StateIF): Array<OrgPersonIF> => {
  return state.stateModel.peopleAndRoles.orgPeople
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
  return state.stateModel.businessContact
}

export const getSnapshotBusinessContact = (state: StateIF): ContactPointIF => {
  return state.stateModel.entitySnapshot?.authInfo?.contact
}

export const getSnapshotFolioNumber = (state: StateIF): string => {
  return state.stateModel.entitySnapshot?.authInfo?.folioNumber
}

export const getSnapshotShareStructure = (state: StateIF): ShareStructureIF => {
  return state.stateModel.entitySnapshot?.shareStructure
}

export const getSnapshotBusinessInfo = (state: StateIF): BusinessInformationIF => {
  return state.stateModel.entitySnapshot?.businessInfo
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
  return state.stateModel.peopleAndRoles.valid
}

/** Whether Define Company Step is valid. */
export const isDefineCompanyStepValid = (state: StateIF): boolean => {
  return state.stateModel.validFlags.defineCompanyStep
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
    state.stateModel.peopleAndRoles.changed ||
    state.stateModel.changedFlags.defineCompanyStep ||
    state.stateModel.shareStructureStep.changed ||
    state.stateModel.incorporationAgreementStep.changed
  )
}

/**
 * Whether any alteration data has changed (for the purpose of showing the
 * fee summary), ie, does NOT include:
 * - alteration date and time
 * - alteration documents delivery
 * - certify
 * - folio number
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

/**
 * Whether any change form data has changed (for the purpose of showing the
 * fee summary), ie, does NOT include:
 * - document delivery
 * - certify
 * - folio number
 * - court order and POA
 * - staff payment
 */
export const hasFirmChanged = (state: StateIF): boolean => {
  return (
    hasBusinessNameChanged(state) ||
    hasNatureOfBusinessChanged(state) ||
    hasOfficeAddressesChanged(state) ||
    hasPeopleAndRolesChanged(state)
  )
}

/** Whether all correction/alteration sections are valid. */
export const isFilingValid = (state: StateIF): boolean => {
  // NB: Define Company and Agreement Type don't have a "valid" state --
  //     they don't allow saving an invalid state to the store.
  return (state.stateModel.peopleAndRoles.valid &&
    state.stateModel.detail.valid &&
    state.stateModel.certifyState.valid &&
    state.stateModel.staffPaymentStep.valid)
}

/** Whether any correction sections are in editing mode. */
export const isEditing = (state: StateIF): boolean => {
  // NB: Detail, Certify and Staff Payment don't have an "editing" mode.
  return (state.stateModel.editingFlags.companyName ||
    state.stateModel.editingFlags.nameTranslations ||
    state.stateModel.editingFlags.officeAddresses ||
    state.stateModel.editingFlags.folioNumber ||
    state.stateModel.editingFlags.peopleAndRoles ||
    state.stateModel.editingFlags.shareStructure ||
    state.stateModel.editingFlags.incorporationAgreement)
}

/** Flag to prompt app level validations. */
export const getAppValidate = (state: StateIF): boolean => {
  return state.stateModel.validationFlags.appValidate
}

/** Flag to prompt component level validations. */
export const getComponentValidate = (state: StateIF): boolean => {
  return state.stateModel.validationFlags.componentValidate
}

/** The review and certify page validity flags. */
export const getFlagsReviewCertify = (state: StateIF): FlagsReviewCertifyIF => {
  return state.stateModel.validationFlags.flagsReviewCertify
}

/** The company info page validity flags. */
export const getFlagsCompanyInfo = (state: StateIF): FlagsCompanyInfoIF => {
  return state.stateModel.validationFlags.flagsCompanyInfo
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

export const getResource = (state: StateIF): ResourceIF => {
  return state.resourceModel
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
  return (getEntityType(state) !== state.stateModel.nameRequest.legalType)
}

/** The Summary Mode state. */
export const isSummaryMode = (state: StateIF): boolean => {
  return state.stateModel.summaryMode
}

/** Whether business name has changed. */
export const hasBusinessNameChanged = (state: StateIF): boolean => {
  const originalLegalName = getSnapshotBusinessInfo(state)?.legalName
  return (state.stateModel.nameRequest?.legalName !== originalLegalName)
}

/** Whether business type has changed. */
export const hasBusinessTypeChanged = (state: StateIF): boolean => {
  const originalLegalType = getSnapshotBusinessInfo(state)?.legalType
  return (getEntityType(state) !== originalLegalType)
}

/** Whether contact info data has changed. */
export const hasContactInfoChanged = (state: StateIF): boolean => {
  const businessContact = getBusinessContact(state)

  return (
    (businessContact?.email !== getSnapshotBusinessContact(state)?.email) ||
    (businessContact?.phone !== getSnapshotBusinessContact(state)?.phone) ||
    (businessContact?.extension !== getSnapshotBusinessContact(state)?.extension)
  )
}

/** The dynamic Office type based on the current filing. */
export const officeType = (state: StateIF): OfficeTypes => {
  if (isChangeFiling(state)) return OfficeTypes.BUSINESS_OFFICE
  if (isAlterationFiling(state) || isCorrectionFiling(state)) return OfficeTypes.REGISTERED_OFFICE
}

/** True if any office address has changed. Applies to corrections and change filings only. */
export const hasOfficeAddressesChanged = (state: StateIF): boolean => {
  return (isCorrectionFiling(state) || isChangeFiling(state)) &&
    (mailingChanged(state) || deliveryChanged(state) ||
      // Exclude Records Address conditions from Change filing
      (!isChangeFiling(state) && (recMailingChanged(state) || recDeliveryChanged(state)))
    )
}

/** The office addresses from the original IA. NB: may be {} */
export const originalOfficeAddresses = (state: StateIF): AddressesIF => {
  if (isCorrectionFiling(state)) return (getOriginalIA(state)?.incorporationApplication.offices as AddressesIF)
  if (isChangeFiling(state)) return (getEntitySnapshot(state)?.addresses as AddressesIF)
}

/** True if (registered) mailing address has changed. */
export const mailingChanged = (state: StateIF): boolean => {
  return !isSame(getOfficeAddresses(state)?.[officeType(state)]?.mailingAddress,
    originalOfficeAddresses(state)?.[officeType(state)]?.mailingAddress, ['addressCountryDescription'])
}

/** True if (registered) delivery address has changed. */
export const deliveryChanged = (state: StateIF): boolean => {
  return !isSame(getOfficeAddresses(state)?.[officeType(state)]?.deliveryAddress,
    originalOfficeAddresses(state)?.[officeType(state)]?.deliveryAddress, ['addressCountryDescription'])
}

/** True if records mailing address has changed. */
export const recMailingChanged = (state: StateIF): boolean => {
  return !isSame(getOfficeAddresses(state)?.recordsOffice?.mailingAddress,
    originalOfficeAddresses(state)?.recordsOffice?.mailingAddress, ['addressCountryDescription'])
}

/** True if records delivery address has changed. */
export const recDeliveryChanged = (state: StateIF): boolean => {
  return !isSame(getOfficeAddresses(state)?.recordsOffice?.deliveryAddress,
    originalOfficeAddresses(state)?.recordsOffice?.deliveryAddress, ['addressCountryDescription'])
}

/** Whether orgPerson data has changed. */
export const hasPeopleAndRolesChanged = (state: StateIF): boolean => {
  let currentOrgPersons = getPeopleAndRoles(state)
  let originalOrgPersons = getEntitySnapshot(state)?.orgPersons

  return (!isSame(currentOrgPersons, originalOrgPersons, ['action', 'confirmNameChange']))
}

/** Is true when the minimum partners met. */
export const hasMinimumPartners = (state: StateIF): boolean => {
  return getPeopleAndRoles(state).filter(party => !party.action?.includes(ActionTypes.REMOVED)).length >= 2
}

/** Whether share structure data has changed. */
export const hasShareStructureChanged = (state: StateIF): boolean => {
  let currentShareClasses = getShareClasses(state)
  let originalShareClasses = getSnapshotShareStructure(state)?.shareClasses

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

/** Whether nature of business data has changed. */
export const hasNatureOfBusinessChanged = (state: StateIF): boolean => {
  let currentNatureOfBusiness = getBusinessInformation(state)?.naicsCode
  let originalNatureOfBusiness = getEntitySnapshot(state)?.businessInfo.naicsCode

  return (!isEqual(currentNatureOfBusiness, originalNatureOfBusiness))
}

/** The Provisions Removed state. */
export const getProvisionsRemoved = (state: StateIF): boolean => {
  return (state.stateModel.newAlteration.provisionsRemoved === true)
}

/** Tee original resolution dates. */
export const getPreviousResolutionDates = (state: StateIF): ResolutionsIF[] => {
  return state.stateModel.shareStructureStep.previousResolutionDates
}

/** The new resolution dates. */
export const getNewResolutionDates = (state: StateIF): string[] => {
  return state.stateModel.shareStructureStep.resolutionDates
}

/** Whether new resolution dates has changed. */
export const hasNewResolutionDatesChanged = (state: StateIF): boolean => {
  return (getNewResolutionDates(state)?.length > 0)
}

/** The file number (aka court order number). */
export const getFileNumber = (state: StateIF): string => {
  return state.stateModel.newAlteration.courtOrder.fileNumber
}

/** The Plan of Arrangement state. */
export const getHasPlanOfArrangement = (state: StateIF): boolean => {
  return state.stateModel.newAlteration.courtOrder.hasPlanOfArrangement
}

/** True if the share structure contains any special rights of restrictions. */
export const getHasRightsOrRestrictions = (state: StateIF): any => {
  const shareClasses = state.stateModel.shareStructureStep.shareClasses

  // Search and return on the first match
  // Don't need to search Series, as they can't exist on a parent without rights or restrictions
  return shareClasses.some(shareClass => shareClass.hasRightsOrRestrictions)
}

/** True if the share structure contains any special rights of restrictions. */
export const getHasOriginalRightsOrRestrictions = (state: StateIF): any => {
  const shareClasses = getSnapshotShareStructure(state)?.shareClasses

  // Search and return on the first match
  // Don't need to search Series, as they can't exist on a parent without rights or restrictions
  return shareClasses?.some(shareClass => shareClass.hasRightsOrRestrictions)
}

/** True if resolution dates are valid. */
export const getIsResolutionDatesValid = (state: StateIF): boolean => {
  if (hasShareStructureChanged(state) &&
    (getHasOriginalRightsOrRestrictions(state) || getHasRightsOrRestrictions(state))
  ) {
    return (getNewResolutionDates(state).length >= 1)
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
    (isAlterationFiling(state) && hasAlterationChanged(state)) ||
    (isChangeFiling(state) && hasFirmChanged(state))
  )
  return (haveFilingChange && !isEqual(getFilingData(state), defaultFilingData))
}

/** The current fees. */
export const getCurrentFees = (state: StateIF): FeesIF => {
  return state.stateModel.currentFees
}

/** The fee prices. */
export const getFeePrices = (state: StateIF): FeesIF => {
  return state.stateModel.feePrices
}

/** True if the minimum share classes requirements are not met. */
export const invalidMinimumShareClass = (state: StateIF): boolean => {
  const shareClasses = state.stateModel.shareStructureStep.shareClasses

  // Filter out REMOVED class actions
  const currentShareClasses = shareClasses.filter(x => x.action !== ActionTypes.REMOVED)

  return (currentShareClasses.length < 1)
}

/** Get state of company provisions validity. */
export const getIsCompanyProvisionsValid = (state: StateIF): boolean => {
  return state.stateModel.validationFlags.flagsCompanyInfo.isValidCompanyProvisions
}

/** The current filing name. */
export const getFilingName = (state: StateIF): FilingNames => {
  if (isCorrectionFiling(state)) return FilingNames.CORRECTION
  if (isAlterationFiling(state)) return FilingNames.ALTERATION
  if (isChangeFiling(state)) return FilingNames.CHANGE_OF_REGISTRATION
}
