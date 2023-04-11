import { Component } from 'vue-property-decorator'
import { Action, Getter, Mutation } from 'vuex-class'
import { cloneDeep } from 'lodash'
import { DateMixin } from '@/mixins/'
import DateUtilities from '@/services/date-utilities'
import { ActionBindingIF, AddressesIF, AlterationFilingIF, CertifyIF, CorrectionFilingIF,
  EffectiveDateTimeIF, EntitySnapshotIF, ChgRegistrationFilingIF, ConversionFilingIF,
  NameRequestIF, NameTranslationIF, OrgPersonIF, RestorationFilingIF, RestorationStateIF,
  SpecialResolutionFilingIF, StateFilingRestorationIF } from '@/interfaces/'
import { CompletingPartyIF, ContactPointIF, NaicsIF, ShareClassIF, SpecialResolutionIF,
  StaffPaymentIF } from '@bcrs-shared-components/interfaces/'
import { ActionTypes, CoopTypes, CorrectionErrorTypes, EffectOfOrders, FilingTypes, PartyTypes,
  RoleTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { RestorationTypes, StaffPaymentOptions } from '@bcrs-shared-components/enums/'
import { FilingTypeToName } from '@/utils'

/**
 * Mixin that provides the integration with the Legal API.
 */
@Component({})
export default class FilingTemplateMixin extends DateMixin {
  // Global getters
  @Getter getEntityType!: CorpTypeCd
  @Getter getNameRequestNumber!: string
  @Getter getNameRequestLegalName!: string
  @Getter getBusinessId!: string
  @Getter getCurrentDate!: string
  @Getter getCorrectedFilingDate!: string
  @Getter getCorrectedFilingId!: number
  @Getter getCorrectedFilingType!: FilingTypes
  @Getter getCorrectionErrorType!: CorrectionErrorTypes
  @Getter getCorrectionStartDate!: string
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getDocumentOptionalEmail: string
  @Getter hasBusinessNameChanged!: boolean
  @Getter hasBusinessTypeChanged!: boolean
  @Getter hasNaicsChanged!: boolean
  @Getter haveNameTranslationsChanged!: boolean
  @Getter hasShareStructureChanged!: boolean
  @Getter getOrgPeople!: OrgPersonIF[]
  @Getter getShareClasses!: ShareClassIF[]
  @Getter getFolioNumber!: string
  @Getter getTransactionalFolioNumber!: string
  @Getter getStaffPayment!: StaffPaymentIF
  @Getter getDetailComment!: string
  @Getter getCurrentNaics!: NaicsIF
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getNameRequest!: NameRequestIF
  @Getter getCertifyState!: CertifyIF
  @Getter getOfficeAddresses!: AddressesIF
  @Getter getBusinessContact!: ContactPointIF
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter getNewResolutionDates!: string[]
  @Getter areProvisionsRemoved!: boolean
  @Getter getFileNumber!: string
  @Getter getHasPlanOfArrangement!: boolean
  @Getter haveOfficeAddressesChanged!: boolean
  @Getter getCompletingParty!: CompletingPartyIF
  @Getter isBenBcCccUlcCorrectionFiling!: boolean
  @Getter isFirmCorrectionFiling!: boolean
  @Getter isClientErrorCorrection!: boolean
  @Getter getAssociationType!: CoopTypes
  @Getter hasAssociationTypeChanged!: boolean
  @Getter getSpecialResolution!: SpecialResolutionIF
  @Getter hasBusinessStartDateChanged!: boolean
  @Getter getRestoration!: RestorationStateIF
  @Getter getStateFilingRestoration!: StateFilingRestorationIF

  // Global actions
  @Action setBusinessContact!: ActionBindingIF
  @Action setBusinessInformation!: ActionBindingIF
  @Action setCorrectionInformation!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setNaics!: ActionBindingIF
  @Action setNameTranslations!: ActionBindingIF
  @Action setNameRequest!: ActionBindingIF
  @Action setPeopleAndRoles!: ActionBindingIF
  @Action setCertifyState!: ActionBindingIF
  @Action setShareClasses!: ActionBindingIF
  @Action setEffectiveDateTimeString!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setTransactionalFolioNumber!: ActionBindingIF
  @Action setStaffPayment!: ActionBindingIF
  @Action setDetailComment!: ActionBindingIF
  @Action setEntitySnapshot!: ActionBindingIF
  @Action setDocumentOptionalEmail!: ActionBindingIF
  @Action setProvisionsRemoved!: ActionBindingIF
  @Action setNewResolutionDates!: ActionBindingIF
  @Action setFileNumber!: ActionBindingIF
  @Action setHasPlanOfArrangement!: ActionBindingIF
  @Action setSpecialResolution!: ActionBindingIF
  @Action setCorrectionStartDate!: ActionBindingIF

  @Mutation mutateRestorationApprovalType!: ActionBindingIF
  @Mutation mutateRestorationCourtOrder!: ActionBindingIF
  @Mutation mutateRestorationExpiry!: ActionBindingIF
  @Mutation mutateRestorationType!: ActionBindingIF

  /** The default (hard-coded first line) correction detail comment. */
  public get defaultCorrectionDetailComment (): string {
    const correctedFilingName = FilingTypeToName(this.getCorrectedFilingType)
    return `Correction for ${correctedFilingName} filed on ${this.correctedFilingDate}`
  }

  //
  // Filing builders (for saving a filing)
  //

  /**
   * Builds an IA/change/registration correction filing from store data.
   * @param isDraft whether this is a draft
   * @returns the correction filing body
   */
  buildCorrectionFiling (isDraft: boolean): CorrectionFilingIF {
    // build correction filing (common data)
    let filing: CorrectionFilingIF = {
      header: {
        name: FilingTypes.CORRECTION,
        certifiedBy: this.getCertifyState.certifiedBy || '',
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: this.getFolioNumber // folio number, unless overridden below
      },
      business: {
        foundingDate: this.getEntitySnapshot.businessInfo.foundingDate,
        identifier: this.getEntitySnapshot.businessInfo.identifier,
        legalName: this.getEntitySnapshot.businessInfo.legalName,
        legalType: this.getEntitySnapshot.businessInfo.legalType
      },
      correction: {
        legalType: this.getEntityType,
        business: {
          identifier: this.getBusinessId
        },
        correctedFilingId: this.getCorrectedFilingId,
        correctedFilingType: this.getCorrectedFilingType,
        correctedFilingDate: this.correctedFilingDate,
        comment: `${this.defaultCorrectionDetailComment}\n${this.getDetailComment}`,
        contactPoint: this.getContactPoint,
        nameRequest: this.getNameRequest,
        offices: this.getOfficeAddresses,
        parties: null, // applied below
        type: this.getCorrectionErrorType
      }
    }

    // apply parties to filing
    {
      // make a copy so we don't change original array
      let parties = cloneDeep(this.getOrgPeople)

      // add completing party (client error corrections only)
      if (this.isClientErrorCorrection) {
        parties = this.addCompletingParty(parties)
      }

      // prepare parties
      parties = isDraft ? parties : this.prepareParties(parties)

      // fix schema issues
      parties = this.fixPartySchemaIssues(parties)

      filing.correction.parties = parties
    }

    // add in data specific to BEN/BC/CCC/ULC corrections
    if (this.isBenBcCccUlcCorrectionFiling) {
      filing.correction.nameTranslations = isDraft ? this.getNameTranslations : this.prepareNameTranslations()
      filing.correction.shareStructure = {
        shareClasses: isDraft ? this.getShareClasses : this.prepareShareClasses(),
        resolutionDates: this.getNewResolutionDates
      }
    }

    // add in data specific to firm corrections
    if (this.isFirmCorrectionFiling) {
      filing.correction.business.naics = {
        naicsCode: this.getCurrentNaics.naicsCode || undefined, // don't include if empty
        naicsDescription: this.getCurrentNaics.naicsDescription
      }
      if (this.hasBusinessStartDateChanged) {
        filing.correction.startDate = this.getCorrectionStartDate
      }
    }

    // build Staff Payment into the filing
    // may override folio number
    filing = this.buildStaffPayment(filing)

    return filing
  }

  /**
   * Builds an alteration filing from store data.
   * @param isDraft whether this is a draft
   * @returns the alteration filing body
   */
  buildAlterationFiling (isDraft: boolean): AlterationFilingIF {
    // Build alteration filing
    let filing: AlterationFilingIF = {
      header: {
        name: FilingTypes.ALTERATION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: this.getFolioNumber // business folio number, unless overridden below
      },
      business: {
        foundingDate: this.getEntitySnapshot.businessInfo.foundingDate,
        identifier: this.getEntitySnapshot.businessInfo.identifier,
        legalName: this.getEntitySnapshot.businessInfo.legalName,
        legalType: this.getEntitySnapshot.businessInfo.legalType
      },
      alteration: {
        business: {
          identifier: this.getBusinessId,
          legalType: this.getEntityType
        },
        provisionsRemoved: this.areProvisionsRemoved,
        contactPoint: this.getContactPoint
      }
    }

    // Apply NR / business name / business type change to filing
    if (this.getNameRequestNumber || this.hasBusinessNameChanged || this.hasBusinessTypeChanged) {
      filing.alteration.nameRequest = this.getNameRequest
    }

    // Apply name translation changes to filing
    if (this.haveNameTranslationsChanged) {
      const nameTranslations = isDraft ? this.getNameTranslations : this.prepareNameTranslations()
      filing.alteration.nameTranslations = nameTranslations
    }

    // Apply share structure changes to filing or apply new resolution dates
    if (this.hasShareStructureChanged) {
      const shareClasses = isDraft ? this.getShareClasses : this.prepareShareClasses()
      filing.alteration.shareStructure = {
        resolutionDates: this.getNewResolutionDates,
        shareClasses
      }
    } else if (this.getNewResolutionDates) {
      filing.alteration.shareStructure = {
        resolutionDates: this.getNewResolutionDates
      }
    }

    // Apply Court Order ONLY when it is required and applied
    if (this.getHasPlanOfArrangement || this.getFileNumber) {
      filing.alteration.courtOrder = {
        fileNumber: this.getFileNumber,
        effectOfOrder: this.getHasPlanOfArrangement ? EffectOfOrders.PLAN_OF_ARRANGEMENT : null,
        hasPlanOfArrangement: this.getHasPlanOfArrangement
      }
    }

    // If FED then set header fields
    if (this.getEffectiveDateTime.isFutureEffective) {
      filing.header.isFutureEffective = true
      const effectiveDate = new Date(this.getEffectiveDateTime.dateTimeString) // ISO format
      filing.header.effectiveDate = this.dateToApi(effectiveDate) // in UTC
    }

    // Set Document Optional Email if there is one
    if (this.getDocumentOptionalEmail) {
      filing.header.documentOptionalEmail = this.getDocumentOptionalEmail
    }

    // Build Staff Payment into the filing
    // may override folio number
    filing = this.buildStaffPayment(filing)

    // Build Transactional Folio Number into the filing
    // will override folio number
    filing = this.buildFolioNumber(filing)

    return filing
  }

  /**
   * Builds a restoration filing from store data.
   * @param isDraft whether this is a draft
   * @returns the restoration filing body
   */
  buildRestorationFiling (isDraft: boolean): RestorationFilingIF {
    // Build restoration filing
    let filing: RestorationFilingIF = {
      header: {
        name: FilingTypes.RESTORATION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: this.getFolioNumber // business folio number, unless overridden below
      },
      business: {
        foundingDate: this.getEntitySnapshot.businessInfo.foundingDate,
        identifier: this.getEntitySnapshot.businessInfo.identifier,
        legalName: this.getEntitySnapshot.businessInfo.legalName,
        legalType: this.getEntitySnapshot.businessInfo.legalType
      },
      restoration: {
        approvalType: this.getStateFilingRestoration?.approvalType,
        type: this.getRestoration.type,
        business: {
          identifier: this.getBusinessId,
          legalType: this.getEntityType
        },
        parties: this.getOrgPeople,
        offices: this.getOfficeAddresses,
        contactPoint: this.getContactPoint,
        relationships: this.getRestoration.relationships
      }
    }

    // Set expiry date property if it's not null
    if (this.getRestoration.expiry) {
      filing.restoration.expiry = this.getRestoration.expiry
    }

    // Apply NR / business name / business type change to filing
    if (this.getNameRequestNumber || this.hasBusinessNameChanged || this.hasBusinessTypeChanged) {
      filing.restoration.nameRequest = this.getNameRequest
    }

    // Apply name translation changes to filing
    if (this.haveNameTranslationsChanged) {
      const nameTranslations = isDraft ? this.getNameTranslations : this.prepareNameTranslations()
      filing.restoration.nameTranslations = nameTranslations
    }

    // Apply Court Order ONLY when it is required and applied
    if (this.getRestoration.courtOrder?.fileNumber) {
      filing.restoration.courtOrder = this.getRestoration.courtOrder
    }

    // Set Document Optional Email if there is one
    if (this.getDocumentOptionalEmail) {
      filing.header.documentOptionalEmail = this.getDocumentOptionalEmail
    }

    // Build Staff Payment into the filing
    // may override folio number
    filing = this.buildStaffPayment(filing)

    // Build Transactional Folio Number into the filing
    // will override folio number
    filing = this.buildFolioNumber(filing)

    return filing
  }

  /**
   * Builds an special resolution filing from store data.
   * @param isDraft whether this is a draft
   * @returns the resolution filing body
   */
  buildSpecialResolutionFiling (isDraft: boolean): SpecialResolutionFilingIF {
    // FUTURE: add in as needed - see buildAlterationFiling()
    // const parties = isDraft ? this.getOrgPeople : this.prepareParties()
    // const shareClasses = isDraft ? this.getShareClasses : this.prepareShareClasses()
    // const nameTranslations = isDraft ? this.getNameTranslations : this.prepareNameTranslations()

    // Build special resolution filing
    let filing: SpecialResolutionFilingIF = {
      header: {
        name: FilingTypes.SPECIAL_RESOLUTION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: this.getFolioNumber // business folio number, unless overridden below
      },
      business: {
        foundingDate: this.getEntitySnapshot.businessInfo.foundingDate,
        identifier: this.getEntitySnapshot.businessInfo.identifier,
        legalName: this.getEntitySnapshot.businessInfo.legalName,
        legalType: this.getEntitySnapshot.businessInfo.legalType
      },
      specialResolution: {
        ...this.getSpecialResolution
      }
    }

    /* Only add alteration if the association type has changed,
     * rules and memorandum only show up if the association type changes. */
    if (this.hasAssociationTypeChanged) {
      filing.alteration = {
        business: {
          identifier: this.getBusinessId,
          legalType: this.getEntityType
        },
        contactPoint: this.getContactPoint,
        cooperativeAssociationType: this.getAssociationType,
        rulesFileKey: 'test',
        rulesFileName: 'testUrl',
        memorandumFileKey: 'test',
        memorandumFileName: 'test'
      }
    }

    // Apply NR / business name / business type change to filing
    if (this.getNameRequestNumber || this.hasBusinessNameChanged || this.hasBusinessTypeChanged) {
      filing.changeOfName = { nameRequest: this.getNameRequest }
    }

    if (this.getDocumentOptionalEmail) {
      filing.header.documentOptionalEmail = this.getDocumentOptionalEmail
    }

    // Build Staff Payment into the filing
    // may override folio number
    filing = this.buildStaffPayment(filing)

    // Build Transactional Folio Number into the filing
    // will override folio number
    filing = this.buildFolioNumber(filing)

    return filing
  }

  /**
   * Builds a change of registration filing from store data.
   * @param isDraft whether this is a draft
   * @returns the change filing body
   */
  buildChangeRegFiling (isDraft: boolean): ChgRegistrationFilingIF {
    // Build change filing
    let filing: ChgRegistrationFilingIF = {
      header: {
        name: FilingTypes.CHANGE_OF_REGISTRATION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: this.getFolioNumber // business folio number, unless overridden below
      },
      business: {
        foundingDate: this.getEntitySnapshot.businessInfo.foundingDate,
        identifier: this.getEntitySnapshot.businessInfo.identifier,
        legalName: this.getEntitySnapshot.businessInfo.legalName,
        legalType: this.getEntitySnapshot.businessInfo.legalType
      },
      changeOfRegistration: {
        business: {
          identifier: this.getBusinessId
        },
        contactPoint: this.getContactPoint,
        parties: null // applied below
      }
    }

    // Apply NAICS change to filing
    if (this.hasNaicsChanged) {
      filing.changeOfRegistration.business.naics = {
        naicsCode: this.getCurrentNaics.naicsCode || undefined, // don't include if empty
        naicsDescription: this.getCurrentNaics.naicsDescription
      }
    }

    // Apply business name change to filing
    if (this.hasBusinessNameChanged) {
      filing.changeOfRegistration.nameRequest = this.getNameRequest
    }

    // Apply business address changes to filing
    if (this.haveOfficeAddressesChanged) {
      filing.changeOfRegistration.offices = {
        businessOffice: {
          mailingAddress: this.getOfficeAddresses.businessOffice.mailingAddress,
          deliveryAddress: this.getOfficeAddresses.businessOffice.deliveryAddress
        }
      }
    }

    // Apply parties to filing
    {
      // make a copy so we don't change original array
      let parties = cloneDeep(this.getOrgPeople)

      // add completing party
      parties = this.addCompletingParty(parties)

      // prepare parties
      parties = isDraft ? parties : this.prepareParties(parties)

      // fix schema issues
      parties = this.fixPartySchemaIssues(parties)

      filing.changeOfRegistration.parties = parties
    }

    // Apply Court Order ONLY when it is required and applied
    if (this.getHasPlanOfArrangement || this.getFileNumber) {
      filing.changeOfRegistration.courtOrder = {
        fileNumber: this.getFileNumber,
        effectOfOrder: this.getHasPlanOfArrangement ? EffectOfOrders.PLAN_OF_ARRANGEMENT : null,
        hasPlanOfArrangement: this.getHasPlanOfArrangement
      }
    }

    // Set Document Optional Email if there is one
    if (this.getDocumentOptionalEmail) {
      filing.header.documentOptionalEmail = this.getDocumentOptionalEmail
    }

    // Apply Business Start Date to filing
    if (this.hasBusinessStartDateChanged) {
      filing.changeOfRegistration.startDate = this.getCorrectionStartDate
    }

    // Build Staff Payment into the filing
    // may override folio number
    filing = this.buildStaffPayment(filing)

    // Build Transactional Folio Number into the filing
    // will override folio number
    filing = this.buildFolioNumber(filing)

    return filing
  }

  /**
   * Builds a conversion filing from store data.
   * @param isDraft whether this is a draft
   * @returns the conversion filing body
   */
  buildConversionFiling (isDraft: boolean): ConversionFilingIF {
    // Build conversion filing
    let filing: ConversionFilingIF = {
      header: {
        name: FilingTypes.CONVERSION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: '' // not applicable to SP/GP
      },
      business: {
        foundingDate: this.getEntitySnapshot.businessInfo.foundingDate,
        identifier: this.getEntitySnapshot.businessInfo.identifier,
        legalName: this.getEntitySnapshot.businessInfo.legalName,
        legalType: this.getEntitySnapshot.businessInfo.legalType
      },
      conversion: {
        business: {
          identifier: this.getBusinessId
        },
        offices: {
          businessOffice: {
            mailingAddress: this.getOfficeAddresses.businessOffice?.mailingAddress,
            deliveryAddress: this.getOfficeAddresses.businessOffice?.deliveryAddress
          }
        },
        parties: null // applied below
      }
    }

    // Apply NAICS change to filing
    if (this.hasNaicsChanged) {
      filing.conversion.business.naics = {
        naicsCode: this.getCurrentNaics.naicsCode || undefined, // don't include if empty
        naicsDescription: this.getCurrentNaics.naicsDescription
      }
    }

    // Apply business name change to filing
    if (this.hasBusinessNameChanged) {
      filing.conversion.nameRequest = this.getNameRequest
    }

    // Apply parties to filing
    {
      // make a copy so we don't change original array
      let parties = cloneDeep(this.getOrgPeople)

      // add completing party
      parties = this.addCompletingParty(parties)

      // prepare parties
      parties = isDraft ? parties : this.prepareParties(parties)

      // fix schema issues
      parties = this.fixPartySchemaIssues(parties)

      filing.conversion.parties = parties
    }

    // Apply Business Start Date to filing
    if (this.hasBusinessStartDateChanged) {
      filing.conversion.startDate = this.getCorrectionStartDate
    }

    // Build Staff Payment into the filing
    filing = this.buildStaffPayment(filing)

    return filing
  }

  //
  // Filing parsers (for loading a draft filing)
  //

  /**
   * Parses a draft IA/change/registration Correction filing into the store.
   * @param filing the correction filing
   * @param entitySnapshot the latest entity snapshot
   */
  parseCorrectionFiling (filing: CorrectionFilingIF, entitySnapshot: EntitySnapshotIF = null): void {
    // store Entity Snapshot
    this.setEntitySnapshot(entitySnapshot)

    // safety check (should never happen)
    // this is a good fallback as it shows a more complete filing than STAFF
    // if this is wrong then staff can delete and recreate this filing
    if (!filing.correction.type) filing.correction.type = CorrectionErrorTypes.CLIENT

    // ensure Start Date isn't undefined, otherwise its getter will not be reactive
    if (!filing.correction.startDate) {
      filing.correction.startDate = null
    }

    // store Correction Information
    this.setCorrectionInformation(cloneDeep(filing.correction))

    // store Business Information for BEN/BC/CCC/ULC corrections
    if (this.isBenBcCccUlcCorrectionFiling) {
      this.setBusinessInformation({
        ...entitySnapshot.businessInfo,
        ...filing.business,
        ...filing.correction.business
      })
    }

    // store Business Information for firm corrections
    if (this.isFirmCorrectionFiling) {
      this.setBusinessInformation({
        ...entitySnapshot.businessInfo,
        ...filing.business,
        ...filing.correction.business
      })
    }

    // store NAICS for firm corrections
    // NB: must come after business information
    if (this.isFirmCorrectionFiling) {
      if (filing.correction.business?.naics) {
        this.setNaics({ ...filing.correction.business.naics })
      } else {
        this.setNaics({
          naicsCode: entitySnapshot.businessInfo.naicsCode,
          naicsDescription: entitySnapshot.businessInfo.naicsDescription
        })
      }
    }

    // store Name Request
    this.setNameRequest(cloneDeep(
      filing.correction.nameRequest ||
      {
        legalType: entitySnapshot.businessInfo.legalType,
        legalName: entitySnapshot.businessInfo.legalName,
        nrNumber: entitySnapshot.businessInfo.nrNumber
      }
    ))

    // store Name Translations (BEN/BC/CCC?ULC corrections only)
    if (this.isBenBcCccUlcCorrectionFiling) {
      this.setNameTranslations(cloneDeep(
        this.mapNameTranslations(filing.correction.nameTranslations) ||
        this.mapNameTranslations(entitySnapshot.nameTranslations) ||
        []
      ))
    }

    // store Office Addresses
    this.setOfficeAddresses(cloneDeep(
      filing.correction.offices ||
      entitySnapshot.addresses
    ))

    // store current Business Contact
    this.setBusinessContact({ ...entitySnapshot.authInfo.contact })

    // store People And Roles
    let orgPersons = filing.correction.parties || entitySnapshot.orgPersons
    // exclude Completing Party
    // (it is managed separately and added to the filing in buildCorrectionFiling())
    orgPersons = orgPersons.filter(op => !(op?.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)))
    this.setPeopleAndRoles(cloneDeep(orgPersons))

    // store Share Classes and Resolution Dates (BEN/BC/CCC/ULC corrections only)
    if (this.isBenBcCccUlcCorrectionFiling) {
      this.setShareClasses(cloneDeep(
        filing.correction.shareStructure?.shareClasses ||
        entitySnapshot.shareStructure.shareClasses
      ))
      this.setNewResolutionDates(cloneDeep(
        filing.correction.shareStructure?.resolutionDates || []
      ))
    }

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Detail Comment
    if (filing.correction.comment) {
      // NB: remove the first line (default comment)
      const comment = filing.correction.comment
      const detailComment = comment.split('\n').slice(1).join('\n')
      this.setDetailComment(detailComment)
    }

    // store Folio Number
    // FUTURE: should we store correction.folioNumber instead?
    this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')

    // store Effective Date
    const effectiveDate = this.apiToIso(filing.header.effectiveDate)
    this.setEffectiveDateTimeString(effectiveDate)
    this.setIsFutureEffective(filing.header.isFutureEffective)

    // store Staff Payment
    this.storeStaffPayment(filing)
  }

  /**
   * Parses a draft Alteration filing into the store.
   * @param filing the alteration filing
   * @param entitySnapshot the latest entity snapshot
   */
  parseAlterationFiling (filing: AlterationFilingIF, entitySnapshot: EntitySnapshotIF): void {
    // store Entity Snapshot
    this.setEntitySnapshot(entitySnapshot)

    // store Entity Type
    this.setEntityType(filing.alteration.business?.legalType || entitySnapshot.businessInfo.legalType)

    // store Business Information
    this.setBusinessInformation({
      ...entitySnapshot.businessInfo,
      ...filing.business,
      ...filing.alteration.business
    })

    // store Name Request data
    this.setNameRequest(cloneDeep(
      filing.alteration.nameRequest ||
      {
        legalType: entitySnapshot.businessInfo.legalType,
        legalName: entitySnapshot.businessInfo.legalName,
        nrNumber: entitySnapshot.businessInfo.nrNumber
      }
    ))

    // store Name Translations
    this.setNameTranslations(cloneDeep(
      this.mapNameTranslations(filing.alteration.nameTranslations) ||
      this.mapNameTranslations(entitySnapshot.nameTranslations) ||
      []
    ))

    // store Provisions Removed
    if (filing.alteration.provisionsRemoved) this.setProvisionsRemoved(true)

    // store Office Addresses **from snapshot** (because we don't change office addresses in an alteration)
    this.setOfficeAddresses(cloneDeep(entitySnapshot.addresses))

    // store People And Roles **from snapshot** (because we don't change people and roles in an alteration)
    this.setPeopleAndRoles(cloneDeep(entitySnapshot.orgPersons))

    // store current Business Contact
    this.setBusinessContact({ ...entitySnapshot.authInfo.contact })

    // store Share Classes and Resolution Dates
    this.setShareClasses(cloneDeep(
      filing.alteration.shareStructure?.shareClasses ||
      entitySnapshot.shareStructure?.shareClasses
    ))
    this.setNewResolutionDates(cloneDeep(
      filing.alteration.shareStructure?.resolutionDates || []
    ))

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Folio Number
    // FUTURE: should we store correction.folioNumber instead?
    this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')

    // if Transactional Folio Number was saved then store it
    if (filing.header.isTransactionalFolioNumber) {
      this.setTransactionalFolioNumber(filing.header.folioNumber)
    }

    // store Document Optional Email
    this.setDocumentOptionalEmail(filing.header.documentOptionalEmail || '')

    // store Effective Date
    const effectiveDate = this.apiToIso(filing.header.effectiveDate)
    this.setEffectiveDateTimeString(effectiveDate)
    this.setIsFutureEffective(filing.header.isFutureEffective)

    // store File Number and POA
    this.setFileNumber(filing.alteration.courtOrder?.fileNumber)
    this.setHasPlanOfArrangement(filing.alteration.courtOrder?.hasPlanOfArrangement)

    // store Staff Payment
    this.storeStaffPayment(filing)
  }

  /**
   * Parses a draft Restoration filing into the store.
   * @param filing the restoration filing
   * @param entitySnapshot the latest entity snapshot
   */
  parseRestorationFiling (filing: RestorationFilingIF): void {
    // Get the Entity Snapshot from store
    const entitySnapshot = this.getEntitySnapshot

    // store Entity Type
    this.setEntityType(filing.restoration.business?.legalType || entitySnapshot.businessInfo.legalType)

    // store Business Information
    this.setBusinessInformation({
      ...entitySnapshot.businessInfo,
      ...filing.business,
      ...filing.restoration.business
    })

    // restore Restoration data
    this.mutateRestorationApprovalType(this.getStateFilingRestoration?.approvalType)
    if (filing.restoration.courtOrder) {
      this.mutateRestorationCourtOrder(filing.restoration.courtOrder)
    }
    this.mutateRestorationType(filing.restoration.type)
    if (filing.restoration.expiry) {
      this.mutateRestorationExpiry(filing.restoration.expiry)
    } else if (filing.restoration.type === RestorationTypes.LTD_EXTEND) {
      // Reset radio button to 2 years
      this.mutateRestorationExpiry(DateUtilities.addMonthsToDate(24, this.getStateFilingRestoration?.expiry))
    }

    // store Name Request data
    this.setNameRequest(cloneDeep(
      filing.restoration.nameRequest ||
      {
        legalType: entitySnapshot.businessInfo.legalType,
        legalName: entitySnapshot.businessInfo.legalName,
        nrNumber: entitySnapshot.businessInfo.nrNumber
      }
    ))

    // store Name Translations
    this.setNameTranslations(cloneDeep(
      this.mapNameTranslations(filing.restoration.nameTranslations) ||
      this.mapNameTranslations(entitySnapshot.nameTranslations) ||
      []
    ))

    // store Office Addresses
    this.setOfficeAddresses(cloneDeep(
      filing.restoration.offices ||
      entitySnapshot.addresses
    ))

    // store People And Roles
    this.setPeopleAndRoles(cloneDeep(
      filing.restoration.parties ||
      entitySnapshot.orgPersons
    ))

    // store current Business Contact
    this.setBusinessContact({ ...entitySnapshot.authInfo.contact })

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Folio Number
    // FUTURE: should we store correction.folioNumber instead?
    this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')

    // if Transactional Folio Number was saved then store it
    if (filing.header.isTransactionalFolioNumber) {
      this.setTransactionalFolioNumber(filing.header.folioNumber)
    }

    // store Document Optional Email
    this.setDocumentOptionalEmail(filing.header.documentOptionalEmail || '')

    // store File Number and POA
    this.setFileNumber(filing.restoration.courtOrder?.fileNumber)
    this.setHasPlanOfArrangement(filing.restoration.courtOrder?.hasPlanOfArrangement)

    // store Staff Payment
    this.storeStaffPayment(filing)
  }

  /**
   * Parses a draft special resolution filing into the store.
   * @param filing the special resolution filing
   * @param entitySnapshot the latest entity snapshot
   */
  parseSpecialResolutionFiling (filing: SpecialResolutionFilingIF, entitySnapshot: EntitySnapshotIF): void {
    // store Entity Snapshot
    this.setEntitySnapshot(entitySnapshot)

    // NB: filing.alteration object may not be present

    // store Entity Type
    this.setEntityType(filing.alteration?.business?.legalType || entitySnapshot.businessInfo.legalType)

    // store Business Information
    this.setBusinessInformation({
      ...entitySnapshot.businessInfo,
      ...filing.business,
      ...filing.alteration?.business,
      associationType: filing.alteration?.cooperativeAssociationType || entitySnapshot.businessInfo.associationType
    })

    // store Name Request data
    this.setNameRequest(cloneDeep(
      filing.changeOfName?.nameRequest ||
      {
        legalType: entitySnapshot.businessInfo.legalType,
        legalName: entitySnapshot.businessInfo.legalName,
        nrNumber: entitySnapshot.businessInfo.nrNumber
      }
    ))

    // store Special Resolution
    this.setSpecialResolution(cloneDeep(filing.specialResolution))

    // store Office Addresses **from snapshot** (because we don't change office addresses in an special resolution)
    this.setOfficeAddresses(cloneDeep(entitySnapshot.addresses))

    // store People And Roles **from snapshot** (because we don't change people and roles in an special resolution)
    this.setPeopleAndRoles(cloneDeep(entitySnapshot.orgPersons))

    // store current Business Contact
    this.setBusinessContact({ ...entitySnapshot.authInfo.contact })

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Folio Number
    // FUTURE: should we store correction.folioNumber instead?
    this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')

    // if Transactional Folio Number was saved then store it
    if (filing.header.isTransactionalFolioNumber) {
      this.setTransactionalFolioNumber(filing.header.folioNumber)
    }

    // store Document Optional Email
    this.setDocumentOptionalEmail(filing.header.documentOptionalEmail || '')

    // store Staff Payment
    this.storeStaffPayment(filing)
  }

  /**
   * Parses a draft Change of Registration filing into the store.
   * @param filing the change filing
   * @param entitySnapshot the latest entity snapshot
   */
  parseChangeRegFiling (filing: ChgRegistrationFilingIF, entitySnapshot: EntitySnapshotIF): void {
    // store Entity Snapshot
    this.setEntitySnapshot(entitySnapshot)

    // store Entity Type
    this.setEntityType(filing.business?.legalType || entitySnapshot.businessInfo.legalType)

    // store Business Information
    this.setBusinessInformation({
      ...entitySnapshot.businessInfo,
      ...filing.business
    })

    // store NAICS
    // NB: must come after business information
    if (filing.changeOfRegistration.business.naics) {
      this.setNaics({ ...filing.changeOfRegistration.business.naics })
    }

    // store Name Request data
    this.setNameRequest(cloneDeep(
      filing.changeOfRegistration.nameRequest ||
      {
        legalType: entitySnapshot.businessInfo.legalType,
        legalName: entitySnapshot.businessInfo.legalName,
        nrNumber: entitySnapshot.businessInfo.nrNumber
      }
    ))

    // store Office Addresses
    let addresses
    if (filing.changeOfRegistration.offices?.businessOffice) {
      addresses = { businessOffice: filing.changeOfRegistration.offices.businessOffice }
    }
    this.setOfficeAddresses(cloneDeep(
      addresses ||
      entitySnapshot.addresses
    ))

    // store People And Roles
    let orgPersons = filing.changeOfRegistration.parties || entitySnapshot.orgPersons
    // exclude Completing Party
    // (it is managed separately and added to the filing in buildChangeRegFiling())
    orgPersons = orgPersons.filter(op => !(op?.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)))
    this.setPeopleAndRoles(cloneDeep(orgPersons))

    // store current Business Contact
    this.setBusinessContact({ ...entitySnapshot.authInfo.contact })

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Folio Number
    // FUTURE: should we store correction.folioNumber instead?
    this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')

    // if Transactional Folio Number was saved then store it
    if (filing.header.isTransactionalFolioNumber) {
      this.setTransactionalFolioNumber(filing.header.folioNumber)
    }

    // store Document Optional Email
    this.setDocumentOptionalEmail(filing.header.documentOptionalEmail || '')

    // store File Number and POA
    this.setFileNumber(filing.changeOfRegistration.courtOrder?.fileNumber)
    this.setHasPlanOfArrangement(filing.changeOfRegistration.courtOrder?.hasPlanOfArrangement)

    // store Business Start Date
    this.setCorrectionStartDate(filing.changeOfRegistration.startDate || null)

    // store Staff Payment
    this.storeStaffPayment(filing)
  }

  /**
   * Parses a draft firm Conversion filing into the store.
   * @param filing the conversion filing
   * @param entitySnapshot the latest entity snapshot
   */
  parseFirmConversionFiling (filing: ConversionFilingIF, entitySnapshot: EntitySnapshotIF): void {
    // store Entity Snapshot
    // make a copy so snapshot objects are different from objects below
    this.setEntitySnapshot(entitySnapshot)

    // store Entity Type
    this.setEntityType(filing.business?.legalType || entitySnapshot.businessInfo.legalType)

    // store Business Information
    this.setBusinessInformation({
      ...entitySnapshot.businessInfo,
      ...filing.business
    })

    // store NAICS
    // NB: must come after business information
    if (filing.conversion.business.naics) {
      this.setNaics({ ...filing.conversion.business.naics })
    }

    // store Name Request data
    this.setNameRequest(cloneDeep(
      filing.conversion.nameRequest ||
      {
        legalType: entitySnapshot.businessInfo.legalType,
        legalName: entitySnapshot.businessInfo.legalName,
        nrNumber: entitySnapshot.businessInfo.nrNumber
      }
    ))

    // store Office Addresses
    let addresses = null
    if (filing.conversion.offices?.businessOffice) {
      addresses = { businessOffice: filing.conversion.offices.businessOffice }
    }
    this.setOfficeAddresses(cloneDeep(
      addresses ||
      entitySnapshot.addresses
    ))

    // store People And Roles
    let orgPersons = filing.conversion.parties || entitySnapshot.orgPersons
    // exclude Completing Party
    // (it is managed separately and added to the filing in buildConversionFiling())
    orgPersons = orgPersons.filter(op => !(op?.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)))
    this.setPeopleAndRoles(cloneDeep(orgPersons))

    // store Business Start Date
    this.setCorrectionStartDate(filing.conversion.startDate || null)

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Staff Payment
    this.storeStaffPayment(filing)
  }

  /**
   * Parses an entity snapshot into the store.
   * @param entitySnapshot the latest entity snapshot
   */
  parseEntitySnapshot (entitySnapshot = this.getEntitySnapshot): void {
    // store Entity Snapshot
    this.setEntitySnapshot(entitySnapshot)

    // store Folio Number
    this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')

    // store Entity Type
    this.setEntityType(entitySnapshot.businessInfo.legalType)

    // store Business Information
    this.setBusinessInformation({ ...entitySnapshot.businessInfo })

    // store Name Request data
    this.setNameRequest({
      legalType: entitySnapshot.businessInfo.legalType,
      legalName: entitySnapshot.businessInfo.legalName,
      nrNumber: entitySnapshot.businessInfo.nrNumber
    })

    // store People and Roles
    this.setPeopleAndRoles(cloneDeep(entitySnapshot.orgPersons))

    // store current Business Contact
    this.setBusinessContact({ ...entitySnapshot.authInfo.contact })

    // store Office Addresses
    this.setOfficeAddresses(cloneDeep(entitySnapshot.addresses))

    // handle entity-specific values
    switch (entitySnapshot.businessInfo.legalType) {
      case CorpTypeCd.BENEFIT_COMPANY:
      case CorpTypeCd.BC_COMPANY:
      case CorpTypeCd.BC_CCC:
      case CorpTypeCd.BC_ULC_COMPANY: {
        // store Name Translations
        if (entitySnapshot.nameTranslations) {
          // don't need cloneDeep because mapNameTranslations already returns new array
          this.setNameTranslations(this.mapNameTranslations(entitySnapshot.nameTranslations) || [])
        }

        // clear Provisions Removed
        this.setProvisionsRemoved(null)

        // store Share Classes and clear New Resolution Dates
        this.setShareClasses(cloneDeep(entitySnapshot.shareStructure.shareClasses))
        this.setNewResolutionDates([])

        break
      }

      case CorpTypeCd.SOLE_PROP:
      case CorpTypeCd.PARTNERSHIP: {
        // FUTURE: expand here as needed
        break
      }
    }
  }

  //
  // Local helper methods
  //

  /** The corrected filing date as YYYY-MM-DD. */
  private get correctedFilingDate (): string {
    const date = this.apiToDate(this.getCorrectedFilingDate)
    return this.dateToYyyyMmDd(date)
  }

  /** The Contact Point object. */
  private get getContactPoint (): ContactPointIF {
    return {
      email: this.getBusinessContact.email,
      phone: this.getBusinessContact.phone || '',
      extension: +this.getBusinessContact.extension || undefined // don't include if empty
    }
  }

  /**
   * Adds the completing party into the specified parties array.
   * Assumes the completing party doesn't already exist in the array.
   * @param parties the parties array
   * @returns the updated parties array
   */
  private addCompletingParty (parties: OrgPersonIF[]): OrgPersonIF[] {
    parties.push({
      officer: {
        partyType: PartyTypes.PERSON,
        firstName: this.getCompletingParty.firstName,
        middleName: this.getCompletingParty.middleName,
        lastName: this.getCompletingParty.lastName
      },
      roles: [{
        roleType: RoleTypes.COMPLETING_PARTY,
        appointmentDate: this.getCurrentDate
      }],
      mailingAddress: this.getCompletingParty.mailingAddress
    } as OrgPersonIF)

    return parties
  }

  /**
   * Fixes schema issues in the specified parties array.
   * @param parties the parties array
   * @returns the updated parties array
   */
  private fixPartySchemaIssues (parties: OrgPersonIF[]): OrgPersonIF[] {
    return parties.map(party => {
      // remove empty Officer properties -- schema doesn't accept None (null) properties
      Object.keys(party.officer).forEach(key => {
        if (!party.officer[key]) delete party.officer[key]
      })

      // remove empty Delivery Address and Mailing Address properties
      if (party.deliveryAddress) {
        if (!party.deliveryAddress.streetAddressAdditional) delete party.deliveryAddress.streetAddressAdditional
        if (!party.deliveryAddress.deliveryInstructions) delete party.deliveryAddress.deliveryInstructions
      }
      if (party.mailingAddress) {
        if (!party.mailingAddress.streetAddressAdditional) delete party.mailingAddress.streetAddressAdditional
        if (!party.mailingAddress.deliveryInstructions) delete party.mailingAddress.deliveryInstructions
      }

      // NB: at this time, do not convert party from "middleName" to "middleInitial"

      return party
    })
  }

  /**
   * Prepares parties for non-draft save.
   * @returns the updated parties array
   */
  private prepareParties (parties = this.getOrgPeople) : OrgPersonIF[] {
    // 1. filter out removed parties
    // 2. delete added parties "id" property
    // 3. delete "actions" property
    return parties
      .filter(x => !x.actions?.includes(ActionTypes.REMOVED))
      .map(x => {
        if (x.actions?.includes(ActionTypes.ADDED)) delete x.officer.id
        delete x.actions
        return x
      })
  }

  /**
   * Prepares share classes for non-draft save.
   * @returns the updated share classes array
   */
  private prepareShareClasses () : ShareClassIF[] {
    // filter out removed classes and delete "action" property
    const shareClasses = this.getShareClasses
      .filter(x => x.action?.toUpperCase() !== ActionTypes.REMOVED)
      .map((x) => {
        const { action, ...rest } = x
        rest.hasMaximumShares = !!rest.hasMaximumShares // change null -> false
        rest.hasRightsOrRestrictions = !!rest.hasRightsOrRestrictions // change null -> false
        return rest
      })

    // filter out removed series and delete "action" property
    for (const [index, share] of shareClasses.entries()) {
      shareClasses[index].series = share.series
        .filter(x => x.action?.toUpperCase() !== ActionTypes.REMOVED)
        .map((x) => {
          const { action, ...rest } = x
          rest.hasMaximumShares = !!rest.hasMaximumShares // change null -> false
          rest.hasRightsOrRestrictions = !!rest.hasRightsOrRestrictions // change null -> false
          return rest
        })
    }

    return shareClasses
  }

  /**
   * Prepares name translations for non-draft save.
   * @returns the updated name translations array
   */
  private prepareNameTranslations () : NameTranslationIF[] {
    // filter out and modify name translation to match schema
    return this.getNameTranslations?.filter(x => x.action !== ActionTypes.REMOVED).map(x => {
      const nameTranslation: any = {
        name: x.name
      }
      if (x.action !== ActionTypes.ADDED) {
        nameTranslation.id = x.id
      }
      return nameTranslation
    })
  }

  // The first time (when we initiate a correction), the `oldName` and `action` props are not
  // available in the API response, which creates the issue of not having these props in store.
  // Due to missing props, the change event was not triggering if the action value is changed
  // (at the time of Delete there is no other prop change except action). To handle this
  // scenario, this structure needs to be kept.
  private mapNameTranslations (nameTranslations: any): NameTranslationIF[] {
    return nameTranslations?.map(x => ({
      id: x.id,
      name: x.name,
      oldName: x.oldName || null,
      action: x.action || null
    }))
  }

  /**
   * Builds Transactional Folio Number data into the filing.
   * @param filing the filing
   * @returns the updated filing
   */
  private buildFolioNumber (filing: AlterationFilingIF | ChgRegistrationFilingIF | SpecialResolutionFilingIF): any {
    const fn = this.getFolioNumber
    const tfn = this.getTransactionalFolioNumber

    // if a Transactional Folio Number was entered then override the Business Folio Number
    if (tfn && tfn !== fn) {
      filing.header.folioNumber = tfn
      filing.header.isTransactionalFolioNumber = true
    }

    return filing
  }

  /**
   * Builds Staff Payment data into the filing.
   * @param filing the filing
   */
  private buildStaffPayment (
    filing: AlterationFilingIF | CorrectionFilingIF | ConversionFilingIF | ChgRegistrationFilingIF |
      RestorationFilingIF | SpecialResolutionFilingIF
  ): any {
    // Populate Staff Payment according to payment option
    switch (this.getStaffPayment.option) {
      case StaffPaymentOptions.FAS:
        filing.header.routingSlipNumber = this.getStaffPayment.routingSlipNumber
        filing.header.priority = this.getStaffPayment.isPriority
        break

      case StaffPaymentOptions.BCOL:
        filing.header.bcolAccountNumber = this.getStaffPayment.bcolAccountNumber
        filing.header.datNumber = this.getStaffPayment.datNumber
        filing.header.folioNumber = this.getStaffPayment.folioNumber // this overrides original folio number
        filing.header.priority = this.getStaffPayment.isPriority
        break

      case StaffPaymentOptions.NO_FEE:
        filing.header.waiveFees = true
        filing.header.priority = false
        break

      case StaffPaymentOptions.NONE: // should never happen
        break
    }

    return filing
  }

  /**
   * Parses Staff Payment data into store.
   * @param filing the filing to parse
   */
  private storeStaffPayment (
    filing: AlterationFilingIF | CorrectionFilingIF | ConversionFilingIF | ChgRegistrationFilingIF |
      RestorationFilingIF | SpecialResolutionFilingIF
  ): void {
    // Parse staff payment
    if (filing.header.routingSlipNumber) {
      this.setStaffPayment({
        option: StaffPaymentOptions.FAS,
        routingSlipNumber: filing.header.routingSlipNumber,
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: filing.header.priority
      })
    } else if (filing.header.bcolAccountNumber) {
      this.setStaffPayment({
        option: StaffPaymentOptions.BCOL,
        routingSlipNumber: '',
        bcolAccountNumber: filing.header.bcolAccountNumber,
        datNumber: filing.header.datNumber,
        folioNumber: filing.header.folioNumber,
        isPriority: filing.header.priority
      })
    } else if (filing.header.waiveFees) {
      this.setStaffPayment({
        option: StaffPaymentOptions.NO_FEE,
        routingSlipNumber: '',
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: false
      })
    } else {
      this.setStaffPayment({
        option: StaffPaymentOptions.NONE,
        routingSlipNumber: '',
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: false
      })
    }
  }
}
