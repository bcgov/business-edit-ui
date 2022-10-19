import { AccountTypes, ActionTypes, CoopTypes, CorrectionErrorTypes, FilingCodes, FilingNames,
  FilingTypes, PartyTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { AddressesIF, OrgPersonIF, ShareClassIF, NameRequestIF, BusinessInformationIF,
  CertifyIF,
  NameTranslationIF, FilingDataIF, StateIF, EffectiveDateTimeIF, FlagsReviewCertifyIF,
  FlagsCompanyInfoIF, ResolutionsIF, FeesIF, ResourceIF, EntitySnapshotIF, ValidationFlagsIF,
  CorrectionInformationIF }
  from '@/interfaces/'
import { CompletingPartyIF, ContactPointIF, NaicsIF, StaffPaymentIF, SpecialResolutionIF }
  from '@bcrs-shared-components/interfaces/'
import { IsSame } from '@/utils/'

/** Whether the user has "staff" keycloak role. */
export const isRoleStaff = (state: StateIF): boolean => {
  return state.stateModel.tombstone.keycloakRoles.includes('staff')
}

/** Whether the current account is SBC Staff. */
export const isSbcStaff = (state: StateIF): boolean => {
  return state.stateModel.accountInformation?.accountType === AccountTypes.SBC_STAFF
}

/** Whether the user is authorized to edit. */
export const isAuthEdit = (state: StateIF): boolean => {
  return state.stateModel.tombstone.authRoles.includes('edit')
}

/** Whether the user is authorized to view. */
export const isAuthView = (state: StateIF): boolean => {
  return state.stateModel.tombstone.authRoles.includes('view')
}

/** Whether the current filing is a Correction. */
export const isCorrectionFiling = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.filingType === FilingTypes.CORRECTION)
}

/** Whether the current filing is an Alteration. */
export const isAlterationFiling = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.filingType === FilingTypes.ALTERATION)
}

/** Whether the current filing is a Special Resolution. */
export const isSpecialResolutionFiling = (state: StateIF): boolean => {
  return (state.stateModel.tombstone.filingType === FilingTypes.SPECIAL_RESOLUTION)
}

/** Whether the current filing is a firm Change of Registration. */
export const isFirmChangeFiling = (state: StateIF): boolean => {
  return (
    isEntityTypeFirm(state) &&
    (state.stateModel.tombstone.filingType === FilingTypes.CHANGE_OF_REGISTRATION)
  )
}

/** Whether the current filing is a Benefit Company Correction. */
export const isBenCorrectionFiling = (state: StateIF): boolean => {
  return (isEntityTypeBEN(state) && isCorrectionFiling(state))
}

/** Whether the current filing is a firm Correction. */
export const isFirmCorrectionFiling = (state: StateIF): boolean => {
  return (isEntityTypeFirm(state) && isCorrectionFiling(state))
}

/** Whether the current filing is a firm Conversion. */
export const isFirmConversionFiling = (state: StateIF): boolean => {
  return (
    isEntityTypeFirm(state) &&
    (state.stateModel.tombstone.filingType === FilingTypes.CONVERSION)
  )
}

/** Whether the current corrected filing is an Incorporation Application. */
export const isCorrectedIncorporationApplication = (state: StateIF): boolean => {
  return (getCorrectedFilingType(state) === FilingTypes.INCORPORATION_APPLICATION)
}

/** Whether the current corrected filing is a Registration. */
export const isCorrectedRegistration = (state: StateIF): boolean => {
  return (getCorrectedFilingType(state) === FilingTypes.REGISTRATION)
}

/** Whether the current corrected filing is a Change of Registration. */
export const isCorrectedChangeReg = (state: StateIF): boolean => {
  return (getCorrectedFilingType(state) === FilingTypes.CHANGE_OF_REGISTRATION)
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

/** The business' founding date (API format). */
export const getBusinessFoundingDateTime = (state: StateIF): string => {
  return getBusinessInformation(state).foundingDate
}

/** The business' start date (YYYY-MM-DD). */
export const getBusinessStartDate = (state: StateIF): string => {
  return getBusinessInformation(state).startDate
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

/** The corrected filing's date (API format). */
export const getCorrectedFilingDate = (state: StateIF): string => {
  return getCorrectionInformation(state).correctedFilingDate
}

/** The corrected filing's id. */
export const getCorrectedFilingId = (state: StateIF): number => {
  return getCorrectionInformation(state).correctedFilingId
}

/** The corrected filing's type. */
export const getCorrectedFilingType = (state: StateIF): FilingTypes => {
  return getCorrectionInformation(state).correctedFilingType
}

/** The correction error type. */
export const getCorrectionErrorType = (state: StateIF): CorrectionErrorTypes => {
  return getCorrectionInformation(state).type
}

/** The correction (business) start date (YYYY-MM-DD). */
export const getCorrectionStartDate = (state: StateIF): string => {
  return getCorrectionInformation(state).startDate
}

/** True if the correction is due to a client error. */
export const isClientErrorCorrection = (state: StateIF): boolean => {
  return (getCorrectionErrorType(state) === CorrectionErrorTypes.CLIENT)
}

/** The business identifier (aka incorporation number). */
export const getBusinessId = (state: StateIF): string => {
  return state.stateModel.tombstone.businessId
}

/** The original legal name. */
export const getOriginalLegalName = (state: StateIF): string => {
  return getEntitySnapshot(state)?.businessInfo?.legalName
}

/** The original entity snapshot. */
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

/** The association (coop) type. */
export const getAssociationType = (state: StateIF): CoopTypes => {
  return getBusinessInformation(state).associationType
}

/** The Name Request object. */
export const getNameRequest = (state: StateIF): NameRequestIF => {
  return state.stateModel.nameRequest
}

/** The Name Request Number. */
export const getNameRequestNumber = (state: StateIF): string => {
  return getNameRequest(state)?.nrNumber
}

/** The Name Request Legal Name (approved name). */
export const getNameRequestLegalName = (state: StateIF): string => {
  return getNameRequest(state)?.legalName
}

/** The name translations. */
export const getNameTranslations = (state: StateIF): NameTranslationIF[] => {
  return state.stateModel.nameTranslations
}

/** Whether name translations have changed. */
export const haveNameTranslationsChanged = (state: StateIF): boolean => {
  return (getNameTranslations(state).filter(x => x.action).length > 0)
}

/** The office addresses. */
export const getOfficeAddresses = (state: StateIF): AddressesIF => {
  return state.stateModel.officeAddresses
}

/** The org-people list. */
export const getOrgPeople = (state: StateIF): Array<OrgPersonIF> => {
  return state.stateModel.peopleAndRoles.orgPeople
}

/** The share classes list. */
export const getShareClasses = (state: StateIF): Array<ShareClassIF> => {
  return state.stateModel.shareStructureStep.shareClasses
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
  return state.stateModel.staffPayment
}

/** The filing data. */
export const getFilingData = (state: StateIF): FilingDataIF[] => {
  return state.stateModel.filingData
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
 * - completing party
 * - detail
 * - certify
 * - staff payment
 */
export const hasCorrectionDataChanged = (state: StateIF): boolean => {
  if (isBenCorrectionFiling(state)) {
    return (
      hasBusinessNameChanged(state) ||
      hasBusinessTypeChanged(state) ||
      haveNameTranslationsChanged(state) ||
      haveOfficeAddressesChanged(state) ||
      havePeopleAndRolesChanged(state) ||
      hasShareStructureChanged(state) ||
      areProvisionsRemoved(state) ||
      haveNewResolutionDates(state)
    )
  }

  if (isFirmCorrectionFiling(state)) {
    return (
      hasBusinessNameChanged(state) ||
      hasBusinessStartDateChanged(state) ||
      hasNaicsChanged(state) ||
      haveOfficeAddressesChanged(state) ||
      havePeopleAndRolesChanged(state)
    )
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
    haveNameTranslationsChanged(state) ||
    hasShareStructureChanged(state) ||
    areProvisionsRemoved(state) ||
    haveNewResolutionDates(state)
  )
}

/**
 * Whether any special resolution data has changed (for the purpose of showing the
 * fee summary), ie, does NOT include:
 * - certify
 * - folio number
 * - court order and POA
 * - staff payment
 * - address (read only)
 * - contact info
 */
// more to add while adding components
export const hasSpecialResolutionDataChanged = (state: StateIF): boolean => {
  return (
    hasBusinessNameChanged(state) ||
    hasBusinessTypeChanged(state) ||
    hasAssociationTypeChanged(state)
  )
}

/** Whether the special resolution filing is valid. Does NOT include:
 * - address (read only)
 * NOTE THIS IS INCOMPLETE - not entirely sure where to use this.
 * isCorrectionValid seems to disable the File and Pay button.
 */
export const isSpecialResolutionValid = (state: StateIF): boolean => {
  return (
    getFlagsCompanyInfo(state).isValidOrgPersons &&
    getFlagsCompanyInfo(state).isValidShareStructure &&
    getFlagsReviewCertify(state).isValidDetailComment &&
    getFlagsReviewCertify(state).isValidCertify &&
    getFlagsReviewCertify(state).isValidStaffPayment
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
    hasBusinessStartDateChanged(state) ||
    hasNaicsChanged(state) ||
    haveOfficeAddressesChanged(state) ||
    havePeopleAndRolesChanged(state)
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
    hasBusinessStartDateChanged(state) ||
    hasNaicsChanged(state) ||
    haveOfficeAddressesChanged(state) ||
    havePeopleAndRolesChanged(state)
  )
}

/** Whether the subject correction filing is valid. */
export const isCorrectionValid = (state: StateIF): boolean => {
  if (isBenCorrectionFiling(state)) {
    if (isClientErrorCorrection(state)) {
      return (
        getFlagsCompanyInfo(state).isValidCompanyName &&
        getFlagsCompanyInfo(state).isValidNameTranslation &&
        getFlagsCompanyInfo(state).isValidAddress &&
        getFlagsCompanyInfo(state).isValidOrgPersons &&
        getFlagsCompanyInfo(state).isValidShareStructure &&
        getFlagsReviewCertify(state).isValidDetailComment &&
        getFlagsReviewCertify(state).isValidCertify &&
        getFlagsReviewCertify(state).isValidStaffPayment
      )
    } else {
      return (
        getFlagsCompanyInfo(state).isValidCompanyName &&
        getFlagsCompanyInfo(state).isValidNameTranslation &&
        getFlagsCompanyInfo(state).isValidOrgPersons &&
        getFlagsCompanyInfo(state).isValidAddress &&
        getFlagsCompanyInfo(state).isValidShareStructure &&
        getFlagsReviewCertify(state).isValidDetailComment &&
        // don't check certify for staff correction
        getFlagsReviewCertify(state).isValidStaffPayment
      )
    }
  }

  if (isFirmCorrectionFiling(state)) {
    if (isClientErrorCorrection(state)) {
      return (
        getFlagsCompanyInfo(state).isValidCompanyName &&
        getFlagsCompanyInfo(state).isValidStartDate &&
        getFlagsCompanyInfo(state).isValidNatureOfBusiness &&
        getFlagsCompanyInfo(state).isValidAddress &&
        getFlagsCompanyInfo(state).isValidOrgPersons &&
        getFlagsReviewCertify(state).isValidCompletingParty &&
        getFlagsReviewCertify(state).isValidDetailComment &&
        getFlagsReviewCertify(state).isValidCertify &&
        getFlagsReviewCertify(state).isValidStaffPayment
      )
    } else {
      return (
        getFlagsCompanyInfo(state).isValidCompanyName &&
        getFlagsCompanyInfo(state).isValidStartDate &&
        getFlagsCompanyInfo(state).isValidNatureOfBusiness &&
        getFlagsCompanyInfo(state).isValidAddress &&
        getFlagsCompanyInfo(state).isValidOrgPersons &&
        // don't check completing party for staff correction
        getFlagsReviewCertify(state).isValidDetailComment &&
        // don't check certify for staff correction
        getFlagsReviewCertify(state).isValidStaffPayment
      )
    }
  }

  return false // should never happen
}

/** Whether the subject correction filing has any sections in editing mode. */
export const isCorrectionEditing = (state: StateIF): boolean => {
  // NB: Detail, Certify and Staff Payment don't have an "editing" mode.
  return (state.stateModel.editingFlags.companyName ||
    state.stateModel.editingFlags.nameTranslations ||
    state.stateModel.editingFlags.officeAddresses ||
    state.stateModel.editingFlags.folioNumber ||
    state.stateModel.editingFlags.peopleAndRoles ||
    state.stateModel.editingFlags.shareStructure)
}

/** The validation flags. */
export const getValidationFlags = (state: StateIF): ValidationFlagsIF => {
  return state.stateModel.validationFlags
}

/** True if app level validation is enabled. */
export const getAppValidate = (state: StateIF): boolean => {
  return getValidationFlags(state).appValidate
}

/** True if component level validation is enabled. */
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
  return state.stateModel.detailComment
}

/** The business information object. */
export const getBusinessInformation = (state: StateIF): BusinessInformationIF => {
  return state.stateModel.businessInformation
}

/** The correction information object. */
export const getCorrectionInformation = (state: StateIF): CorrectionInformationIF => {
  return state.stateModel.correctionInformation
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

/** Checks for a 7 digit pattern to identify a numbered company from the Legal Name. */
export const isNumberedCompany = (state: StateIF): boolean => {
  return RegExp('^\\d{7}$').test(getOriginalLegalName(state)?.split(' ')[0])
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
  const currentLegalName = getNameRequestLegalName(state) // may be empty
  const originalLegalName = getOriginalLegalName(state)

  return (currentLegalName !== originalLegalName)
}

/** Whether business type has changed. */
export const hasBusinessTypeChanged = (state: StateIF): boolean => {
  const currentEntityType = getEntityType(state)
  const originalLegalType = getEntitySnapshot(state)?.businessInfo?.legalType

  return (currentEntityType !== originalLegalType)
}

/** Whether business start date has changed. */
export const hasBusinessStartDateChanged = (state: StateIF): boolean => {
  return !!getCorrectionStartDate(state)
}

/** Whether association type has changed. */
export const hasAssociationTypeChanged = (state: StateIF): boolean => {
  const currentAssociationType = getAssociationType(state)
  const originalAssociationType = getEntitySnapshot(state)?.businessInfo?.associationType

  return (currentAssociationType !== originalAssociationType)
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
export const haveOfficeAddressesChanged = (state: StateIF): boolean => {
  if (isCorrectionFiling(state) || isFirmChangeFiling(state) || isFirmConversionFiling(state)) {
    const hasMailingDeliveryChanged = hasMailingChanged(state) || hasDeliveryChanged(state)
    const isChangeOrConversionFiling = isFirmChangeFiling(state) || isFirmConversionFiling(state)
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
  return getEntitySnapshot(state)?.addresses
}

/** True if (registered) mailing address has changed. */
export const hasMailingChanged = (state: StateIF): boolean => {
  if (isAlterationFiling(state) || isBenCorrectionFiling(state)) {
    return !IsSame(
      getOfficeAddresses(state)?.registeredOffice?.mailingAddress,
      getOriginalOfficeAddresses(state)?.registeredOffice?.mailingAddress,
      ['addressCountryDescription', 'id']
    )
  }
  if (isFirmChangeFiling(state) || isFirmConversionFiling(state) || isFirmCorrectionFiling(state)) {
    return !IsSame(
      getOfficeAddresses(state)?.businessOffice?.mailingAddress,
      getOriginalOfficeAddresses(state)?.businessOffice?.mailingAddress,
      ['addressCountryDescription', 'id']
    )
  }
  return false // should never happen
}

/** True if (registered) delivery address has changed. */
export const hasDeliveryChanged = (state: StateIF): boolean => {
  if (isAlterationFiling(state) || isBenCorrectionFiling(state)) {
    return !IsSame(
      getOfficeAddresses(state)?.registeredOffice?.deliveryAddress,
      getOriginalOfficeAddresses(state)?.registeredOffice?.deliveryAddress,
      ['addressCountryDescription', 'id']
    )
  }
  if (isFirmChangeFiling(state) || isFirmConversionFiling(state) || isFirmCorrectionFiling(state)) {
    return !IsSame(
      getOfficeAddresses(state)?.businessOffice?.deliveryAddress,
      getOriginalOfficeAddresses(state)?.businessOffice?.deliveryAddress,
      ['addressCountryDescription', 'id']
    )
  }
  return false // should never happen
}

/** True if records mailing address has changed. */
export const hasRecMailingChanged = (state: StateIF): boolean => {
  return !IsSame(
    getOfficeAddresses(state)?.recordsOffice?.mailingAddress,
    getOriginalOfficeAddresses(state)?.recordsOffice?.mailingAddress,
    ['addressCountryDescription', 'id']
  )
}

/** True if records delivery address has changed. */
export const hasRecDeliveryChanged = (state: StateIF): boolean => {
  return !IsSame(
    getOfficeAddresses(state)?.recordsOffice?.deliveryAddress,
    getOriginalOfficeAddresses(state)?.recordsOffice?.deliveryAddress,
    ['addressCountryDescription', 'id']
  )
}

/** True if any people/roles have changed. */
export const havePeopleAndRolesChanged = (state: StateIF): boolean => {
  /** Normalizes fields that may be empty, null or undefined. */
  function normalize (op: OrgPersonIF): OrgPersonIF {
    if (op.deliveryAddress) {
      if (!op.deliveryAddress.deliveryInstructions) op.deliveryAddress.deliveryInstructions = ''
      if (!op.deliveryAddress.streetAddressAdditional) op.deliveryAddress.streetAddressAdditional = ''
    }

    if (op.mailingAddress) {
      if (!op.mailingAddress.deliveryInstructions) op.mailingAddress.deliveryInstructions = ''
      if (!op.mailingAddress.streetAddressAdditional) op.mailingAddress.streetAddressAdditional = ''
    }

    if (!op.officer.email) op.officer.email = null
    if (!op.officer.taxId) op.officer.taxId = null

    if (op.officer.partyType === PartyTypes.ORGANIZATION) {
      if (!op.officer.identifier) op.officer.identifier = null
    }

    return op
  }

  const currentOrgPersons = getOrgPeople(state)?.map(op => normalize(op))
  const originalOrgPersons = getEntitySnapshot(state)?.orgPersons?.map(op => normalize(op))

  return !IsSame(currentOrgPersons, originalOrgPersons, ['actions', 'confirmNameChange'])
}

/** True when the minimum proprietors is met. */
export const hasMinimumProprietor = (state: StateIF): boolean => {
  // REMOVED parties are still in the parties array until FILING, so exclude them for component level
  // validations
  return (
    !isEntityTypeSP(state) ||
    getOrgPeople(state).filter(party => !party.actions?.includes(ActionTypes.REMOVED)).length === 1
  )
}

/** True when the minimum partners met. */
export const hasMinimumPartners = (state: StateIF): boolean => {
  // REMOVED parties are still in the parties array until FILING, so exclude them for component level
  // validations
  return (
    !isEntityTypeGP(state) ||
    getOrgPeople(state).filter(party => !party.actions?.includes(ActionTypes.REMOVED)).length >= 2
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

  return !IsSame(originalShareClasses, currentShareClasses)
}

/** Whether NAICS data has changed. */
export const hasNaicsChanged = (state: StateIF): boolean => {
  const currentNaicsCode = getBusinessInformation(state)?.naicsCode
  const originalNaicsCode = getEntitySnapshot(state)?.businessInfo?.naicsCode

  // first try to compare codes
  if (currentNaicsCode || originalNaicsCode) {
    return (currentNaicsCode !== originalNaicsCode)
  }

  const currentNaicsDescription = getBusinessInformation(state)?.naicsDescription
  const originalNaicsDescription = getEntitySnapshot(state)?.businessInfo?.naicsDescription

  // then try to compare descriptions
  if (currentNaicsDescription || originalNaicsDescription) {
    return (currentNaicsDescription !== originalNaicsDescription)
  }

  return false
}

/** Whether the provisions are removed. */
export const areProvisionsRemoved = (state: StateIF): boolean => {
  return (state.stateModel.newAlteration.provisionsRemoved === true)
}

/** The original resolution dates. */
export const getOriginalResolutions = (state: StateIF): ResolutionsIF[] => {
  return getEntitySnapshot(state)?.resolutions
}

/** The new resolution dates. */
export const getNewResolutionDates = (state: StateIF): string[] => {
  return state.stateModel.shareStructureStep.resolutionDates
}

/** Whether there are any new resolution dates. */
export const haveNewResolutionDates = (state: StateIF): boolean => {
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
  if (
    hasShareStructureChanged(state) &&
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
  const defaultFilingData: FilingDataIF[] = [{
    filingTypeCode: null,
    entityType: null,
    priority: false,
    waiveFees: false
  }]
  const haveFilingChange = (
    (isCorrectionFiling(state) && hasCorrectionDataChanged(state)) ||
    (isAlterationFiling(state) && hasAlterationDataChanged(state)) ||
    (isFirmChangeFiling(state) && hasChangeDataChanged(state)) ||
    (isFirmConversionFiling(state) && hasConversionDataChanged(state)) ||
    (isSpecialResolutionFiling(state) && hasSpecialResolutionDataChanged(state))
  )
  return (haveFilingChange && !IsSame(getFilingData(state), defaultFilingData))
}

/** The current fees. */
export const getCurrentFees = (state: StateIF): FeesIF[] => {
  return state.stateModel.currentFees
}

/** The fee prices. */
export const getFeePrices = (state: StateIF): FeesIF[] => {
  return state.stateModel.feePrices
}

/** True when the minimum share classes requirements are met. */
export const hasMinimumShareClass = (state: StateIF): boolean => {
  const shareClasses = state.stateModel.shareStructureStep.shareClasses

  // Filter out REMOVED class actions
  const currentShareClasses = shareClasses.filter(x => x.action !== ActionTypes.REMOVED)

  return (currentShareClasses.length > 0)
}

/** The current filing name. */
export const getFilingName = (state: StateIF): FilingNames => {
  if (isCorrectionFiling(state)) return FilingNames.CORRECTION
  if (isAlterationFiling(state)) return FilingNames.ALTERATION
  if (isFirmChangeFiling(state)) return FilingNames.CHANGE_OF_REGISTRATION
  if (isFirmConversionFiling(state)) return FilingNames.CONVERSION
  if (isSpecialResolutionFiling(state)) return FilingNames.SPECIAL_RESOLUTION
  return null
}

/** The completing party data. */
export const getCompletingParty = (state: StateIF): CompletingPartyIF => {
  return state.stateModel.completingParty
}

/** The special resolution object. */
export const getSpecialResolution = (state: StateIF): SpecialResolutionIF => {
  return state.stateModel.specialResolution
}

/** The special resolution validity flags. */
export const getSpecialResolutionFormValid = (state: StateIF): boolean => {
  return getValidationFlags(state).flagsCompanyInfo.isValidCreateSpecialResolution
}

/** The company info page validity flags. */
export const getSpecialResolutionConfirmValid = (state: StateIF): boolean => {
  return getFlagsReviewCertify(state).isValidSpecialResolutionConfirm
}
