import { AccountTypes, ActionTypes, FilingCodes, FilingNames, FilingTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { AddressesIF, IncorporationFilingIF, NameRequestDetailsIF, NameRequestApplicantIF, OrgPersonIF,
  ShareClassIF, NameRequestIF, BusinessInformationIF, CertifyIF, NameTranslationIF, FilingDataIF, StateIF,
  EffectiveDateTimeIF, FlagsReviewCertifyIF, FlagsCompanyInfoIF, ResolutionsIF, FeesIF,
  ResourceIF, EntitySnapshotIF, ChgRegistrationFilingIF, RegistrationFilingIF, CorrectedFilingIF,
  ValidationFlagsIF, IncorporationApplicationIF, ChgRegistrationIF, RegistrationIF } from '@/interfaces/'
import { CompletingPartyIF, ContactPointIF, NaicsIF, StaffPaymentIF } from '@bcrs-shared-components/interfaces/'
import { isEqual } from 'lodash'
import { isSame } from '@/utils/'

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

/** Whether the current filing is a change of registration filing. */
export const isChangeRegFiling = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.filingType === FilingTypes.CHANGE_OF_REGISTRATION)
}

/** Whether the current filing is a conversion filing. */
export const isConversionFiling = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.filingType === FilingTypes.CONVERSION)
}

/** Whether the current filing is a Benefit Company IA correction. */
export const isBenIaCorrectionFiling = (state: StateIF): boolean => {
  return (isCorrectionFiling(state) && isEntityTypeBEN(state))
}

/** Whether the current filing is a Firm correction. */
export const isFirmCorrectionFiling = (state: StateIF): boolean => {
  if (isCorrectionFiling(state) && isEntityTypeFirm(state)) return true
  return false
}

/** Whether the current filing is a firm conversion filing. */
export const isFirmConversionFiling = (state: StateIF): boolean => {
  return (isEntityTypeFirm(state) && isConversionFiling(state))
}

/** The entity type. */
export const getEntityType = (state: StateIF): CorpTypeCd => {
  return state.stateModel.tombstone.entityType
}

/** Whether the entity is a Benefit Company. */
export const isEntityTypeBEN = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.BENEFIT_COMPANY)
}

/** Whether the entity is a Cooperative. */
export const isEntityTypeCP = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.COOP)
}

/** Whether the entity is a BC Company. */
export const isEntityTypeBC = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.BC_COMPANY)
}

/** Whether the entity is a Sole Proprietorship. */
export const isEntityTypeSP = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.SOLE_PROP)
}

/** Whether the entity is a General Partnership. */
export const isEntityTypeGP = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.PARTNERSHIP)
}

/** Whether the entity is a Firm (SP or GP). */
export const isEntityTypeFirm = (state: StateIF): boolean => {
  return (isEntityTypeSP(state) || isEntityTypeGP(state))
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
  return getBusinessInformation(state).foundingDate
}

/** The original filing's name. */
export const getOriginalFilingName = (state: StateIF): string => {
  if (getOriginalIA(state)) return FilingNames.INCORPORATION_APPLICATION
  if (getOriginalChgRegistration(state)) return FilingNames.CHANGE_OF_REGISTRATION
  if (getOriginalRegistration(state)) return FilingNames.REGISTRATION
  return null
}

/** The original filing's filing date-time. */
export const getOriginalFilingDateTime = (state: StateIF): string => {
  return getCorrectedFiling(state)?.header.date
}

/** The original filing's effective date-time. */
export const getOriginalEffectiveDateTime = (state: StateIF): string => {
  return getCorrectedFiling(state)?.header.effectiveDate
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

/** The filing id. */
export const getFilingId = (state: StateIF): number => {
  return state.stateModel.tombstone.filingId
}

/** The corrected filing id. */
export const getCorrectedFilingId = (state: StateIF): number => {
  return state.stateModel.tombstone.correctedFilingId
}

/** The corrected filing type. */
export const getCorrectedFilingType = (state: StateIF): string => {
  return getCorrectedFiling(state).header.name
}

/** get error correction type (client or a staff error correction). */
export const getErrorCorrectionType = (state: StateIF): string => {
  return state.stateModel.tombstone.type
}

/** The business identifier (aka incorporation number). */
export const getBusinessId = (state: StateIF): string => {
  return state.stateModel.tombstone.businessId
}

/** The business identifier (aka incorporation number). */
export const getCurrentBusinessName = (state: StateIF): string => {
  // return the legal name from the name request for BEN IA corrections
  // or the legal name of the business for others
  return (
    getOriginalIA(state)?.nameRequest?.legalName ||
    getBusinessInformation(state).legalName
  )
}

/** The original filing being corrected. */
export const getCorrectedFiling = (state: StateIF): CorrectedFilingIF => {
  return state.stateModel.correctedFiling
}

/** The original IA being corrected. Only exists for corrections. */
export const getOriginalIA = (state: StateIF): IncorporationApplicationIF => {
  const filing = getCorrectedFiling(state) as unknown as IncorporationFilingIF
  return filing?.incorporationApplication
}

/** The original Change of Registration being corrected. Only exists for corrections. */
export const getOriginalChgRegistration = (state: StateIF): ChgRegistrationIF => {
  const filing = getCorrectedFiling(state) as unknown as ChgRegistrationFilingIF
  return filing?.changeOfRegistration
}

/** The original Registration being corrected. Only exists for corrections. */
export const getOriginalRegistration = (state: StateIF): RegistrationIF => {
  const filing = getCorrectedFiling(state) as unknown as RegistrationFilingIF
  return filing?.registration
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

/** The current user's info. (May be null.) */
export const getUserInfo = (state: StateIF): any => {
  return state.stateModel.tombstone.userInfo
}

/** The org info. (May be null.) */
export const getOrgInfo = (state: StateIF): any => {
  return state.stateModel.tombstone.orgInfo
}

/** The current user's email. (May be undefined.) */
export const getUserEmail = (state: StateIF): string => {
  // get email from contacts[0] if it exists (ie, for BCSC users)
  // else get email from root object
  return getUserInfo(state)?.contacts[0]?.email || getUserInfo(state)?.email
}

/** The current user's phone. (May be undefined.) */
export const getUserPhone = (state: StateIF): string => {
  // get phone from contacts[0] if it exists (ie, for BCSC users)
  // else get phone from root object
  return getUserInfo(state)?.contacts[0]?.phone || getUserInfo(state)?.phone
}

/** The current user's first name. (May be undefined.) */
export const getUserFirstName = (state: StateIF): string => {
  return getUserInfo(state)?.firstname
}

/** The current user's last name. (May be undefined.) */
export const getUserLastName = (state: StateIF): string => {
  return getUserInfo(state)?.lastname
}

/** The current user's roles. (May be undefined.) */
export const getUserRoles = (state: StateIF): any => {
  return getUserInfo(state)?.roles
}

/** The current user's username. (May be undefined.) */
export const getUserUsername = (state: StateIF): string => {
  return getUserInfo(state)?.username
}

/** The folio number. */
export const getFolioNumber = (state: StateIF): string => {
  return state.stateModel.tombstone.folioNumber
}

/** The transactional folio number. */
export const getTransactionalFolioNumber = (state: StateIF): string => {
  return state.stateModel.tombstone.transactionalFolioNumber
}

/** The current NAICS object. */
export const getCurrentNaics = (state: StateIF): NaicsIF => {
  return {
    naicsCode: getBusinessInformation(state).naicsCode,
    naicsDescription: getBusinessInformation(state).naicsDescription
  }
}

/** The snapshot NAICS object. */
export const getSnapshotNaics = (state: StateIF): NaicsIF => {
  return {
    naicsCode: getEntitySnapshot(state)?.businessInfo?.naicsCode,
    naicsDescription: getEntitySnapshot(state)?.businessInfo?.naicsDescription
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

/** Identify if changes were made to the NR number. */
export const hasNewNr = (state: StateIF): boolean => {
  const newNrNumber = state.stateModel.nameRequest?.nrNumber

  // evaluate only if a new NR exists
  if (newNrNumber) {
    let originalNrNumber = null

    if (getOriginalIA(state)) {
      originalNrNumber = getOriginalIA(state).nameRequest?.nrNumber
    } else if (getOriginalChgRegistration(state)) {
      // *** FUTURE: since we may or may not be correcting the latest filing,
      // does it make sense to get the NR number from this change of registration filing?
      originalNrNumber = getOriginalChgRegistration(state).nameRequest?.nrNumber
    } else if (getOriginalRegistration(state)) {
      // *** FUTURE: since we may or may not be correcting the latest filing,
      // does it make sense to get the NR number from the registration filing?
      originalNrNumber = getOriginalRegistration(state).nameRequest?.nrNumber
    }

    return (newNrNumber !== originalNrNumber)
  }
  return false
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
export const hasCorrectionDataChanged = (state: StateIF): boolean => {
  if (isBenIaCorrectionFiling(state)) {
    return (
      state.stateModel.peopleAndRoles.changed ||
      state.stateModel.changedFlags.defineCompanyStep ||
      state.stateModel.shareStructureStep.changed ||
      state.stateModel.incorporationAgreementStep.changed
    )
  }
  if (isFirmCorrectionFiling(state)) {
    return true // *** FUTURE: implement as needed
  }
  return false // should never happen
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
export const hasAlterationDataChanged = (state: StateIF): boolean => {
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
 * Whether any firm change data has changed (for the purpose of showing the
 * fee summary), ie, does NOT include:
 * - document delivery
 * - certify
 * - folio number
 * - court order and POA
 * - staff payment
 */
export const hasChangeDataChanged = (state: StateIF): boolean => {
  return (
    hasBusinessNameChanged(state) ||
    hasNatureOfBusinessChanged(state) ||
    hasOfficeAddressesChanged(state) ||
    hasPeopleAndRolesChanged(state)
  )
}

/**
 * Whether any firm conversion data has changed (for the purpose of showing the
 * fee summary), ie, does NOT include:
 * - document delivery
 * - certify
 * - folio number
 * - court order and POA
 * - staff payment
 */
export const hasConversionDataChanged = (state: StateIF): boolean => {
  return (
    hasNatureOfBusinessChanged(state) ||
    hasOfficeAddressesChanged(state) ||
    hasPeopleAndRolesChanged(state)
  )
}

/** Whether all correction sections are valid. */
export const isFilingValid = (state: StateIF): boolean => {
  if (isBenIaCorrectionFiling(state)) {
    // NB: Define Company and Agreement Type don't have a "valid" state --
    //     they don't allow saving an invalid state to the store.
    return (
      state.stateModel.peopleAndRoles.valid &&
      state.stateModel.detail.valid &&
      state.stateModel.certifyState.valid &&
      state.stateModel.staffPaymentStep.valid
    )
  }
  if (isFirmCorrectionFiling(state)) {
    // *** FUTURE: should check the following:
    // business name
    // nature of business
    // business addresses
    // proprietor / partners
    // completing party (client error correction only)
    // detail
    // certify (client error correction only)
    // staff payment
    return (
      state.stateModel.peopleAndRoles.valid &&
      state.stateModel.detail.valid &&
      state.stateModel.certifyState.valid &&
      state.stateModel.staffPaymentStep.valid
    )
  }
  return false // should never happen
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

/** The validation flags. */
export const getValidationFlags = (state: StateIF): ValidationFlagsIF => {
  return state.stateModel.validationFlags
}

/** Flag to prompt app level validations. */
export const getAppValidate = (state: StateIF): boolean => {
  return getValidationFlags(state).appValidate
}

/** Flag to prompt component level validations. */
export const getComponentValidate = (state: StateIF): boolean => {
  return getValidationFlags(state).componentValidate
}

/** The review and certify page validity flags. */
export const getFlagsReviewCertify = (state: StateIF): FlagsReviewCertifyIF => {
  return getValidationFlags(state).flagsReviewCertify
}

/** The company info page validity flags. */
export const getFlagsCompanyInfo = (state: StateIF): FlagsCompanyInfoIF => {
  return getValidationFlags(state).flagsCompanyInfo
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
  return RegExp('^\\d{7}$').test(getBusinessInformation(state)?.legalName?.split(' ')[0])
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
  const originalLegalName = getEntitySnapshot(state)?.businessInfo?.legalName
  return (state.stateModel.nameRequest?.legalName !== originalLegalName)
}

/** Whether business type has changed. */
export const hasBusinessTypeChanged = (state: StateIF): boolean => {
  const originalLegalType = getEntitySnapshot(state)?.businessInfo?.legalType
  return (getEntityType(state) !== originalLegalType)
}

/** Whether contact info data has changed. */
export const hasContactInfoChanged = (state: StateIF): boolean => {
  const businessContact = getBusinessContact(state)
  const snapshotContact = getEntitySnapshot(state)?.authInfo?.contact

  return (
    (businessContact?.email !== snapshotContact?.email) ||
    (businessContact?.phone !== snapshotContact?.phone) ||
    (businessContact?.extension !== snapshotContact?.extension)
  )
}

/** True if any office address has changed. Applies to corrections, change and conversion filings only. */
export const hasOfficeAddressesChanged = (state: StateIF): boolean => {
  if (isCorrectionFiling(state) || isChangeRegFiling(state) || isFirmConversionFiling(state)) {
    const hasMailingDeliveryChanged = hasMailingChanged(state) || hasDeliveryChanged(state)
    const isChangeOrConversionFiling = isChangeRegFiling(state) || isFirmConversionFiling(state)
    const hasRecMailingDeliveryChanged = hasRecMailingChanged(state) || hasRecDeliveryChanged(state)
    return (
      hasMailingDeliveryChanged ||
      // exclude Records Address conditions from Change or Conversion filing
      (!isChangeOrConversionFiling && hasRecMailingDeliveryChanged)
    )
  }
  return false
}

/** The office addresses from the original filing. NB: may be {} */
export const getOriginalOfficeAddresses = (state: StateIF): AddressesIF => {
  if (getOriginalIA(state)) {
    return getOriginalIA(state).offices as AddressesIF
  } else {
    return getEntitySnapshot(state)?.addresses
  }
}

/** True if (registered) mailing address has changed. */
export const hasMailingChanged = (state: StateIF): boolean => {
  if (isAlterationFiling(state) || isBenIaCorrectionFiling(state)) {
    return !isSame(
      getOfficeAddresses(state)?.registeredOffice?.mailingAddress,
      getOriginalOfficeAddresses(state)?.registeredOffice?.mailingAddress,
      ['addressCountryDescription']
    )
  }
  if (isChangeRegFiling(state) || isFirmConversionFiling(state) || isFirmCorrectionFiling(state)) {
    return !isSame(
      getOfficeAddresses(state)?.businessOffice?.mailingAddress,
      getOriginalOfficeAddresses(state)?.businessOffice?.mailingAddress,
      ['addressCountryDescription']
    )
  }
  return false // should never happen
}

/** True if (registered) delivery address has changed. */
export const hasDeliveryChanged = (state: StateIF): boolean => {
  if (isAlterationFiling(state) || isBenIaCorrectionFiling(state)) {
    return !isSame(
      getOfficeAddresses(state)?.registeredOffice?.deliveryAddress,
      getOriginalOfficeAddresses(state)?.registeredOffice?.deliveryAddress,
      ['addressCountryDescription']
    )
  }
  if (isChangeRegFiling(state) || isFirmConversionFiling(state) || isFirmCorrectionFiling(state)) {
    return !isSame(
      getOfficeAddresses(state)?.businessOffice?.deliveryAddress,
      getOriginalOfficeAddresses(state)?.businessOffice?.deliveryAddress,
      ['addressCountryDescription']
    )
  }
  return false // should never happen
}

/** True if records mailing address has changed. */
export const hasRecMailingChanged = (state: StateIF): boolean => {
  return !isSame(
    getOfficeAddresses(state)?.recordsOffice?.mailingAddress,
    getOriginalOfficeAddresses(state)?.recordsOffice?.mailingAddress,
    ['addressCountryDescription']
  )
}

/** True if records delivery address has changed. */
export const hasRecDeliveryChanged = (state: StateIF): boolean => {
  return !isSame(
    getOfficeAddresses(state)?.recordsOffice?.deliveryAddress,
    getOriginalOfficeAddresses(state)?.recordsOffice?.deliveryAddress,
    ['addressCountryDescription']
  )
}

/** Whether orgPerson data has changed. */
export const hasPeopleAndRolesChanged = (state: StateIF): boolean => {
  let currentOrgPersons = getPeopleAndRoles(state)
  let originalOrgPersons = getEntitySnapshot(state)?.orgPersons

  return !isSame(currentOrgPersons, originalOrgPersons, ['actions', 'confirmNameChange'])
}

/** Is true when the minimum proprietors is met. */
export const hasMinimumProprietor = (state: StateIF): boolean => {
  // REMOVED parties are still in the parties array until FILING, so exclude them for component level validations
  return (
    !isEntityTypeSP(state) ||
    getPeopleAndRoles(state).filter(party => !party.actions?.includes(ActionTypes.REMOVED)).length === 1
  )
}

/** Is true when the minimum partners met. */
export const hasMinimumPartners = (state: StateIF): boolean => {
  // REMOVED parties are still in the parties array until FILING, so exclude them for component level validations
  return (
    !isEntityTypeGP(state) ||
    getPeopleAndRoles(state).filter(party => !party.actions?.includes(ActionTypes.REMOVED)).length >= 2
  )
}

/** Whether share structure data has changed. */
export const hasShareStructureChanged = (state: StateIF): boolean => {
  let currentShareClasses = getShareClasses(state)
  let originalShareClasses = getEntitySnapshot(state)?.shareStructure?.shareClasses

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

  return !isEqual(originalShareClasses, currentShareClasses)
}

/** Whether nature of business data has changed. */
export const hasNatureOfBusinessChanged = (state: StateIF): boolean => {
  const currentNatureOfBusiness = getBusinessInformation(state)?.naicsCode
  const originalNatureOfBusiness = getEntitySnapshot(state)?.businessInfo.naicsCode

  return !isEqual(currentNatureOfBusiness, originalNatureOfBusiness)
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
  const shareClasses = getEntitySnapshot(state)?.shareStructure?.shareClasses

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
    (isCorrectionFiling(state) && hasCorrectionDataChanged(state)) ||
    (isAlterationFiling(state) && hasAlterationDataChanged(state)) ||
    (isChangeRegFiling(state) && hasChangeDataChanged(state)) ||
    (isFirmConversionFiling(state) && hasConversionDataChanged(state))
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

/** The current filing name. */
export const getFilingName = (state: StateIF): FilingNames => {
  if (isCorrectionFiling(state)) return FilingNames.CORRECTION
  if (isAlterationFiling(state)) return FilingNames.ALTERATION
  if (isChangeRegFiling(state)) return FilingNames.CHANGE_OF_REGISTRATION
  if (isFirmConversionFiling(state)) return FilingNames.CONVERSION
  return null
}

/** The completing party data. */
export const getCompletingParty = (state: StateIF): CompletingPartyIF => {
  return state.stateModel.completingParty
}
