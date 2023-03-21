import {
  AccountTypes,
  ActionTypes,
  CoopTypes,
  CorrectionErrorTypes,
  FilingNames,
  FilingTypes,
  PartyTypes,
  RestorationTypes,
  RoleTypes
} from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import {
  AddressesIF,
  BusinessInformationIF,
  CertifyIF,
  CorrectionInformationIF,
  EffectiveDateTimeIF,
  EntitySnapshotIF,
  FeesIF,
  FilingDataIF,
  FlagsCompanyInfoIF,
  FlagsReviewCertifyIF,
  NameRequestIF,
  NameTranslationIF,
  OrgPersonIF,
  ResolutionsIF,
  ResourceIF,
  RestorationStateIF,
  ShareClassIF,
  StateIF,
  ValidationFlagsIF } from '@/interfaces/'
import {
  CompletingPartyIF,
  ContactPointIF,
  NaicsIF,
  SpecialResolutionIF,
  StaffPaymentIF
} from '@bcrs-shared-components/interfaces/'
import { IsSame } from '@/utils/'
import DateUtilities from '@/services/date-utilities'

export default {
  /** Whether the user has "staff" keycloak role. */
  isRoleStaff (state: StateIF): boolean {
    return state.stateModel.tombstone.keycloakRoles.includes('staff')
  },

  /** Whether the current account is SBC Staff. */
  isSbcStaff (state: StateIF): boolean {
    return state.stateModel.accountInformation?.accountType === AccountTypes.SBC_STAFF
  },

  /** Whether the user is authorized to edit. */
  isAuthEdit (state: StateIF): boolean {
    return state.stateModel.tombstone.authRoles.includes('edit')
  },

  /** Whether the user is authorized to view. */
  isAuthView (state: StateIF): boolean {
    return state.stateModel.tombstone.authRoles.includes('view')
  },

  /** Whether the current filing is a Correction. */
  isCorrectionFiling (state: StateIF): boolean {
    return (state.stateModel.tombstone.filingType === FilingTypes.CORRECTION)
  },

  /** Whether the current filing is an Alteration. */
  isAlterationFiling (state: StateIF): boolean {
    return (state.stateModel.tombstone.filingType === FilingTypes.ALTERATION)
  },

  /** Whether the current filing is a Special Resolution. */
  isSpecialResolutionFiling (state: StateIF): boolean {
    return (state.stateModel.tombstone.filingType === FilingTypes.SPECIAL_RESOLUTION)
  },

  /** Whether the current filing is a Change of Registration. */
  isChangeRegFiling (state: StateIF): boolean {
    return (state.stateModel.tombstone.filingType === FilingTypes.CHANGE_OF_REGISTRATION)
  },

  /** Whether the current filing is a Conversion. */
  isConversionFiling (state: StateIF): boolean {
    return (state.stateModel.tombstone.filingType === FilingTypes.CONVERSION)
  },

  /** Whether the current filing is a Restoration. */
  isRestorationFiling (state: StateIF): boolean {
    return (state.stateModel.tombstone.filingType === FilingTypes.RESTORATION)
  },

  /** Whether the current filing is a Limited Extension Restoration. */
  isLimitedExtendRestorationFiling (state: StateIF, getters): boolean {
    return (getters.getRestoration.type === RestorationTypes.LTD_EXTEND)
  },

  /** Whether the current filing is a Limited Conversion Restoration. */
  isLimitedConversionRestorationFiling (state: StateIF, getters): boolean {
    return (getters.getRestoration.type === RestorationTypes.LTD_TO_FULL)
  },

  /** Whether the current filing is a Change of Registration for a firm corp class. */
  isFirmChangeFiling (state: StateIF, getters): boolean {
    return (getters.isFirm && getters.isChangeRegFiling)
  },

  /** Whether the current filing is a Correction for a BEN/BC/CCC/ULC. */
  isBenBcCccUlcCorrectionFiling (state: StateIF, getters): boolean {
    return (getters.isBenBcCccUlc && getters.isCorrectionFiling)
  },

  /** Whether the current filing is a Correction for a firm corp class. */
  isFirmCorrectionFiling (state: StateIF, getters): boolean {
    return (getters.isFirm && getters.isCorrectionFiling)
  },

  /** Whether the current filing is a Conversion for a firm corp class. */
  isFirmConversionFiling (state: StateIF, getters): boolean {
    return (getters.isFirm && getters.isConversionFiling)
  },

  /** Whether the corrected filing is an Incorporation Application. */
  isCorrectedIncorporationApplication (state: StateIF, getters): boolean {
    return (getters.getCorrectedFilingType === FilingTypes.INCORPORATION_APPLICATION)
  },

  /** Whether the corrected filing is a Registration. */
  isCorrectedRegistration (state: StateIF, getters): boolean {
    return (getters.getCorrectedFilingType === FilingTypes.REGISTRATION)
  },

  /** Whether the corrected filing is a Change of Registration. */
  isCorrectedChangeReg (state: StateIF, getters): boolean {
    return (getters.getCorrectedFilingType === FilingTypes.CHANGE_OF_REGISTRATION)
  },

  /** The entity type. */
  getEntityType (state: StateIF): CorpTypeCd {
    return state.stateModel.tombstone.entityType
  },

  /** Whether the entity is a Benefit Company. */
  isBenefitCompany (state: StateIF, getters): boolean {
    return (getters.getEntityType === CorpTypeCd.BENEFIT_COMPANY)
  },

  /** Whether the entity is a BC Corporation. */
  isBcCorporation (state: StateIF, getters): boolean {
    return (getters.getEntityType === CorpTypeCd.BC_CORPORATION)
  },

  /** Whether the entity is a Cooperative. */
  isCoop (state: StateIF, getters): boolean {
    return (getters.getEntityType === CorpTypeCd.COOP)
  },

  /** Whether the entity is a BC Company. */
  isBcCompany (state: StateIF, getters): boolean {
    return (getters.getEntityType === CorpTypeCd.BC_COMPANY)
  },

  /** Whether the entity is a Community Contribution Company. */
  isBcCcc (state: StateIF, getters): boolean {
    return (getters.getEntityType === CorpTypeCd.BC_CCC)
  },

  /** Whether the entity is an Unlimited Liability Company. */
  isBcUlcCompany (state: StateIF, getters): boolean {
    return (getters.getEntityType === CorpTypeCd.BC_ULC_COMPANY)
  },

  /** Whether the entity is a Sole Proprietorship. */
  isSoleProp (state: StateIF, getters): boolean {
    return (getters.getEntityType === CorpTypeCd.SOLE_PROP)
  },

  /** Whether the entity is a General Partnership. */
  isPartnership (state: StateIF, getters): boolean {
    return (getters.getEntityType === CorpTypeCd.PARTNERSHIP)
  },

  /** Whether the entity is a BEN/BC/CCC/ULC. */
  isBenBcCccUlc (state: StateIF, getters): boolean {
    return (
      getters.isBcCompany ||
      getters.isBenefitCompany ||
      getters.isBcCcc ||
      getters.isBcUlcCompany
    )
  },

  /** Whether the entity is a GP/SP. */
  isFirm (state: StateIF, getters): boolean {
    return (getters.isPartnership || getters.isSoleProp)
  },

  /** Whether the current account is a premium account. */
  isPremiumAccount (state: StateIF): boolean {
    return (state.stateModel.accountInformation.accountType === AccountTypes.PREMIUM)
  },

  /** The filing's effective date-time object. */
  getEffectiveDateTime (state: StateIF): EffectiveDateTimeIF {
    return state.stateModel.effectiveDateTime
  },

  /** The business' founding date (API format). */
  getBusinessFoundingDateTime (state: StateIF, getters): string {
    return getters.getBusinessInformation.foundingDate
  },

  /** The business' start date (YYYY-MM-DD). */
  getBusinessStartDate (state: StateIF, getters): string {
    return getters.getBusinessInformation.startDate
  },

  /** The current account id. */
  getAccountId (state: StateIF): number {
    return state.stateModel.accountInformation.id
  },

  /** The current date, which is refreshed every time the app inits. */
  getCurrentDate (state: StateIF): string {
    return state.stateModel.tombstone.currentDate
  },

  /** The current JS Date object, which is refreshed every minute. */
  getCurrentJsDate (state: StateIF): Date {
    return state.stateModel.currentJsDate
  },

  /** The filing id. */
  getFilingId (state: StateIF): number {
    return state.stateModel.tombstone.filingId
  },

  /** The corrected filing's date (API format). */
  getCorrectedFilingDate (state: StateIF, getters): string {
    return getters.getCorrectionInformation.correctedFilingDate
  },

  /** The corrected filing's id. */
  getCorrectedFilingId (state: StateIF, getters): number {
    return getters.getCorrectionInformation.correctedFilingId
  },

  /** The corrected filing's type. */
  getCorrectedFilingType (state: StateIF, getters): FilingTypes {
    return getters.getCorrectionInformation.correctedFilingType
  },

  /** The correction error type. */
  getCorrectionErrorType (state: StateIF, getters): CorrectionErrorTypes {
    return getters.getCorrectionInformation.type
  },

  /** The correction (business) start date (YYYY-MM-DD). */
  getCorrectionStartDate (state: StateIF, getters): string {
    return getters.getCorrectionInformation.startDate
  },

  /** True if the correction is due to a client error. */
  isClientErrorCorrection (state: StateIF, getters): boolean {
    return (getters.getCorrectionErrorType === CorrectionErrorTypes.CLIENT)
  },

  /** The business identifier (aka incorporation number). */
  getBusinessId (state: StateIF): string {
    return state.stateModel.tombstone.businessId
  },

  /** The original legal name. */
  getOriginalLegalName (state: StateIF, getters): string {
    return getters.getEntitySnapshot?.businessInfo?.legalName
  },

  /** The original entity snapshot. */
  getEntitySnapshot (state: StateIF): EntitySnapshotIF {
    return state.stateModel.entitySnapshot
  },

  /** The business number. */
  getBusinessNumber (state: StateIF): string {
    // remove first 2 chars from Business ID
    return state.stateModel.tombstone.businessId?.substring(2)
  },

  /** The current user's info. (May be null.) */
  getUserInfo (state: StateIF): any {
    return state.stateModel.tombstone.userInfo
  },

  /** The org info. (May be null.) */
  getOrgInfo (state: StateIF): any {
    return state.stateModel.tombstone.orgInfo
  },

  /** The current user's email. (May be undefined.) */
  getUserEmail (state: StateIF, getters): string {
    // get email from contacts[0] if it exists (ie, for BCSC users)
    // else get email from root object
    return getters.getUserInfo?.contacts[0]?.email || getters.getUserInfo?.email
  },

  /** The current user's phone. (May be undefined.) */
  getUserPhone (state: StateIF, getters): string {
    // get phone from contacts[0] if it exists (ie, for BCSC users)
    // else get phone from root object
    return getters.getUserInfo?.contacts[0]?.phone || getters.getUserInfo?.phone
  },

  /** The current user's first name. (May be undefined.) */
  getUserFirstName (state: StateIF, getters): string {
    return getters.getUserInfo?.firstname
  },

  /** The current user's last name. (May be undefined.) */
  getUserLastName (state: StateIF, getters): string {
    return getters.getUserInfo?.lastname
  },

  /** The current user's roles. (May be undefined.) */
  getUserRoles (state: StateIF, getters): any {
    return getters.getUserInfo?.roles
  },

  /** The current user's username. (May be undefined.) */
  getUserUsername (state: StateIF, getters): string {
    return getters.getUserInfo?.username
  },

  /** The business folio number. */
  getFolioNumber (state: StateIF): string {
    return state.stateModel.tombstone.folioNumber
  },

  /** The transactional folio number. */
  getTransactionalFolioNumber (state: StateIF): string {
    return state.stateModel.tombstone.transactionalFolioNumber
  },

  /** The current NAICS object. */
  getCurrentNaics (state: StateIF, getters): NaicsIF {
    return {
      naicsCode: getters.getBusinessInformation.naicsCode,
      naicsDescription: getters.getBusinessInformation.naicsDescription
    }
  },

  /** The snapshot NAICS object. */
  getSnapshotNaics (state: StateIF, getters): NaicsIF {
    return {
      naicsCode: getters.getEntitySnapshot?.businessInfo?.naicsCode,
      naicsDescription: getters.getEntitySnapshot?.businessInfo?.naicsDescription
    }
  },

  /** The association (coop) type. */
  getAssociationType (state: StateIF, getters): CoopTypes {
    return getters.getBusinessInformation.associationType
  },

  /** The Name Request object. */
  getNameRequest (state: StateIF): NameRequestIF {
    return state.stateModel.nameRequest
  },

  /** The Name Request Number. */
  getNameRequestNumber (state: StateIF, getters): string {
    return getters.getNameRequest?.nrNumber
  },

  /** The Name Request Legal Name (approved name). */
  getNameRequestLegalName (state: StateIF, getters): string {
    return getters.getNameRequest?.legalName
  },

  /** The name translations. */
  getNameTranslations (state: StateIF): NameTranslationIF[] {
    return state.stateModel.nameTranslations
  },

  /** Whether name translations have changed. */
  haveNameTranslationsChanged (state: StateIF, getters): boolean {
    return (getters.getNameTranslations.filter(x => x.action).length > 0)
  },

  /** The office addresses. */
  getOfficeAddresses (state: StateIF): AddressesIF {
    return state.stateModel.officeAddresses
  },

  /** The org-people list. */
  getOrgPeople (state: StateIF): Array<OrgPersonIF> {
    return state.stateModel.peopleAndRoles.orgPeople
  },

  /** The share classes list. */
  getShareClasses (state: StateIF): Array<ShareClassIF> {
    return state.stateModel.shareStructureStep.shareClasses
  },

  /** The business contact object. */
  getBusinessContact (state: StateIF): ContactPointIF {
    return state.stateModel.businessContact
  },

  /** Whether we are ignoring data changes. */
  ignoreChanges (state: StateIF): boolean {
    return state.stateModel.tombstone.ignoreChanges
  },

  /** Whether there are unsaved data changes. */
  haveUnsavedChanges (state: StateIF): boolean {
    return state.stateModel.tombstone.haveUnsavedChanges
  },

  /** The staff payment. */
  getStaffPayment (state: StateIF): StaffPaymentIF {
    return state.stateModel.staffPayment
  },

  /** The filing data. */
  getFilingData (state: StateIF): FilingDataIF[] {
    return state.stateModel.filingData
  },

  /** Whether app is busy saving/saving and resuming/filing and paying. */
  isBusySaving (state: StateIF, getters): boolean {
    return (getters.isSaving || getters.isSavingResuming || getters.isFilingPaying)
  },

  /** Whether app is busy saving. */
  isSaving (state: StateIF): boolean {
    return state.stateModel.tombstone.isSaving
  },

  /** Whether app is busy saving and resuming. */
  isSavingResuming (state: StateIF): boolean {
    return state.stateModel.tombstone.isSavingResuming
  },

  /** Whether app is busy filing and paying. */
  isFilingPaying (state: StateIF): boolean {
    return state.stateModel.tombstone.isFilingPaying
  },

  /**
   * Whether any correction data has changed (for the purpose of showing the
   * fee summary), ie, does not include:
   * - completing party
   * - detail
   * - certify
   * - staff payment
   */
  hasCorrectionDataChanged (state: StateIF, getters): boolean {
    if (getters.isBenBcCccUlcCorrectionFiling) {
      return (
        getters.hasBusinessNameChanged ||
        getters.hasBusinessTypeChanged ||
        getters.haveNameTranslationsChanged ||
        getters.haveOfficeAddressesChanged ||
        getters.havePeopleAndRolesChanged ||
        getters.hasShareStructureChanged ||
        getters.areProvisionsRemoved ||
        getters.haveNewResolutionDates
      )
    }

    if (getters.isFirmCorrectionFiling) {
      return (
        getters.hasBusinessNameChanged ||
        getters.hasBusinessStartDateChanged ||
        getters.hasNaicsChanged ||
        getters.haveOfficeAddressesChanged ||
        getters.havePeopleAndRolesChanged
      )
    }

    return false // should never happen
  },

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
  hasAlterationDataChanged (state: StateIF, getters): boolean {
    return (
      getters.hasBusinessNameChanged ||
      getters.hasBusinessTypeChanged ||
      getters.haveNameTranslationsChanged ||
      getters.hasShareStructureChanged ||
      getters.areProvisionsRemoved ||
      getters.haveNewResolutionDates
    )
  },

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
  hasSpecialResolutionDataChanged (state: StateIF, getters): boolean {
    return (
      getters.hasBusinessNameChanged ||
      getters.hasBusinessTypeChanged ||
      getters.hasAssociationTypeChanged
    )
  },

  /**
   * Whether any firm change data has changed (for the purpose of showing the
   * fee summary), ie, does NOT include:
   * - document delivery
   * - certify
   * - folio number
   * - court order and POA
   * - staff payment
   */
  hasChangeDataChanged (state: StateIF, getters): boolean {
    return (
      getters.hasBusinessNameChanged ||
      getters.hasBusinessStartDateChanged ||
      getters.hasNaicsChanged ||
      getters.haveOfficeAddressesChanged ||
      getters.havePeopleAndRolesChanged
    )
  },

  /**
   * Whether any firm conversion data has changed (for the purpose of showing the
   * fee summary), ie, does NOT include:
   * - document delivery
   * - certify
   * - folio number
   * - court order and POA
   * - staff payment
   */
  hasConversionDataChanged (state: StateIF, getters): boolean {
    return (
      getters.hasBusinessStartDateChanged ||
      getters.hasNaicsChanged ||
      getters.haveOfficeAddressesChanged ||
      getters.havePeopleAndRolesChanged
    )
  },

  /**
   * Whether any restoration data has changed (for the purpose of showing the
   * fee summary), ie, does NOT include:
   * - document delivery
   * - certify
   * - folio number
   * - court order and POA
   * - staff payment
   */
  hasRestorationDataChanged (state: StateIF, getters): boolean {
    return (
      getters.hasBusinessNameChanged ||
      getters.haveNameTranslationsChanged ||
      getters.haveOfficeAddressesChanged ||
      getters.havePeopleAndRolesChanged
    )
  },

  /** Whether the subject correction filing is valid. */
  isCorrectionValid (state: StateIF, getters): boolean {
    if (getters.isBenBcCccUlcCorrectionFiling) {
      if (getters.isClientErrorCorrection) {
        return (
          getters.getFlagsCompanyInfo.isValidCompanyName &&
          getters.getFlagsCompanyInfo.isValidNameTranslation &&
          getters.getFlagsCompanyInfo.isValidAddress &&
          getters.getFlagsCompanyInfo.isValidOrgPersons &&
          getters.getFlagsCompanyInfo.isValidShareStructure &&
          getters.getFlagsReviewCertify.isValidDetailComment &&
          getters.getFlagsReviewCertify.isValidCertify &&
          getters.getFlagsReviewCertify.isValidStaffPayment
        )
      } else {
        return (
          getters.getFlagsCompanyInfo.isValidCompanyName &&
          getters.getFlagsCompanyInfo.isValidNameTranslation &&
          getters.getFlagsCompanyInfo.isValidOrgPersons &&
          getters.getFlagsCompanyInfo.isValidAddress &&
          getters.getFlagsCompanyInfo.isValidShareStructure &&
          getters.getFlagsReviewCertify.isValidDetailComment &&
          // don't check certify for staff correction
          getters.getFlagsReviewCertify.isValidStaffPayment
        )
      }
    }

    if (getters.isFirmCorrectionFiling) {
      if (getters.isClientErrorCorrection) {
        return (
          getters.getFlagsCompanyInfo.isValidCompanyName &&
          getters.getFlagsCompanyInfo.isValidStartDate &&
          getters.getFlagsCompanyInfo.isValidNatureOfBusiness &&
          getters.getFlagsCompanyInfo.isValidAddress &&
          getters.getFlagsCompanyInfo.isValidOrgPersons &&
          getters.getFlagsReviewCertify.isValidCompletingParty &&
          getters.getFlagsReviewCertify.isValidDetailComment &&
          getters.getFlagsReviewCertify.isValidCertify &&
          getters.getFlagsReviewCertify.isValidStaffPayment
        )
      } else {
        return (
          getters.getFlagsCompanyInfo.isValidCompanyName &&
          getters.getFlagsCompanyInfo.isValidStartDate &&
          getters.getFlagsCompanyInfo.isValidNatureOfBusiness &&
          getters.getFlagsCompanyInfo.isValidAddress &&
          getters.getFlagsCompanyInfo.isValidOrgPersons &&
          // don't check completing party for staff correction
          getters.getFlagsReviewCertify.isValidDetailComment &&
          // don't check certify for staff correction
          getters.getFlagsReviewCertify.isValidStaffPayment
        )
      }
    }

    return false // should never happen
  },

  /** Whether the subject correction filing has any sections in editing mode. */
  isCorrectionEditing (state: StateIF): boolean {
    // NB: Detail, Certify and Staff Payment don't have an "editing" mode.
    return (state.stateModel.editingFlags.companyName ||
      state.stateModel.editingFlags.nameTranslations ||
      state.stateModel.editingFlags.officeAddresses ||
      state.stateModel.editingFlags.folioNumber ||
      state.stateModel.editingFlags.peopleAndRoles ||
      state.stateModel.editingFlags.shareStructure)
  },

  /** The validation flags. */
  getValidationFlags (state: StateIF): ValidationFlagsIF {
    return state.stateModel.validationFlags
  },

  /** True if app level validation is enabled. */
  getAppValidate (state: StateIF, getters): boolean {
    return getters.getValidationFlags.appValidate
  },

  /** True if component level validation is enabled. */
  getComponentValidate (state: StateIF, getters): boolean {
    return getters.getValidationFlags.componentValidate
  },

  /** The review and certify page validity flags. */
  getFlagsReviewCertify (state: StateIF, getters): FlagsReviewCertifyIF {
    return getters.getValidationFlags.flagsReviewCertify
  },

  /** The company info page validity flags. */
  getFlagsCompanyInfo (state: StateIF, getters): FlagsCompanyInfoIF {
    return getters.getValidationFlags.flagsCompanyInfo
  },

  getDetailComment (state: StateIF): string {
    return state.stateModel.detailComment
  },

  /** The business information object. */
  getBusinessInformation (state: StateIF): BusinessInformationIF {
    return state.stateModel.businessInformation
  },

  /** The correction information object. */
  getCorrectionInformation (state: StateIF): CorrectionInformationIF {
    return state.stateModel.correctionInformation
  },

  getCertifyState (state: StateIF): CertifyIF {
    return state.stateModel.certifyState
  },

  getResource (state: StateIF): ResourceIF {
    return state.resourceModel
  },

  getDocumentOptionalEmail (state: StateIF): string {
    return state.stateModel.documentDelivery.documentOptionalEmail
  },

  /** Checks for a 7 digit pattern to identify a numbered company from the Legal Name. */
  isNumberedCompany (state: StateIF, getters): boolean {
    return RegExp('^\\d{7}$').test(getters.getOriginalLegalName?.split(' ')[0])
  },

  /** Check for conflicting legal types between current type and altered type. */
  isConflictingLegalType (state: StateIF, getters): boolean {
    return (getters.getEntityType !== state.stateModel.nameRequest.legalType)
  },

  /** The Summary Mode state. */
  isSummaryMode (state: StateIF, getters): boolean {
    return state.stateModel.summaryMode
  },

  /** Whether business name has changed. */
  hasBusinessNameChanged (state: StateIF, getters): boolean {
    const currentLegalName = getters.getNameRequestLegalName // may be empty
    const originalLegalName = getters.getOriginalLegalName

    return (currentLegalName !== originalLegalName)
  },

  /** Whether business type has changed. */
  hasBusinessTypeChanged (state: StateIF, getters): boolean {
    const currentEntityType = getters.getEntityType
    const originalLegalType = getters.getEntitySnapshot?.businessInfo?.legalType

    return (currentEntityType !== originalLegalType)
  },

  /** Whether business start date has changed. */
  hasBusinessStartDateChanged (state: StateIF, getters): boolean {
    return !!getters.getCorrectionStartDate
  },

  /** Whether association type has changed. */
  hasAssociationTypeChanged (state: StateIF, getters): boolean {
    const currentAssociationType = getters.getAssociationType
    const originalAssociationType = getters.getEntitySnapshot?.businessInfo?.associationType

    return (currentAssociationType !== originalAssociationType)
  },

  /** Whether contact info data has changed. */
  hasContactInfoChanged (state: StateIF, getters): boolean {
    const businessContact = getters.getBusinessContact
    const snapshotContact = getters.getEntitySnapshot?.authInfo?.contact

    return (
      (businessContact?.email !== snapshotContact?.email) ||
      (businessContact?.phone !== snapshotContact?.phone) ||
      (businessContact?.extension !== snapshotContact?.extension)
    )
  },

  /** True if any office address has changed. Applies to corrections, change and conversion filings only. */
  haveOfficeAddressesChanged (state: StateIF, getters): boolean {
    if (
      getters.isCorrectionFiling ||
      getters.isFirmChangeFiling ||
      getters.isFirmConversionFiling ||
      getters.isRestorationFiling
    ) {
      const hasMailingDeliveryChanged = getters.hasMailingChanged || getters.hasDeliveryChanged
      const isChangeOrConversionFiling = getters.isFirmChangeFiling || getters.isFirmConversionFiling
      const hasRecMailingDeliveryChanged = getters.hasRecMailingChanged || getters.hasRecDeliveryChanged

      return (
        hasMailingDeliveryChanged ||
        // exclude Records Address conditions from Change or Conversion filing
        (!isChangeOrConversionFiling && hasRecMailingDeliveryChanged)
      )
    }
    return false
  },

  /** The office addresses from the original filing. NB: may be {} */
  getOriginalOfficeAddresses (state: StateIF, getters): AddressesIF {
    return getters.getEntitySnapshot?.addresses
  },

  /** True if (registered) mailing address has changed. */
  hasMailingChanged (state: StateIF, getters): boolean {
    if (
      getters.isAlterationFiling ||
      getters.isBenBcCccUlcCorrectionFiling ||
      getters.isRestorationFiling
    ) {
      return !IsSame(
        getters.getOfficeAddresses?.registeredOffice?.mailingAddress,
        getters.getOriginalOfficeAddresses?.registeredOffice?.mailingAddress,
        ['addressCountryDescription', 'id']
      )
    }
    if (
      getters.isFirmChangeFiling ||
      getters.isFirmConversionFiling ||
      getters.isFirmCorrectionFiling
    ) {
      return !IsSame(
        getters.getOfficeAddresses?.businessOffice?.mailingAddress,
        getters.getOriginalOfficeAddresses?.businessOffice?.mailingAddress,
        ['addressCountryDescription', 'id']
      )
    }
    return false // should never happen
  },

  /** True if (registered) delivery address has changed. */
  hasDeliveryChanged (state: StateIF, getters): boolean {
    if (
      getters.isAlterationFiling ||
      getters.isBenBcCccUlcCorrectionFiling ||
      getters.isRestorationFiling
    ) {
      return !IsSame(
        getters.getOfficeAddresses?.registeredOffice?.deliveryAddress,
        getters.getOriginalOfficeAddresses?.registeredOffice?.deliveryAddress,
        ['addressCountryDescription', 'id']
      )
    }
    if (
      getters.isFirmChangeFiling ||
      getters.isFirmConversionFiling ||
      getters.isFirmCorrectionFiling
    ) {
      return !IsSame(
        getters.getOfficeAddresses?.businessOffice?.deliveryAddress,
        getters.getOriginalOfficeAddresses?.businessOffice?.deliveryAddress,
        ['addressCountryDescription', 'id']
      )
    }
    return false // should never happen
  },

  /** True if records mailing address has changed. */
  hasRecMailingChanged (state: StateIF, getters): boolean {
    return !IsSame(
      getters.getOfficeAddresses?.recordsOffice?.mailingAddress,
      getters.getOriginalOfficeAddresses?.recordsOffice?.mailingAddress,
      ['addressCountryDescription', 'id']
    )
  },

  /** True if records delivery address has changed. */
  hasRecDeliveryChanged (state: StateIF, getters): boolean {
    return !IsSame(
      getters.getOfficeAddresses?.recordsOffice?.deliveryAddress,
      getters.getOriginalOfficeAddresses?.recordsOffice?.deliveryAddress,
      ['addressCountryDescription', 'id']
    )
  },

  /** True if any people/roles have changed. */
  havePeopleAndRolesChanged (state: StateIF, getters): boolean {
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

    const currentOrgPersons = getters.getOrgPeople?.map(op => normalize(op))
    const originalOrgPersons = getters.getEntitySnapshot?.orgPersons?.map(op => normalize(op))

    return !IsSame(currentOrgPersons, originalOrgPersons, ['actions', 'confirmNameChange'])
  },

  /** Whether share structure data has changed. */
  hasShareStructureChanged (state: StateIF, getters): boolean {
    let currentShareClasses = getters.getShareClasses
    let originalShareClasses = getters.getEntitySnapshot?.shareStructure?.shareClasses

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
  },

  /** Whether NAICS data has changed. */
  hasNaicsChanged (state: StateIF, getters): boolean {
    const currentNaicsCode = getters.getBusinessInformation?.naicsCode
    const originalNaicsCode = getters.getEntitySnapshot?.businessInfo?.naicsCode

    // first try to compare codes
    if (currentNaicsCode || originalNaicsCode) {
      return (currentNaicsCode !== originalNaicsCode)
    }

    const currentNaicsDescription = getters.getBusinessInformation?.naicsDescription
    const originalNaicsDescription = getters.getEntitySnapshot?.businessInfo?.naicsDescription

    // then try to compare descriptions
    if (currentNaicsDescription || originalNaicsDescription) {
      return (currentNaicsDescription !== originalNaicsDescription)
    }

    return false
  },

  /** Whether the provisions are removed. */
  areProvisionsRemoved (state: StateIF): boolean {
    return (state.stateModel.newAlteration.provisionsRemoved === true)
  },

  /** The original resolution dates. */
  getOriginalResolutions (state: StateIF, getters): ResolutionsIF[] {
    return getters.getEntitySnapshot?.resolutions
  },

  /** The new resolution dates. */
  getNewResolutionDates (state: StateIF): string[] {
    return state.stateModel.shareStructureStep.resolutionDates
  },

  /** Whether there are any new resolution dates. */
  haveNewResolutionDates (state: StateIF, getters): boolean {
    return (getters.getNewResolutionDates?.length > 0)
  },

  /** The file number (aka court order number). */
  getFileNumber (state: StateIF): string {
    return state.stateModel.newAlteration.courtOrder.fileNumber
  },
  /** Returns true if the filing has a court order number  */
  hasFileNumber (state, getters): boolean {
    return !!getters.getFileNumber
  },

  /** The Plan of Arrangement state. */
  getHasPlanOfArrangement (state: StateIF): boolean {
    return state.stateModel.newAlteration.courtOrder.hasPlanOfArrangement
  },

  /** True if the share structure contains any special rights of restrictions. */
  getHasRightsOrRestrictions (state: StateIF): any {
    const shareClasses = state.stateModel.shareStructureStep.shareClasses

    // Search and return on the first match
    // Don't need to search Series, as they can't exist on a parent without rights or restrictions
    return shareClasses.some(shareClass => shareClass.hasRightsOrRestrictions)
  },

  /** True if the share structure contains any special rights of restrictions. */
  getHasOriginalRightsOrRestrictions (state: StateIF, getters): any {
    const shareClasses = getters.getEntitySnapshot?.shareStructure?.shareClasses

    // Search and return on the first match
    // Don't need to search Series, as they can't exist on a parent without rights or restrictions
    return shareClasses?.some(shareClass => shareClass.hasRightsOrRestrictions)
  },

  /** True if resolution dates are valid. */
  getIsResolutionDatesValid (state: StateIF, getters): boolean {
    if (
      getters.hasShareStructureChanged &&
      (getters.getHasOriginalRightsOrRestrictions || getters.getHasRightsOrRestrictions)
    ) {
      return (getters.getNewResolutionDates.length >= 1)
    }
    return true
  },

  /**
   * Whether to show the fee summary.
   * This is a safety check to ensure that fee summary component is not loaded
   * until there is a valid filing type and entity code.
   */
  showFeeSummary (state: StateIF, getters): boolean {
    const defaultFilingData: FilingDataIF[] = [{
      filingTypeCode: null,
      entityType: null,
      priority: false,
      waiveFees: false
    }]
    const haveFilingChange = (
      (getters.isCorrectionFiling && getters.hasCorrectionDataChanged) ||
      (getters.isAlterationFiling && getters.hasAlterationDataChanged) ||
      (getters.isFirmChangeFiling && getters.hasChangeDataChanged) ||
      (getters.isFirmConversionFiling && getters.hasConversionDataChanged) ||
      (getters.isRestorationFiling && getters.hasRestorationDataChanged) ||
      (getters.isSpecialResolutionFiling && getters.hasSpecialResolutionDataChanged) ||
      getters.isRestorationFiling
    )
    return (haveFilingChange && !IsSame(getters.getFilingData, defaultFilingData))
  },

  /** The current fees. */
  getCurrentFees (state: StateIF): FeesIF[] {
    return state.stateModel.currentFees
  },

  /** The fee prices. */
  getFeePrices (state: StateIF): FeesIF[] {
    return state.stateModel.feePrices
  },

  /** True when the minimum share classes requirements are met. */
  hasMinimumShareClass (state: StateIF): boolean {
    const shareClasses = state.stateModel.shareStructureStep.shareClasses

    // Filter out REMOVED class actions
    const currentShareClasses = shareClasses.filter(x => x.action !== ActionTypes.REMOVED)

    return (currentShareClasses.length > 0)
  },

  /** The current filing name. */
  getFilingName (state: StateIF, getters): FilingNames {
    if (getters.isAlterationFiling) return FilingNames.ALTERATION
    if (getters.isCorrectionFiling) return FilingNames.CORRECTION
    if (getters.isFirmChangeFiling) return FilingNames.CHANGE_OF_REGISTRATION
    if (getters.isFirmConversionFiling) return FilingNames.CONVERSION
    if (getters.isRestorationFiling) return FilingNames.RESTORATION_APPLICATION
    if (getters.isSpecialResolutionFiling) return FilingNames.SPECIAL_RESOLUTION
    return null
  },

  /** The completing party data. */
  getCompletingParty (state: StateIF): CompletingPartyIF {
    return state.stateModel.completingParty
  },

  /** The special resolution object. */
  getSpecialResolution (state: StateIF): SpecialResolutionIF {
    return state.stateModel.specialResolution
  },

  /** The special resolution validity flags. */
  getSpecialResolutionFormValid (state: StateIF, getters): boolean {
    return getters.getValidationFlags.flagsCompanyInfo.isValidCreateSpecialResolution
  },

  /** The company info page validity flags. */
  getSpecialResolutionConfirmValid (state: StateIF, getters): boolean {
    return getters.getFlagsReviewCertify.isValidSpecialResolutionConfirm
  },

  /** The restoration object. */
  getRestoration (state: StateIF): RestorationStateIF {
    return state.stateModel.restoration
  },

  /** Returns false when users can change the sole proprietor (SP).
   * Restricts the ability of non-staff users from changing the sole
   * proprietor when the SP is an organization.  This restriction has been
   * added to ensure that changes made in business-edit-ui are also updated by
   * staff in COLIN */
  hideChangeButtonForSoleProps (state: StateIF, getters): boolean {
    const isProprietor = getters.getOrgPeople[0]?.roles[0]?.roleType === RoleTypes.PROPRIETOR
    const isOrganization = getters.getOrgPeople[0]?.officer?.partyType === PartyTypes.ORGANIZATION
    const isDba = isProprietor && isOrganization
    return !getters.isRoleStaff && isDba
  },

  getExpiryDateString (state: StateIF): string {
    return state.stateModel.restoration?.expiry
  },

  getFormattedExpiryText: (state, getters) => (today = new Date()): string => {
    if (getters.getExpiryDateString) {
      return DateUtilities.monthDiffToToday(getters.getExpiryDateString, today) + ' months, expires on ' +
        DateUtilities.yyyyMmDdToPacificDate(getters.getExpiryDateString)
    }
    return '[no expiry date]'
  },

  getPayApiUrl (_state): string {
    return sessionStorage.getItem('PAY_API_URL')
  }
}
