// Pinia Store
import {
  AccountTypes,
  ActionTypes,
  ApprovalTypes,
  CoopTypes,
  CorrectionErrorTypes,
  FilingNames,
  FilingTypes,
  PartyTypes,
  RelationshipTypes,
  RestorationTypes,
  RoleTypes
} from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import {
  ActionKvIF,
  AccountInformationIF,
  AddressesIF,
  BusinessInformationIF,
  CertifyIF,
  CorrectionInformationIF,
  CourtOrderIF,
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
  StateFilingRestorationIF,
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

import { defineStore } from 'pinia'
import { resourceModel, stateModel } from './state'
import { LegalServices } from '@/services'
import { RulesMemorandumIF } from '@/interfaces/rules-memorandum-interfaces'
import { isEqual } from 'lodash'

// Possible to move getters / actions into seperate files:
// https://github.com/vuejs/pinia/issues/802#issuecomment-1018780409
// Not sure if I'd recommend that though.
export const useStore = defineStore('store', {
  // convert to a function
  state: (): StateIF => ({ resourceModel, stateModel }),
  getters: {
    /** Whether the user has "staff" Keycloak role. */
    isRoleStaff (): boolean {
      return this.stateModel.tombstone.keycloakRoles.includes('staff')
    },

    /** Whether the current account is SBC Staff. */
    isSbcStaff (): boolean {
      return this.stateModel.accountInformation?.accountType === AccountTypes.SBC_STAFF
    },

    /** Whether the current filing is a Correction. */
    isCorrectionFiling (): boolean {
      return (this.stateModel.tombstone.filingType === FilingTypes.CORRECTION)
    },

    /** Whether the current filing is an Alteration. */
    isAlterationFiling (): boolean {
      return (this.stateModel.tombstone.filingType === FilingTypes.ALTERATION)
    },

    /** Whether the current filing is a Special Resolution. */
    isSpecialResolutionFiling (): boolean {
      return (this.stateModel.tombstone.filingType === FilingTypes.SPECIAL_RESOLUTION)
    },

    /** Whether the current filing is a Change of Registration. */
    isChangeRegFiling (): boolean {
      return (this.stateModel.tombstone.filingType === FilingTypes.CHANGE_OF_REGISTRATION)
    },

    /** Whether the current filing is a Conversion. */
    isConversionFiling (): boolean {
      return (this.stateModel.tombstone.filingType === FilingTypes.CONVERSION)
    },

    /** Whether the current filing is a Restoration. */
    isRestorationFiling (): boolean {
      return (this.stateModel.tombstone.filingType === FilingTypes.RESTORATION)
    },

    /** Whether the current filing is a Limited Restoration Extension. */
    isLimitedRestorationExtension (): boolean {
      return (this.getRestoration.type === RestorationTypes.LTD_EXTEND)
    },

    /** Whether the current filing is a Limited Restoration To Full (aka conversion). */
    isLimitedRestorationToFull (): boolean {
      return (this.getRestoration.type === RestorationTypes.LTD_TO_FULL)
    },

    /** Whether the current filing is a Change of Registration for a firm corp class. */
    isFirmChangeFiling (): boolean {
      return (this.isFirm && this.isChangeRegFiling)
    },

    /** Whether the current filing is a Correction for a BEN/BC/CCC/ULC. */
    isBenBcCccUlcCorrectionFiling (): boolean {
      return (this.isBenBcCccUlc && this.isCorrectionFiling)
    },

    /* Whether the current filing is a Correction for a cooperative. */
    isCoopCorrectionFiling (): boolean {
      return (this.isCoop && this.isCorrectionFiling)
    },

    /** Whether the current filing is a Correction for a firm corp class. */
    isFirmCorrectionFiling (): boolean {
      return (this.isFirm && this.isCorrectionFiling)
    },

    /** Whether the current filing is a Conversion for a firm corp class. */
    isFirmConversionFiling (): boolean {
      return (this.isFirm && this.isConversionFiling)
    },

    /** Whether the corrected filing is an Incorporation Application. */
    isCorrectedIncorporationApplication (): boolean {
      return (this.getCorrectedFilingType === FilingTypes.INCORPORATION_APPLICATION)
    },

    /** Whether the corrected filing is a Registration. */
    isCorrectedRegistration (): boolean {
      return (this.getCorrectedFilingType === FilingTypes.REGISTRATION)
    },

    /** Whether the corrected filing is a Change of Registration. */
    isCorrectedChangeReg (): boolean {
      return (this.getCorrectedFilingType === FilingTypes.CHANGE_OF_REGISTRATION)
    },

    /** The original entity type, this is for entity type alteration */
    getOriginLegalType (): CorpTypeCd {
      return this.getEntitySnapshot?.businessInfo?.legalType
    },

    // Original entity type getters
    isOriginBcCompany (): boolean {
      return (this.getOriginLegalType === CorpTypeCd.BC_COMPANY)
    },

    isOriginBenefitCompany (): boolean {
      return (this.getOriginLegalType === CorpTypeCd.BENEFIT_COMPANY)
    },

    isOriginBcUlcCompany (): boolean {
      return (this.getOriginLegalType === CorpTypeCd.BC_ULC_COMPANY)
    },

    isOriginBcCcc (): boolean {
      return (this.getOriginLegalType === CorpTypeCd.BC_CCC)
    },

    /** The entity type. */
    getEntityType (): CorpTypeCd {
      return this.stateModel.tombstone.entityType
    },

    /** Whether the entity is a Benefit Company. */
    isBenefitCompany (): boolean {
      return (this.getEntityType === CorpTypeCd.BENEFIT_COMPANY)
    },

    /** Whether the entity is a BC Corporation. */
    isBcCorporation (): boolean {
      return (this.getEntityType === CorpTypeCd.BC_CORPORATION)
    },

    /** Whether the entity is a Cooperative. */
    isCoop (): boolean {
      return (this.getEntityType === CorpTypeCd.COOP)
    },

    /** Whether the entity is a BC Company. */
    isBcCompany (): boolean {
      return (this.getEntityType === CorpTypeCd.BC_COMPANY)
    },

    /** Whether the entity is a Community Contribution Company. */
    isBcCcc (): boolean {
      return (this.getEntityType === CorpTypeCd.BC_CCC)
    },

    /** Whether the entity is an Unlimited Liability Company. */
    isBcUlcCompany (): boolean {
      return (this.getEntityType === CorpTypeCd.BC_ULC_COMPANY)
    },

    /** Whether the entity is a Sole Proprietorship. */
    isSoleProp (): boolean {
      return (this.getEntityType === CorpTypeCd.SOLE_PROP)
    },

    /** Whether the entity is a General Partnership. */
    isPartnership (): boolean {
      return (this.getEntityType === CorpTypeCd.PARTNERSHIP)
    },

    /** Whether the entity is a BEN/BC/CCC/ULC. */
    isBenBcCccUlc (): boolean {
      return (
        this.isBcCompany ||
        this.isBenefitCompany ||
        this.isBcCcc ||
        this.isBcUlcCompany
      )
    },

    /** Whether the entity is a GP/SP. */
    isFirm (): boolean {
      return (this.isPartnership || this.isSoleProp)
    },

    /** Whether the current account is a premium account. */
    isPremiumAccount (): boolean {
      return (this.stateModel.accountInformation.accountType === AccountTypes.PREMIUM)
    },

    /** The filing's effective date-time object. */
    getEffectiveDateTime (): EffectiveDateTimeIF {
      return this.stateModel.effectiveDateTime
    },

    /** The business' founding date (API format). */
    getBusinessFoundingDateTime (): string {
      return this.getBusinessInformation.foundingDate
    },

    /** The business' start date (YYYY-MM-DD). */
    getBusinessStartDate (): string {
      return this.getBusinessInformation.startDate
    },

    /** The current account id. */
    getAccountId (): number {
      return this.stateModel.accountInformation.id
    },

    /** The current date in format (YYYY-MM-DD), which is refreshed every time the app inits. */
    getCurrentDate (): string {
      return this.stateModel.tombstone.currentDate
    },

    /** The current JS Date object, which is refreshed every minute. */
    getCurrentJsDate (): Date {
      return this.stateModel.currentJsDate
    },

    /** The filing id. */
    getFilingId (): number {
      return this.stateModel.tombstone.filingId
    },

    /** The corrected filing's date (API format). */
    getCorrectedFilingDate (): string {
      return this.getCorrectionInformation.correctedFilingDate
    },

    /** The corrected filing's id. */
    getCorrectedFilingId (): number {
      return this.getCorrectionInformation.correctedFilingId
    },

    /** The corrected filing's type. */
    getCorrectedFilingType (): FilingTypes {
      return this.getCorrectionInformation.correctedFilingType
    },

    /** The correction error type. */
    getCorrectionErrorType (): CorrectionErrorTypes {
      return this.getCorrectionInformation.type
    },

    /** The correction (business) start date (YYYY-MM-DD). */
    getCorrectionStartDate (): string {
      return this.getCorrectionInformation.startDate
    },

    /** True if the correction is due to a client error. */
    isClientErrorCorrection (): boolean {
      return (this.getCorrectionErrorType === CorrectionErrorTypes.CLIENT)
    },

    /** The business identifier (aka incorporation number). */
    getBusinessId (): string {
      return this.stateModel.tombstone.businessId
    },

    /** The original legal name. */
    getOriginalLegalName (): string {
      return this.getEntitySnapshot?.businessInfo?.legalName
    },

    /** The appropriate edit label for corrections, alterations, change or conversion filings. */
    getEditLabel (): string {
      if (this.isCorrectionFiling) return 'Correct'

      if (
        this.isAlterationFiling ||
        this.isFirmChangeFiling ||
        this.isFirmConversionFiling ||
        this.isSpecialResolutionFiling
      ) {
        return 'Change'
      }

      return 'Edit' // If Restoration extension or Conversion
    },

    /** The appropriate edited label for corrections, alterations, change or conversion filings. */
    getEditedLabel (): string {
      if (this.isCorrectionFiling) return 'Corrected'

      if (
        this.isAlterationFiling ||
        this.isFirmChangeFiling ||
        this.isFirmConversionFiling ||
        this.isRestorationFiling ||
        this.isSpecialResolutionFiling
      ) {
        return 'Changed'
      }

      return 'Edited' // should never happen
    },

    /** The appropriate edits saved label for corrections, alterations, change or conversion filings. */
    getEditSavedLabel (): string {
      if (this.isCorrectionFiling) return 'Corrections Saved'

      if (
        this.isAlterationFiling ||
        this.isFirmChangeFiling ||
        this.isFirmConversionFiling ||
        this.isRestorationFiling ||
        this.isSpecialResolutionFiling
      ) {
        return 'Changes Saved'
      }

      return 'Edits Saved' // should never happen
    },

    /** The original entity snapshot. */
    getEntitySnapshot (): EntitySnapshotIF {
      return this.stateModel.entitySnapshot
    },

    /** The original entity snapshot state filing's URL. */
    getStateFilingUrl (): string {
      return this.stateModel.entitySnapshot?.businessInfo?.stateFiling
    },

    /** The business number. */
    getBusinessNumber (): string {
      // remove first 2 chars from Business ID
      return this.stateModel.tombstone.businessId?.substring(2)
    },

    /** The current user's info. (May be null.) */
    getUserInfo (): any {
      return this.stateModel.tombstone.userInfo
    },

    /** The current user's keycloak roles. */
    getKeycloakRoles (): Array<string> {
      return this.stateModel.tombstone.keycloakRoles
    },

    /** The org info. (May be null.) */
    getOrgInfo (): any {
      return this.stateModel.tombstone.orgInfo
    },

    /** The current user's email. (May be undefined.) */
    getUserEmail (): string {
      // get email from contacts[0] if it exists (ie, for BCSC users)
      // else get email from root object
      return this.getUserInfo?.contacts[0]?.email || this.getUserInfo?.email
    },

    /** The current user's phone. (May be undefined.) */
    getUserPhone (): string {
      // get phone from contacts[0] if it exists (ie, for BCSC users)
      // else get phone from root object
      return this.getUserInfo?.contacts[0]?.phone || this.getUserInfo?.phone
    },

    /** The current user's first name. (May be undefined.) */
    getUserFirstName (): string {
      return this.getUserInfo?.firstname
    },

    /** The current user's last name. (May be undefined.) */
    getUserLastName (): string {
      return this.getUserInfo?.lastname
    },

    /** The current user's username. (May be undefined.) */
    getUserUsername (): string {
      return this.getUserInfo?.username
    },

    /** The business folio number. */
    getFolioNumber (): string {
      return this.stateModel.tombstone.folioNumber
    },

    /** The transactional folio number. */
    getTransactionalFolioNumber (): string {
      return this.stateModel.tombstone.transactionalFolioNumber
    },

    /** The current NAICS object. */
    getCurrentNaics (): NaicsIF {
      return {
        naicsCode: this.getBusinessInformation.naicsCode,
        naicsDescription: this.getBusinessInformation.naicsDescription
      }
    },

    /** The snapshot NAICS object. */
    getSnapshotNaics (): NaicsIF {
      return {
        naicsCode: this.getEntitySnapshot?.businessInfo?.naicsCode,
        naicsDescription: this.getEntitySnapshot?.businessInfo?.naicsDescription
      }
    },

    /** The association (coop) type. */
    getAssociationType (): CoopTypes {
      return this.getBusinessInformation.associationType
    },

    /** The Name Request object. */
    getNameRequest (): NameRequestIF {
      return this.stateModel.nameRequest
    },

    /** The Name Request Number. */
    getNameRequestNumber (): string {
      return this.getNameRequest?.nrNumber
    },

    /** The Name Request Legal Name (approved name). */
    getNameRequestLegalName (): string {
      return this.getNameRequest?.legalName
    },

    /** The name translations. */
    getNameTranslations (): NameTranslationIF[] {
      return this.stateModel.nameTranslations
    },

    /** Whether name translations have changed. */
    haveNameTranslationsChanged (): boolean {
      return (this.getNameTranslations.filter(x => x.action).length > 0)
    },

    /** The office addresses. */
    getOfficeAddresses (): AddressesIF {
      return this.stateModel.officeAddresses
    },

    /** The org-people list. */
    getOrgPeople (): Array<OrgPersonIF> {
      return this.stateModel.peopleAndRoles.orgPeople
    },

    /** The share classes list. */
    getShareClasses (): Array<ShareClassIF> {
      return this.stateModel.shareStructureStep.shareClasses
    },

    /** The business contact object. */
    getBusinessContact (): ContactPointIF {
      return this.stateModel.businessContact
    },

    /** Whether we are ignoring data changes. */
    ignoreChanges (): boolean {
      return this.stateModel.tombstone.ignoreChanges
    },

    /** Whether there are unsaved data changes. */
    haveUnsavedChanges (): boolean {
      return this.stateModel.tombstone.haveUnsavedChanges
    },

    /** The staff payment. */
    getStaffPayment (): StaffPaymentIF {
      return this.stateModel.staffPayment
    },

    /** The filing data. */
    getFilingData (): FilingDataIF[] {
      return this.stateModel.filingData
    },

    /** Whether app is busy saving/saving and resuming/filing and paying. */
    isBusySaving (): boolean {
      return (this.isSaving || this.isSavingResuming || this.isFilingPaying)
    },

    /** Whether app is busy saving. */
    isSaving (): boolean {
      return this.stateModel.tombstone.isSaving
    },

    /** Whether app is busy saving and resuming. */
    isSavingResuming (): boolean {
      return this.stateModel.tombstone.isSavingResuming
    },

    /** Whether app is busy filing and paying. */
    isFilingPaying (): boolean {
      return this.stateModel.tombstone.isFilingPaying
    },

    /**
     * Whether any correction data has changed (for the purpose of showing the
     * fee summary), ie, does not include:
     * - completing party
     * - detail
     * - certify
     * - staff payment
     */
    hasCorrectionDataChanged (): boolean {
      if (this.isBenBcCccUlcCorrectionFiling) {
        return (
          this.hasBusinessNameChanged ||
          this.hasBusinessTypeChanged ||
          this.haveNameTranslationsChanged ||
          this.haveOfficeAddressesChanged ||
          this.havePeopleAndRolesChanged ||
          this.hasShareStructureChanged ||
          this.areProvisionsRemoved ||
          this.haveNewResolutionDates
        )
      }

      if (this.isFirmCorrectionFiling) {
        return (
          this.hasBusinessNameChanged ||
          this.hasBusinessStartDateChanged ||
          this.hasNaicsChanged ||
          this.haveOfficeAddressesChanged ||
          this.havePeopleAndRolesChanged
        )
      }

      if (this.isCoopCorrectionFiling) {
        return (
          this.hasBusinessNameChanged ||
          this.hasAssociationTypeChanged ||
          this.hasSpecialResolutionMemorandumChanged ||
          this.hasSpecialResolutionRulesChanged ||
          this.hasSpecialResolutionResolutionChanged
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
    hasAlterationDataChanged (): boolean {
      return (
        this.hasBusinessNameChanged ||
        this.hasBusinessTypeChanged ||
        this.haveNameTranslationsChanged ||
        this.hasShareStructureChanged ||
        this.areProvisionsRemoved ||
        this.haveNewResolutionDates
      )
    },

    /**
     * Whether any special resolution filing (non-correction) has changed (for the purpose of showing the
     * fee summary), ie, does NOT include:
     * - certify
     * - folio number
     * - court order and POA
     * - staff payment
     * - address (read only)
     * - contact info
     */
    hasSpecialResolutionDataChanged (): boolean {
      return (
        this.hasBusinessNameChanged ||
        this.hasBusinessTypeChanged ||
        this.hasAssociationTypeChanged ||
        this.hasSpecialResolutionMemorandumChanged ||
        this.hasSpecialResolutionRulesChanged
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
    hasChangeDataChanged (): boolean {
      return (
        this.hasBusinessNameChanged ||
        this.hasBusinessStartDateChanged ||
        this.hasNaicsChanged ||
        this.haveOfficeAddressesChanged ||
        this.havePeopleAndRolesChanged
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
    hasConversionDataChanged (): boolean {
      return (
        this.hasBusinessStartDateChanged ||
        this.hasNaicsChanged ||
        this.haveOfficeAddressesChanged ||
        this.havePeopleAndRolesChanged
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
    hasRestorationDataChanged (): boolean {
      return (
        this.hasBusinessNameChanged ||
        this.haveNameTranslationsChanged ||
        this.haveOfficeAddressesChanged ||
        this.havePeopleAndRolesChanged
      )
    },

    /** Whether the subject correction filing is valid. */
    isCorrectionValid (): boolean {
      if (this.isBenBcCccUlcCorrectionFiling) {
        if (this.isClientErrorCorrection) {
          return (
            this.getFlagsCompanyInfo.isValidCompanyName &&
            this.getFlagsCompanyInfo.isValidNameTranslation &&
            this.getFlagsCompanyInfo.isValidAddress &&
            this.getFlagsCompanyInfo.isValidOrgPersons &&
            this.getFlagsCompanyInfo.isValidShareStructure &&
            this.getFlagsReviewCertify.isValidDetailComment &&
            this.getFlagsReviewCertify.isValidCertify &&
            this.getFlagsReviewCertify.isValidStaffPayment
          )
        } else {
          return (
            this.getFlagsCompanyInfo.isValidCompanyName &&
            this.getFlagsCompanyInfo.isValidNameTranslation &&
            this.getFlagsCompanyInfo.isValidOrgPersons &&
            this.getFlagsCompanyInfo.isValidAddress &&
            this.getFlagsCompanyInfo.isValidShareStructure &&
            this.getFlagsReviewCertify.isValidDetailComment &&
            // don't check certify for staff correction
            this.getFlagsReviewCertify.isValidStaffPayment
          )
        }
      }

      if (this.isFirmCorrectionFiling) {
        if (this.isClientErrorCorrection) {
          return (
            this.getFlagsCompanyInfo.isValidCompanyName &&
            this.getFlagsCompanyInfo.isValidStartDate &&
            this.getFlagsCompanyInfo.isValidNatureOfBusiness &&
            this.getFlagsCompanyInfo.isValidAddress &&
            this.getFlagsCompanyInfo.isValidOrgPersons &&
            this.getFlagsReviewCertify.isValidCompletingParty &&
            this.getFlagsReviewCertify.isValidDetailComment &&
            this.getFlagsReviewCertify.isValidCertify &&
            this.getFlagsReviewCertify.isValidStaffPayment
          )
        } else {
          return (
            this.getFlagsCompanyInfo.isValidCompanyName &&
            this.getFlagsCompanyInfo.isValidStartDate &&
            this.getFlagsCompanyInfo.isValidNatureOfBusiness &&
            this.getFlagsCompanyInfo.isValidAddress &&
            this.getFlagsCompanyInfo.isValidOrgPersons &&
            // don't check completing party for staff correction
            this.getFlagsReviewCertify.isValidDetailComment &&
            // don't check certify for staff correction
            this.getFlagsReviewCertify.isValidStaffPayment
          )
        }
      }

      if (this.isCoopCorrectionFiling) {
        return (
          this.getFlagsCompanyInfo.isValidCompanyName &&
          this.getFlagsCompanyInfo.isValidAssociationType &&
          this.getFlagsCompanyInfo.isValidContactInfo &&
          this.getFlagsCompanyInfo.isValidRules &&
          this.getFlagsCompanyInfo.isValidMemorandum &&
          this.getFlagsCompanyInfo.isValidSpecialResolution &&
          this.getFlagsCompanyInfo.isValidSpecialResolutionSignature &&
          this.getFlagsReviewCertify.isValidCompletingParty &&
          this.getFlagsReviewCertify.isValidDetailComment &&
          this.getFlagsReviewCertify.isValidCourtOrder &&
          // Check certify for client correction only.
          (!this.isClientErrorCorrection || this.getFlagsReviewCertify.isValidCertify) &&
          this.getFlagsReviewCertify.isValidStaffPayment
        )
      }
      return false // should never happen
    },

    /** Whether the subject correction filing has any sections in editing mode. */
    isCorrectionEditing (): boolean {
      // NB: Folio Number, Detail, Certify and Staff Payment don't have an "editing" mode.
      return (
        this.stateModel.editingFlags.companyName ||
        this.stateModel.editingFlags.associationType ||
        this.stateModel.editingFlags.nameTranslations ||
        this.stateModel.editingFlags.officeAddresses ||
        this.stateModel.editingFlags.peopleAndRoles ||
        this.stateModel.editingFlags.shareStructure ||
        this.stateModel.editingFlags.rules ||
        this.stateModel.editingFlags.memorandum ||
        this.stateModel.editingFlags.specialResolution
      )
    },

    /** The validation flags. */
    getValidationFlags (): ValidationFlagsIF {
      return this.stateModel.validationFlags
    },

    /** True if app level validation is enabled. */
    getAppValidate (): boolean {
      return this.getValidationFlags.appValidate
    },

    /** True if component level validation is enabled. */
    getComponentValidate (): boolean {
      return this.getValidationFlags.componentValidate
    },

    /** The review and certify page validity flags. */
    getFlagsReviewCertify (): FlagsReviewCertifyIF {
      return this.getValidationFlags.flagsReviewCertify
    },

    /** The company info page validity flags. */
    getFlagsCompanyInfo (): FlagsCompanyInfoIF {
      return this.getValidationFlags.flagsCompanyInfo
    },

    getDetailComment (): string {
      return this.stateModel.detailComment
    },

    /** The business information object. */
    getBusinessInformation (): BusinessInformationIF {
      return this.stateModel.businessInformation
    },

    /** The correction information object. */
    getCorrectionInformation (): CorrectionInformationIF {
      return this.stateModel.correctionInformation
    },

    getCertifyState (): CertifyIF {
      return this.stateModel.certifyState
    },

    getResource (): ResourceIF {
      return this.resourceModel
    },

    getDocumentOptionalEmail (): string {
      return this.stateModel.documentDelivery.documentOptionalEmail
    },

    /** Checks for a 7 digit pattern to identify a numbered company from the Legal Name. */
    isNumberedCompany (): boolean {
      return RegExp('^\\d{7}$').test(this.getOriginalLegalName?.split(' ')[0])
    },

    /** Check for conflicting legal types between current type and altered type. */
    isConflictingLegalType (): boolean {
      return (this.getEntityType !== this.stateModel.nameRequest.legalType)
    },

    /** The Summary Mode state. */
    isSummaryMode (): boolean {
      return this.stateModel.summaryMode
    },

    /** Whether business name has changed. */
    hasBusinessNameChanged (): boolean {
      const currentLegalName = this.getNameRequestLegalName // may be empty
      const originalLegalName = this.getOriginalLegalName

      return (currentLegalName !== originalLegalName)
    },

    /** Whether business name has changed by type change. */
    isNameChangedByType (): boolean {
      return this.stateModel.tombstone.nameChangedByType
    },

    /** Whether business type has changed by name change. */
    isEntityTypeChangedByName (): boolean {
      return this.stateModel.tombstone.entityTypeChangedByName
    },

    /** Whether business type has changed. */
    hasBusinessTypeChanged (): boolean {
      const currentEntityType = this.getEntityType
      const originalLegalType = this.getEntitySnapshot?.businessInfo?.legalType

      return (currentEntityType !== originalLegalType)
    },

    /** Whether business start date has changed. */
    hasBusinessStartDateChanged (): boolean {
      return !!this.getCorrectionStartDate
    },

    /** Whether association type has changed. */
    hasAssociationTypeChanged (): boolean {
      const currentAssociationType = this.getAssociationType
      const originalAssociationType = this.getEntitySnapshot?.businessInfo?.associationType

      return (currentAssociationType !== originalAssociationType)
    },

    /** Whether contact info data has changed. */
    hasContactInfoChanged (): boolean {
      const businessContact = this.getBusinessContact
      const snapshotContact = this.getEntitySnapshot?.authInfo?.contact

      return (
        (businessContact?.email !== snapshotContact?.email) ||
        (businessContact?.phone !== snapshotContact?.phone) ||
        (businessContact?.extension !== snapshotContact?.extension)
      )
    },

    /** True if any office address has changed. Applies to corrections, change and conversion filings only. */
    haveOfficeAddressesChanged (): boolean {
      if (
        this.isCorrectionFiling ||
        this.isFirmChangeFiling ||
        this.isFirmConversionFiling ||
        this.isRestorationFiling
      ) {
        const hasMailingDeliveryChanged = this.hasMailingChanged || this.hasDeliveryChanged
        const isChangeOrConversionFiling = this.isFirmChangeFiling || this.isFirmConversionFiling
        const hasRecMailingDeliveryChanged = this.hasRecMailingChanged || this.hasRecDeliveryChanged

        return (
          hasMailingDeliveryChanged ||
          // exclude Records Address conditions from Change or Conversion filing
          (!isChangeOrConversionFiling && hasRecMailingDeliveryChanged)
        )
      }
      return false
    },

    /** The office addresses from the original filing. NB: may be {} */
    getOriginalOfficeAddresses (): AddressesIF {
      return this.getEntitySnapshot?.addresses
    },

    /** True if (registered) mailing address has changed. */
    hasMailingChanged (): boolean {
      if (
        this.isAlterationFiling ||
        this.isBenBcCccUlcCorrectionFiling ||
        this.isRestorationFiling
      ) {
        return !IsSame(
          this.getOfficeAddresses?.registeredOffice?.mailingAddress,
          this.getOriginalOfficeAddresses?.registeredOffice?.mailingAddress,
          ['addressCountryDescription', 'id']
        )
      }
      if (
        this.isFirmChangeFiling ||
        this.isFirmConversionFiling ||
        this.isFirmCorrectionFiling
      ) {
        return !IsSame(
          this.getOfficeAddresses?.businessOffice?.mailingAddress,
          this.getOriginalOfficeAddresses?.businessOffice?.mailingAddress,
          ['addressCountryDescription', 'id']
        )
      }
      return false // should never happen
    },

    /** True if (registered) delivery address has changed. */
    hasDeliveryChanged (): boolean {
      if (
        this.isAlterationFiling ||
        this.isBenBcCccUlcCorrectionFiling ||
        this.isRestorationFiling
      ) {
        return !IsSame(
          this.getOfficeAddresses?.registeredOffice?.deliveryAddress,
          this.getOriginalOfficeAddresses?.registeredOffice?.deliveryAddress,
          ['addressCountryDescription', 'id']
        )
      }
      if (
        this.isFirmChangeFiling ||
        this.isFirmConversionFiling ||
        this.isFirmCorrectionFiling
      ) {
        return !IsSame(
          this.getOfficeAddresses?.businessOffice?.deliveryAddress,
          this.getOriginalOfficeAddresses?.businessOffice?.deliveryAddress,
          ['addressCountryDescription', 'id']
        )
      }
      return false // should never happen
    },

    /** True if records mailing address has changed. */
    hasRecMailingChanged (): boolean {
      return !IsSame(
        this.getOfficeAddresses?.recordsOffice?.mailingAddress,
        this.getOriginalOfficeAddresses?.recordsOffice?.mailingAddress,
        ['addressCountryDescription', 'id']
      )
    },

    /** True if records delivery address has changed. */
    hasRecDeliveryChanged (): boolean {
      return !IsSame(
        this.getOfficeAddresses?.recordsOffice?.deliveryAddress,
        this.getOriginalOfficeAddresses?.recordsOffice?.deliveryAddress,
        ['addressCountryDescription', 'id']
      )
    },

    /** True if any people/roles have changed. */
    havePeopleAndRolesChanged (): boolean {
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

      const currentOrgPersons = this.getOrgPeople?.map(op => normalize(op))
      const originalOrgPersons = this.getEntitySnapshot?.orgPersons?.map(op => normalize(op))

      return !IsSame(currentOrgPersons, originalOrgPersons, ['actions', 'confirmNameChange'])
    },

    /** Whether share structure data has changed. */
    hasShareStructureChanged (): boolean {
      let currentShareClasses = this.getShareClasses
      let originalShareClasses = this.getEntitySnapshot?.shareStructure?.shareClasses

      // Null action properties can be assigned to the ShareClasses when cancelling edits
      // This is fail safe to ensure null actions are not included in the comparison
      const removeNullProps = (obj) => {
        return Object.fromEntries(
          Object.entries(obj)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, v]) => v != null)
            .map(([k, v]) => [k, v === Object(v) ? removeNullProps(v) : v])
        )
      }

      currentShareClasses = currentShareClasses && removeNullProps(currentShareClasses)
      originalShareClasses = originalShareClasses && removeNullProps(originalShareClasses)

      return !IsSame(originalShareClasses, currentShareClasses)
    },

    /** Whether NAICS data has changed. */
    hasNaicsChanged (): boolean {
      const currentNaicsCode = this.getBusinessInformation.naicsCode
      const originalNaicsCode = this.getEntitySnapshot?.businessInfo?.naicsCode

      // first try to compare codes
      if (currentNaicsCode || originalNaicsCode) {
        return (currentNaicsCode !== originalNaicsCode)
      }

      const currentNaicsDescription = this.getBusinessInformation.naicsDescription
      const originalNaicsDescription = this.getEntitySnapshot?.businessInfo?.naicsDescription

      // then try to compare descriptions
      if (currentNaicsDescription || originalNaicsDescription) {
        return (currentNaicsDescription !== originalNaicsDescription)
      }

      return false
    },

    /** Whether the provisions are removed. */
    areProvisionsRemoved (): boolean {
      return (this.stateModel.newAlteration.provisionsRemoved === true)
    },

    /** The original resolution dates. */
    getOriginalResolutions (): ResolutionsIF[] {
      return this.getEntitySnapshot?.resolutions
    },

    /** The new resolution dates. */
    getNewResolutionDates (): string[] {
      return this.stateModel.shareStructureStep.resolutionDates
    },

    /** Whether there are any new resolution dates. */
    haveNewResolutionDates (): boolean {
      return (this.getNewResolutionDates?.length > 0)
    },

    /** The file number (aka court order number). */
    getFileNumber (): string {
      return this.stateModel.newAlteration.courtOrder.fileNumber
    },
    /** Returns true if the filing has a court order number  */
    hasFileNumber (): boolean {
      return !!this.getFileNumber
    },

    /** The Plan of Arrangement state. */
    getHasPlanOfArrangement (): boolean {
      return this.stateModel.newAlteration.courtOrder.hasPlanOfArrangement
    },

    /** True if the share structure contains any special rights of restrictions. */
    getHasRightsOrRestrictions (): any {
      const shareClasses = this.stateModel.shareStructureStep.shareClasses

      // Search and return on the first match
      // Don't need to search Series, as they can't exist on a parent without rights or restrictions
      return shareClasses.some(shareClass => shareClass.hasRightsOrRestrictions)
    },

    /** True if the share structure contains any special rights of restrictions. */
    getHasOriginalRightsOrRestrictions (): any {
      const shareClasses = this.getEntitySnapshot?.shareStructure?.shareClasses

      // Search and return on the first match
      // Don't need to search Series, as they can't exist on a parent without rights or restrictions
      return shareClasses?.some(shareClass => shareClass.hasRightsOrRestrictions)
    },

    /** True if resolution dates are valid. */
    getIsResolutionDatesValid (): boolean {
      if (
        this.hasShareStructureChanged &&
        (this.getHasOriginalRightsOrRestrictions || this.getHasRightsOrRestrictions)
      ) {
        return (this.getNewResolutionDates.length >= 1)
      }
      return true
    },

    /**
     * Whether to show the fee summary.
     * This is a safety check to ensure that fee summary component is not loaded
     * until there is a valid filing type and entity code.
     */
    showFeeSummary (): boolean {
      const defaultFilingData: FilingDataIF[] = [{
        filingTypeCode: null,
        entityType: null,
        priority: false,
        waiveFees: false
      }]
      const haveFilingChange = (
        (this.isCorrectionFiling && this.hasCorrectionDataChanged) ||
        (this.isAlterationFiling && this.hasAlterationDataChanged) ||
        (this.isFirmChangeFiling && this.hasChangeDataChanged) ||
        (this.isFirmConversionFiling && this.hasConversionDataChanged) ||
        (this.isRestorationFiling && this.hasRestorationDataChanged) ||
        (this.isSpecialResolutionFiling && this.hasSpecialResolutionDataChanged) ||
        this.isRestorationFiling
      )
      return (haveFilingChange && !IsSame(this.getFilingData, defaultFilingData))
    },

    /** The current fees. */
    getCurrentFees (): FeesIF[] {
      return this.stateModel.currentFees
    },

    /** The fee prices. */
    getFeePrices (): FeesIF[] {
      return this.stateModel.feePrices
    },

    /** True when the minimum share classes requirements are met. */
    hasMinimumShareClass (): boolean {
      const shareClasses = this.stateModel.shareStructureStep.shareClasses

      // Filter out REMOVED class actions
      const currentShareClasses = shareClasses.filter(x => x.action !== ActionTypes.REMOVED)

      return (currentShareClasses.length > 0)
    },

    /** The current filing name. */
    getFilingName (): FilingNames {
      if (this.isAlterationFiling) return FilingNames.ALTERATION
      if (this.isCorrectionFiling) return FilingNames.CORRECTION
      if (this.isFirmChangeFiling) return FilingNames.CHANGE_OF_REGISTRATION
      if (this.isFirmConversionFiling) return FilingNames.CONVERSION
      if (this.isRestorationFiling) {
        if (this.isLimitedRestorationExtension) return FilingNames.RESTORATION_EXTENSION
        if (this.isLimitedRestorationToFull) return FilingNames.RESTORATION_CONVERSION
      }
      if (this.isSpecialResolutionFiling) return FilingNames.SPECIAL_RESOLUTION
      return null
    },

    /** The completing party data. */
    getCompletingParty (): CompletingPartyIF {
      return this.stateModel.completingParty
    },

    /** The restoration object. */
    getRestoration (): RestorationStateIF {
      return this.stateModel.restoration
    },

    /** The restoration object. */
    getStateFilingRestoration (): StateFilingRestorationIF {
      return this.stateModel.stateFilingRestoration
    },

    /** The approval type validity. */
    getApprovalTypeValid (): boolean {
      return this.stateModel.validationFlags.flagsCompanyInfo.isValidApprovalType
    },

    /** The expiry date validity. */
    getExpiryValid (): boolean {
      return this.stateModel.validationFlags.flagsCompanyInfo.isValidExtensionTime
    },

    /** Returns false when users can change the sole proprietor (SP).
     * Restricts the ability of non-staff users from changing the sole
     * proprietor when the SP is an organization.  This restriction has been
     * added to ensure that changes made in business-edit-ui are also updated by
     * staff in COLIN */
    hideChangeButtonForSoleProps (): boolean {
      const isProprietor = this.getOrgPeople[0]?.roles[0]?.roleType === RoleTypes.PROPRIETOR
      const isOrganization = this.getOrgPeople[0]?.officer?.partyType === PartyTypes.ORGANIZATION
      const isDba = isProprietor && isOrganization
      return !this.isRoleStaff && isDba
    },

    /**
     * The restoration expiry date (YYYY-MM-DD).
     * Only applicable to limited restoration extension filing.
     */
    getRestorationExpiryDate (): string {
      return this.stateModel.restoration?.expiry
    },

    /** The restoration expiry text. */
    getRestorationExpiryText (): string {
      if (this.getRestorationExpiryDate) {
        const numberOfExtensionMonths = DateUtilities.subtractDates(
          this.getStateFilingRestoration?.expiry,
          this.getRestorationExpiryDate
        )
        const expiryDatePacific = DateUtilities.yyyyMmDdToPacificDate(this.getRestorationExpiryDate)
        return (numberOfExtensionMonths + ' months, expires on ' + expiryDatePacific)
      }
      return '[no expiry date]'
    },

    /** The court order draft file number. */
    getCourtOrderNumberText (): string {
      return this.stateModel.restoration.courtOrder?.fileNumber || ''
    },

    getRelationships (): RelationshipTypes[] {
      return this.stateModel.restoration.relationships
    },

    getIsRestorationTypeCourtOrder (): boolean {
      return !!this.stateModel.restoration.courtOrder?.fileNumber
    },

    /** The special resolution object. */
    getSpecialResolution (): SpecialResolutionIF {
      return this.stateModel.specialResolution
    },

    /** The special resolution validity flags. */
    getSpecialResolutionFormValid (): boolean {
      return this.getValidationFlags.flagsCompanyInfo.isValidSpecialResolution &&
        this.getValidationFlags.flagsCompanyInfo.isValidSpecialResolutionSignature
    },

    /** The company info page validity flags. */
    getSpecialResolutionConfirmValid (): boolean {
      return this.getFlagsReviewCertify.isValidSpecialResolutionConfirm
    },

    getSpecialResolutionRules (): RulesMemorandumIF {
      return this.stateModel.rules
    },

    getSpecialResolutionMemorandum (): RulesMemorandumIF {
      return this.stateModel.memorandum
    },

    hasSpecialResolutionMemorandumChanged (): boolean {
      return this.getSpecialResolutionMemorandum?.includedInResolution
    },

    hasSpecialResolutionRulesChanged (): boolean {
      return this.getSpecialResolutionRules?.includedInResolution ||
        this.getSpecialResolutionRules?.key !==
        this.getEntitySnapshot?.businessDocuments?.documentsInfo?.certifiedRules?.key
    },

    // Grab the latest resolution from the entity snapshot.
    getLatestResolutionForBusiness (): SpecialResolutionIF {
      // Obtain latest resolution ID. Assumes that the latest resolution is the one to be corrected.
      const latestResolution = this.getEntitySnapshot.resolutions
        .reduce((prev, current) => (prev.id > current.id) ? prev : current)
      return {
        ...latestResolution,
        resolutionDate: latestResolution.date
      }
    },

    // Only used for correction filings.
    hasSpecialResolutionResolutionChanged (): boolean {
      const entitySnapshotResolution = this.getLatestResolutionForBusiness
      return (
        entitySnapshotResolution.resolution !== this.getSpecialResolution.resolution ||
        !isEqual(entitySnapshotResolution.signatory, this.getSpecialResolution.signatory) ||
        entitySnapshotResolution.resolutionDate !== this.getSpecialResolution.resolutionDate ||
        entitySnapshotResolution.signingDate !== this.getSpecialResolution.signingDate
      )
    },

    /** Determine if we should show the create special resolution component. */
    showSpecialResolutionResolution (): boolean {
      return (
        this.hasBusinessNameChanged ||
        this.hasAssociationTypeChanged ||
        this.hasSpecialResolutionRulesChanged ||
        this.hasSpecialResolutionMemorandumChanged) ||
        this.isCoopCorrectionFiling
    },

    getNumberOfDirectors (): number {
      return this.getOrgPeople.map(person => person.roles.filter(role => role.roleType === RoleTypes.DIRECTOR)).length
    }

  },
  actions: {
    setEntityType (entityType: CorpTypeCd) {
      this.stateModel.tombstone.entityType = entityType
    },
    setEntityTypeChangedByName (entityTypeChangedByName: boolean) {
      this.stateModel.tombstone.entityTypeChangedByName = entityTypeChangedByName
    },
    setBusinessId (businessId: string) {
      this.stateModel.tombstone.businessId = businessId
    },
    setIsSaving (isSaving: boolean) {
      this.stateModel.tombstone.isSaving = isSaving
    },
    setIsSavingResuming (isSavingResuming: boolean) {
      this.stateModel.tombstone.isSavingResuming = isSavingResuming
    },
    setIsFilingPaying (isFilingPaying: boolean) {
      this.stateModel.tombstone.isFilingPaying = isFilingPaying
    },
    setKeycloakRoles (keycloakRoles: string[]) {
      this.stateModel.tombstone.keycloakRoles = keycloakRoles
    },
    setUserInfo (userInfo: any) {
      this.stateModel.tombstone.userInfo = userInfo
    },
    setOrgInfo (orgInfo: any) {
      this.stateModel.tombstone.orgInfo = orgInfo
    },
    setCurrentDate (dateString: string) {
      this.stateModel.tombstone.currentDate = dateString
    },
    setCurrentJsDate (date: Date) {
      this.stateModel.currentJsDate = date
    },
    setIsFutureEffective (isFutureEffective: boolean) {
      this.stateModel.effectiveDateTime.isFutureEffective = isFutureEffective
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setEffectiveDateTimeString (dateTime: string) {
      this.stateModel.effectiveDateTime.dateTimeString = dateTime
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setEffectiveDateValid (valid: boolean) {
      this.stateModel.validationFlags.flagsReviewCertify.isValidEffectiveDate = valid
    },
    setResource (resource: ResourceIF) {
      this.resourceModel = resource
    },
    setCertifyState (certifyState: CertifyIF) {
      this.stateModel.certifyState = certifyState
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setCertifyStateValidity (validity: boolean) {
      this.stateModel.validationFlags.flagsReviewCertify.isValidCertify = validity
    },
    setDocumentOptionalEmail (documentOptionalEmail: string) {
      this.stateModel.documentDelivery.documentOptionalEmail = documentOptionalEmail
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setDocumentOptionalEmailValidity (validity: boolean) {
      this.stateModel.validationFlags.flagsReviewCertify.isValidDocumentOptionalEmail = validity
    },
    setCompletingParty (cp: CompletingPartyIF) {
      this.stateModel.completingParty = cp
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setCompletingPartyValidity (validity: boolean) {
      this.stateModel.validationFlags.flagsReviewCertify.isValidCompletingParty = validity
    },
    setTransactionalFolioNumber (folioNumber: string) {
      this.stateModel.tombstone.transactionalFolioNumber = folioNumber
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setTransactionalFolioNumberValidity (validity: boolean) {
      this.stateModel.validationFlags.flagsReviewCertify.isValidTransactionalFolioNumber = validity
    },
    setBusinessContact (businessContact: ContactPointIF) {
      this.stateModel.businessContact = businessContact
      // don't set Have Changes flag for business contact since it's changed directly in Auth API
    },
    setOfficeAddresses (addresses: AddressesIF) {
      this.stateModel.officeAddresses = addresses
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setFolioNumber (folioNumber: string) {
      this.stateModel.tombstone.folioNumber = folioNumber
      // NB: folio number was changed immediately in auth db - do not set unsaved Changes flag
    },
    setAccountInformation (accountInformation: AccountInformationIF) {
      this.stateModel.accountInformation = accountInformation
    },
    setBusinessInformation (businessInformation: BusinessInformationIF) {
      this.stateModel.businessInformation = businessInformation
    },
    setCorrectionInformation (correctionInformation: CorrectionInformationIF) {
      this.stateModel.correctionInformation = correctionInformation
    },
    setCorrectionStartDate (startDate: string) {
      this.stateModel.correctionInformation.startDate = startDate
    },
    setNameRequest (nameRequest: NameRequestIF) {
      this.stateModel.nameRequest = nameRequest
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setNameChangedByType (changedByType: boolean) {
      this.stateModel.tombstone.nameChangedByType = changedByType
    },
    setNameTranslations (nameTranslations: NameTranslationIF[]) {
      this.stateModel.nameTranslations = nameTranslations
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setFilingId (filingId: number) {
      this.stateModel.tombstone.filingId = filingId
    },
    setPeopleAndRoles (orgPeople: OrgPersonIF[]) {
      this.stateModel.peopleAndRoles.orgPeople = orgPeople
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setPeopleAndRolesChanged (changed: boolean) {
      this.stateModel.peopleAndRoles.changed = changed
    },
    setPeopleAndRolesValidity (validity: boolean) {
      this.stateModel.validationFlags.flagsCompanyInfo.isValidOrgPersons = validity
    },
    setShareClasses (shareClasses: ShareClassIF[]) {
      this.stateModel.shareStructureStep.shareClasses = shareClasses
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setShareStructureChanged (changed: boolean) {
      this.stateModel.shareStructureStep.changed = changed
    },
    setCreateShareStructureStepValidity (validity: boolean) {
      this.stateModel.validationFlags.flagsCompanyInfo.isValidShareStructure = validity
    },
    setIgnoreChanges (ignoreChanges: boolean) {
      this.stateModel.tombstone.ignoreChanges = ignoreChanges
    },
    setHaveUnsavedChanges (haveUnsavedChanges: boolean) {
      this.stateModel.tombstone.haveUnsavedChanges = haveUnsavedChanges
    },
    setEntitySnapshot (entitySnapshot: EntitySnapshotIF) {
      this.stateModel.entitySnapshot = entitySnapshot
    },
    setStaffPayment (staffPayment: StaffPaymentIF) {
      this.stateModel.staffPayment = staffPayment
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setStaffPaymentValidity (validity: boolean) {
      this.stateModel.validationFlags.flagsReviewCertify.isValidStaffPayment = validity
    },
    setFilingData (filingData: FilingDataIF[]) {
      this.stateModel.filingData = filingData
    },
    setDetailComment (comment: string) {
      this.stateModel.detailComment = comment
    },
    setDetailValidity (validity: boolean) {
      this.stateModel.validationFlags.flagsReviewCertify.isValidDetailComment = validity
    },
    setEditingCompanyName (editing: boolean) {
      this.stateModel.editingFlags.companyName = editing
    },
    setEditingAssociationType (editing: boolean) {
      this.stateModel.editingFlags.associationType = editing
    },
    setEditingNameTranslations (editing: boolean) {
      this.stateModel.editingFlags.nameTranslations = editing
    },
    setEditingOfficeAddresses (editing: boolean) {
      this.stateModel.editingFlags.officeAddresses = editing
    },
    setEditingPeopleAndRoles (editing: boolean) {
      this.stateModel.editingFlags.peopleAndRoles = editing
    },
    setEditingShareStructure (editing: boolean) {
      this.stateModel.editingFlags.shareStructure = editing
    },
    setEditingRules (editing: boolean) {
      this.stateModel.editingFlags.rules = editing
    },
    setEditingMemorandum (editing: boolean) {
      this.stateModel.editingFlags.memorandum = editing
    },
    setEditingSpecialResolution (editing: boolean) {
      this.stateModel.editingFlags.specialResolution = editing
    },
    setSummaryMode (summaryMode: boolean) {
      this.stateModel.summaryMode = summaryMode
    },
    setFilingType (filingType: FilingTypes) {
      this.stateModel.tombstone.filingType = filingType
    },
    setProvisionsRemoved (provisionsRemoved: boolean) {
      this.stateModel.newAlteration.provisionsRemoved = provisionsRemoved
    },
    setNewResolutionDates (resolutionDates: string[]) {
      this.stateModel.shareStructureStep.resolutionDates = resolutionDates
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setFileNumber (fileNumber: string) {
      this.stateModel.newAlteration.courtOrder.fileNumber = fileNumber
    },
    setHasPlanOfArrangement (hasPoa: boolean) {
      this.stateModel.newAlteration.courtOrder.hasPlanOfArrangement = hasPoa
    },
    setAppValidate (validate: boolean) {
      this.stateModel.validationFlags.appValidate = validate
    },
    setComponentValidate (validate: boolean) {
      this.stateModel.validationFlags.componentValidate = validate
    },
    setValidCourtOrder (isValid: boolean) {
      this.stateModel.validationFlags.flagsReviewCertify.isValidCourtOrder = isValid
    },
    setCurrentFees (fees: FeesIF[]) {
      this.stateModel.currentFees = fees
    },
    setFeePrices (feePrices: FeesIF[]) {
      this.stateModel.feePrices = feePrices
    },
    setValidComponent (kv: ActionKvIF) {
      this.stateModel.validationFlags.flagsCompanyInfo[kv.key] = kv.value
    },
    setNaics (naics: NaicsIF) {
      this.stateModel.businessInformation.naicsCode = naics.naicsCode
      this.stateModel.businessInformation.naicsDescription = naics.naicsDescription
      if (!this.stateModel.tombstone.ignoreChanges) this.stateModel.tombstone.haveUnsavedChanges = true
    },
    setSpecialResolution (specialResolution: SpecialResolutionIF) {
      this.stateModel.specialResolution = specialResolution
    },
    setSpecialResolutionConfirmStateValidity (validity: boolean) {
      this.stateModel.validationFlags.flagsReviewCertify.isValidSpecialResolutionConfirm = validity
    },
    setRestorationType (type: RestorationTypes) {
      this.stateModel.restoration.type = type
    },
    setRestorationExpiryDate (expiry: string) {
      this.stateModel.restoration.expiry = expiry
    },
    setRestorationApprovalType (approvalType: ApprovalTypes) {
      this.stateModel.restoration.approvalType = approvalType
    },
    setStateFilingRestoration (): Promise<any> {
      return new Promise((resolve, reject) => {
        LegalServices.fetchFiling(this.getStateFilingUrl)
          .then((response) => {
            const stateFilingRestoration = response.restoration
            // commit data to store
            this.stateModel.stateFilingRestoration = stateFilingRestoration
            // return the state filing restoration object
            resolve(stateFilingRestoration)
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log('setStateFilingRestoration() error =', error)
            reject(error)
          })
      })
    },
    setRestorationCourtOrder (courtOrder: CourtOrderIF) {
      this.stateModel.restoration.courtOrder = courtOrder
    },
    setApprovalTypeValid (valid: boolean) {
      this.stateModel.validationFlags.flagsCompanyInfo.isValidApprovalType = valid
    },
    setExpiryValid (valid: boolean) {
      this.stateModel.validationFlags.flagsCompanyInfo.isValidExtensionTime = valid
    },
    setRestorationRelationships (relationships: RelationshipTypes[]) {
      this.stateModel.restoration.relationships = relationships
    },
    setSpecialResolutionValid (valid: boolean) {
      this.stateModel.validationFlags.flagsCompanyInfo.isValidSpecialResolution = valid
    },
    setSpecialResolutionSignatureValid (valid: boolean) {
      this.stateModel.validationFlags.flagsCompanyInfo.isValidSpecialResolutionSignature = valid
    },
    setSpecialResolutionRulesValid (valid: boolean) {
      this.stateModel.validationFlags.flagsCompanyInfo.isValidRules = valid
    },
    setSpecialResolutionMemorandumValid (valid: boolean) {
      this.stateModel.validationFlags.flagsCompanyInfo.isValidMemorandum = valid
    },
    setSpecialResolutionRules (rule: RulesMemorandumIF) {
      this.stateModel.rules = rule
    },
    setSpecialResolutionMemorandum (memorandum: RulesMemorandumIF) {
      this.stateModel.memorandum = memorandum
    }
  }
})
