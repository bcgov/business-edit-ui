import { Component } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { cloneDeep } from 'lodash'
import { DateMixin } from '@/mixins/'
import { AddressesIF, AlterationFilingIF, BusinessInformationIF, CertifyIF, CoopAlterationIF,
  CorrectionInformationIF, CorrectionFilingIF, CourtOrderIF, DocumentIdIF, EffectiveDateTimeIF, EmptyBusinessInfo,
  EntitySnapshotIF, ChgRegistrationFilingIF, ConversionFilingIF, NameTranslationIF, OrgPersonIF,
  RestorationFilingIF, RestorationStateIF, SpecialResolutionFilingIF, StateFilingRestorationIF, RulesMemorandumIF }
  from '@/interfaces/'
import { CompletingPartyIF, ContactPointIF, NaicsIF, NameRequestIF, ShareClassIF, SpecialResolutionIF,
  StaffPaymentIF } from '@bcrs-shared-components/interfaces/'
import { ActionTypes, CoopTypes, CorrectionErrorTypes, EffectOfOrders, FilingTypes, PartyTypes, RelationshipTypes,
  RoleTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums/'
import { FilingTypeToName } from '@/utils'
import { useStore } from '@/store/store'
import DateUtilities from '@/services/date-utilities'

/**
 * Mixin that provides the integration with the Legal API.
 */
@Component({})
export default class FilingTemplateMixin extends DateMixin {
  // FUTURE: import entire store instead of individual getters, actions and mutations?
  // Ref: https://pinia.vuejs.org/cookbook/options-api.html#giving-access-to-the-whole-store

  // Store getters
  @Getter(useStore) areProvisionsRemoved!: boolean
  @Getter(useStore) getAssociationType!: CoopTypes
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getCertifyState!: CertifyIF
  @Getter(useStore) getCompletingParty!: CompletingPartyIF
  @Getter(useStore) getCorrectedFilingDate!: string
  @Getter(useStore) getCorrectedFilingId!: number
  @Getter(useStore) getCorrectedFilingType!: FilingTypes
  @Getter(useStore) getCorrectionErrorType!: CorrectionErrorTypes
  @Getter(useStore) getCorrectionStartDate!: string
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getCurrentNaics!: NaicsIF
  @Getter(useStore) getDetailComment!: string
  @Getter(useStore) getDocumentOptionalEmail: string
  @Getter(useStore) getDocumentIdState!: DocumentIdIF
  @Getter(useStore) getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getFileNumber!: string
  @Getter(useStore) getFolioNumber!: string
  @Getter(useStore) getHasPlanOfArrangement!: boolean
  @Getter(useStore) getLatestResolutionForBusiness!: SpecialResolutionIF
  @Getter(useStore) getNameRequest!: NameRequestIF
  @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) getNameRequestLegalName!: string
  @Getter(useStore) getNameTranslations!: NameTranslationIF[]
  @Getter(useStore) getNewResolutionDates!: string[]
  @Getter(useStore) getOfficeAddresses!: AddressesIF
  @Getter(useStore) getOrgPeople!: OrgPersonIF[]
  @Getter(useStore) getOriginalBusinessInfo!: BusinessInformationIF
  @Getter(useStore) getOriginalLegalName!: string
  @Getter(useStore) getOriginalLegalType!: CorpTypeCd
  @Getter(useStore) getOriginalNrNumber!: string
  @Getter(useStore) getRestoration!: RestorationStateIF
  @Getter(useStore) getShareClasses!: ShareClassIF[]
  @Getter(useStore) getSnapshotNaics!: NaicsIF
  @Getter(useStore) getSpecialResolution!: SpecialResolutionIF
  @Getter(useStore) getSpecialResolutionMemorandum!: RulesMemorandumIF
  @Getter(useStore) getSpecialResolutionRules!: RulesMemorandumIF
  @Getter(useStore) getStaffPayment!: StaffPaymentIF
  @Getter(useStore) getStateFilingRestoration!: StateFilingRestorationIF
  @Getter(useStore) getTransactionalFolioNumber!: string
  @Getter(useStore) hasAssociationTypeChanged!: boolean
  @Getter(useStore) hasBusinessNameChanged!: boolean
  @Getter(useStore) hasBusinessStartDateChanged!: boolean
  @Getter(useStore) hasBusinessTypeChanged!: boolean
  @Getter(useStore) hasOnlyDetailDataChanged!: boolean
  @Getter(useStore) hasNaicsChanged!: boolean
  @Getter(useStore) hasShareStructureChanged!: boolean
  @Getter(useStore) hasSpecialResolutionMemorandumChanged!: boolean
  @Getter(useStore) hasSpecialResolutionResolutionChanged!: boolean
  @Getter(useStore) hasSpecialResolutionRulesChanged!: boolean
  @Getter(useStore) haveNameTranslationsChanged!: boolean
  @Getter(useStore) haveOfficeAddressesChanged!: boolean
  @Getter(useStore) isClientErrorCorrection!: boolean
  @Getter(useStore) isCoopCorrectionFiling!: boolean
  @Getter(useStore) isCorpCorrectionFiling!: boolean
  @Getter(useStore) isEntityTypeFirm!: boolean
  @Getter(useStore) isFirmCorrectionFiling!: boolean
  @Getter(useStore) isLimitedRestorationToFull!: boolean

  // Store actions
  @Action(useStore) setBusinessContact!: (x: ContactPointIF) => void
  @Action(useStore) setBusinessInformation!: (x: BusinessInformationIF) => void
  @Action(useStore) setCertifyState!: (x: CertifyIF) => void
  @Action(useStore) setCorrectionInformation!: (x: CorrectionInformationIF) => void
  @Action(useStore) setCorrectionStartDate!: (x: string) => void
  @Action(useStore) setEffectiveDateTimeString!: (x: string) => void
  @Action(useStore) setDetailComment!: (x: string) => void
  @Action(useStore) setDocumentIdState!: (x: DocumentIdIF) => void
  @Action(useStore) setDocumentOptionalEmail!: (x: string) => void
  @Action(useStore) setEntitySnapshot!: (x: EntitySnapshotIF) => void
  @Action(useStore) setEntityType!: (x: CorpTypeCd) => void
  @Action(useStore) setFileNumber!: (x: string) => void
  @Action(useStore) setFolioNumber!: (x: string) => void
  @Action(useStore) setHasPlanOfArrangement!: (x: boolean) => void
  @Action(useStore) setIsFutureEffective!: (x: boolean) => void
  @Action(useStore) setOfficeAddresses!: (x: AddressesIF) => void
  @Action(useStore) setNaics!: (x: NaicsIF) => void
  @Action(useStore) setNameTranslations!: (x: NameTranslationIF[]) => void
  @Action(useStore) setNameRequest!: (x: NameRequestIF) => void
  @Action(useStore) setNameRequestLegalName!: (x: string) => void
  @Action(useStore) setNewResolutionDates!: (x: string[]) => void
  @Action(useStore) setPeopleAndRoles!: (x: OrgPersonIF[]) => void
  @Action(useStore) setProvisionsRemoved!: (x: boolean) => void
  @Action(useStore) setRestorationCourtOrder!: (x: CourtOrderIF) => void
  @Action(useStore) setRestorationExpiryDate!: (x: string) => void
  @Action(useStore) setRestorationRelationships!: (x: RelationshipTypes[]) => void
  @Action(useStore) setShareClasses!: (x: ShareClassIF[]) => void
  @Action(useStore) setSpecialResolution!: (x: SpecialResolutionIF) => void
  @Action(useStore) setSpecialResolutionMemorandum!: (x: RulesMemorandumIF) => void
  @Action(useStore) setSpecialResolutionRules!: (x: RulesMemorandumIF) => void
  @Action(useStore) setStaffPayment!: (x: StaffPaymentIF) => void
  @Action(useStore) setTransactionalFolioNumber!: (x: string) => void

  //
  // Filing builders (for saving a filing)
  //

  /**
   * Builds an IA/change/registration/special resolution correction filing from store data.
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
        folioNumber: this.getFolioNumber || undefined, // folio number, unless overridden below
        documentIdState: this.getDocumentIdState // document id will serve as a barcode number
      },
      business: {
        // use original properties (not specific getters)
        foundingDate: this.getOriginalBusinessInfo?.foundingDate,
        identifier: this.getOriginalBusinessInfo?.identifier,
        legalName: this.getOriginalBusinessInfo?.legalName,
        legalType: this.getOriginalBusinessInfo?.legalType
      },
      correction: {
        legalType: this.getEntityType,
        business: {
          identifier: this.getBusinessId
        },
        correctedFilingId: this.getCorrectedFilingId,
        correctedFilingType: this.getCorrectedFilingType,
        correctedFilingDate: this.getCorrectedFilingDate,
        comment: `${this.defaultCorrectionDetailComment}\n${this.getDetailComment}`,
        ...(this.hasOnlyDetailDataChanged ? { commentOnly: true } : {}),
        contactPoint: this.getContactPoint,
        nameRequest: {
          // add in the fields needed by Legal API
          ...this.getNameRequest,
          legalName: this.getNameRequestLegalName || undefined, // don't include if empty
          nrNumber: this.getNameRequestNumber
        },
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

    // add in data specific to corp corrections
    if (this.isCorpCorrectionFiling) {
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

    if (this.isCoopCorrectionFiling) {
      // Apply Court Order ONLY when it is required and applied
      if (this.getHasPlanOfArrangement || this.getFileNumber) {
        filing.correction.courtOrder = {
          fileNumber: this.getFileNumber,
          effectOfOrder: this.getHasPlanOfArrangement ? EffectOfOrders.PLAN_OF_ARRANGEMENT : undefined,
          hasPlanOfArrangement: this.getHasPlanOfArrangement
        }
      }

      // Business rules are a bit different for corrections.
      if (this.hasAssociationTypeChanged) {
        filing.correction.cooperativeAssociationType = this.getAssociationType
      }

      if (this.hasSpecialResolutionRulesChanged) {
        if (this.getSpecialResolutionRules?.includedInResolution) {
          filing.correction = {
            ...filing.correction,
            rulesInResolution: true
          }
        } else {
          filing.correction = {
            ...filing.correction,
            rulesFileKey: this.getSpecialResolutionRules?.key,
            rulesFileName: this.getSpecialResolutionRules?.name
          }
        }
      }

      if (this.hasSpecialResolutionMemorandumChanged) {
        if (this.getSpecialResolutionMemorandum?.includedInResolution) {
          filing.correction = {
            ...filing.correction,
            memorandumInResolution: true
          }
        } else {
          filing.correction = {
            ...filing.correction,
            memorandumFileKey: this.getSpecialResolutionMemorandum?.key,
            memorandumFileName: this.getSpecialResolutionMemorandum?.name
          }
        }
      }

      if (this.hasSpecialResolutionResolutionChanged) {
        filing.correction = {
          ...filing.correction,
          resolution: this.getSpecialResolution.resolution,
          resolutionDate: this.getSpecialResolution.resolutionDate,
          signingDate: this.getSpecialResolution.signingDate,
          signatory: this.getSpecialResolution.signatory
        }
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
        folioNumber: this.getFolioNumber || undefined, // folio number, unless overridden below
        documentIdState: this.getDocumentIdState // document id will serve as a barcode number
      },
      business: {
        // use original properties (not specific getters)
        foundingDate: this.getOriginalBusinessInfo?.foundingDate,
        identifier: this.getOriginalBusinessInfo?.identifier,
        legalName: this.getOriginalBusinessInfo?.legalName,
        legalType: this.getOriginalBusinessInfo?.legalType
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
      filing.alteration.nameRequest = {
        // add in the fields needed by Legal API
        ...this.getNameRequest,
        legalName: this.getNameRequestLegalName || undefined, // don't include if empty
        legalType: this.getEntityType,
        nrNumber: this.getNameRequestNumber
      }
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
        effectOfOrder: this.getHasPlanOfArrangement ? EffectOfOrders.PLAN_OF_ARRANGEMENT : undefined,
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

    // build Staff Payment into the filing
    // may override folio number
    filing = this.buildStaffPayment(filing)

    // build Transactional Folio Number into the filing
    // will override staff folio number
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
        folioNumber: this.getFolioNumber || undefined, // folio number, unless overridden below
        documentIdState: this.getDocumentIdState // document id will serve as a barcode number
      },
      business: {
        // use original properties (not specific getters)
        foundingDate: this.getOriginalBusinessInfo?.foundingDate,
        identifier: this.getOriginalBusinessInfo?.identifier,
        legalName: this.getOriginalBusinessInfo?.legalName,
        legalType: this.getOriginalBusinessInfo?.legalType
      },
      restoration: {
        approvalType: this.getRestoration.approvalType,
        noticeDate: this.getRestoration.noticeDate || undefined, // don't include if empty
        applicationDate: this.getRestoration.applicationDate || undefined, // don't include if empty
        type: this.getRestoration.type,
        business: {
          identifier: this.getBusinessId,
          legalType: this.getEntityType
        },
        parties: null, // applied below
        offices: this.getOfficeAddresses,
        contactPoint: this.getContactPoint
      }
    }
    // Apply parties to filing
    {
      // make a copy so we don't change original array
      let parties = cloneDeep(this.getOrgPeople)

      // prepare parties
      parties = isDraft ? parties : this.prepareParties(parties)

      // fix schema issues
      parties = this.fixPartySchemaIssues(parties)

      filing.restoration.parties = parties
    }
    // Set relationships object for a full restoration only
    if (this.isLimitedRestorationToFull) {
      filing.restoration.relationships = this.getRestoration.relationships
    }

    // Set expiry date property if it's not null
    if (this.getRestoration.expiry) {
      filing.restoration.expiry = this.getRestoration.expiry
    }

    // Set Name Request object for a full restoration only
    if (this.isLimitedRestorationToFull) {
      // Apply NR / business name change to filing
      if (this.getNameRequestNumber || this.hasBusinessNameChanged) {
        filing.restoration.nameRequest = {
          // add in the fields needed by Legal API
          // don't save legal name if it's empty
          ...this.getNameRequest,
          legalName: this.getNameRequestLegalName || undefined, // don't include if empty
          nrNumber: this.getNameRequestNumber
        }
      } else {
        // Otherwise save default data
        filing.restoration.nameRequest = {
          legalName: this.getOriginalLegalName,
          legalType: this.getOriginalLegalType
        } as any
      }
    }

    // Apply name translation changes to filing
    if (this.haveNameTranslationsChanged) {
      const nameTranslations = isDraft ? this.getNameTranslations : this.prepareNameTranslations()
      filing.restoration.nameTranslations = nameTranslations
    }

    // Apply Court Order if it exists
    if (this.getRestoration.courtOrder?.fileNumber) {
      filing.restoration.courtOrder = this.getRestoration.courtOrder
    }

    // Set Document Optional Email if there is one
    if (this.getDocumentOptionalEmail) {
      filing.header.documentOptionalEmail = this.getDocumentOptionalEmail
    }

    // build Staff Payment into the filing
    // may override folio number
    filing = this.buildStaffPayment(filing)

    // build Transactional Folio Number into the filing
    // will override staff folio number
    filing = this.buildFolioNumber(filing)

    return filing
  }

  /**
   * Builds an special resolution filing from store data.
   * @param isDraft whether this is a draft
   * @returns the resolution filing body
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        folioNumber: this.getFolioNumber || undefined, // folio number, unless overridden below
        documentIdState: this.getDocumentIdState // document id will serve as a barcode number
      },
      business: {
        // use original properties (not specific getters)
        foundingDate: this.getOriginalBusinessInfo?.foundingDate,
        identifier: this.getOriginalBusinessInfo?.identifier,
        legalName: this.getOriginalBusinessInfo?.legalName,
        legalType: this.getOriginalBusinessInfo?.legalType,
        nrNumber: this.getOriginalBusinessInfo?.nrNumber
      },
      specialResolution: {
        ...this.getSpecialResolution
      }
    }

    // Only add alteration if the association type or rules or memorandum have changed
    if (this.hasAssociationTypeChanged || this.hasSpecialResolutionMemorandumChanged ||
        this.hasSpecialResolutionRulesChanged) {
      // Conditional access - Rules or memorandum could be empty here if it was done on paper.
      filing.alteration = {
        business: {
          identifier: this.getBusinessId,
          legalType: this.getEntityType
        },
        contactPoint: this.getContactPoint,
        cooperativeAssociationType: this.getAssociationType
      }
    }

    if (this.hasSpecialResolutionRulesChanged) {
      /* Ensures a key isn't passed when including the rules or memorandum in the resolution.
        See validator here:
        https://github.com/bcgov/lear/blob/main/legal-api/src/legal_api/services/filings/validations/alteration.py#L177
      */
      if (this.getSpecialResolutionRules?.includedInResolution) {
        filing.alteration.rulesInResolution = true
      } else {
        filing.alteration = {
          ...filing.alteration,
          rulesFileKey: this.getSpecialResolutionRules?.key,
          rulesFileName: this.getSpecialResolutionRules?.name,
          rulesUploadedOn: this.getSpecialResolutionRules?.uploaded
        }
      }
    }

    if (this.hasSpecialResolutionMemorandumChanged) {
      if (this.getSpecialResolutionMemorandum?.includedInResolution) {
        filing.alteration.memorandumInResolution = true
      } else {
        filing.alteration = {
          ...filing.alteration,
          memorandumFileKey: this.getSpecialResolutionMemorandum?.key,
          memorandumFileName: this.getSpecialResolutionMemorandum?.name
        }
      }
    }

    // Apply NR / business name / business type change to filing
    if (this.getNameRequestNumber || this.hasBusinessNameChanged || this.hasBusinessTypeChanged) {
      filing.changeOfName = {
        nameRequest: {
          // add in the fields needed by Legal API
          ...this.getNameRequest,
          legalName: this.getNameRequestLegalName || undefined, // don't include if empty
          nrNumber: this.getNameRequestNumber
        },
        legalName: this.getNameRequestLegalName
      }
    }

    if (this.getDocumentOptionalEmail) {
      filing.header.documentOptionalEmail = this.getDocumentOptionalEmail
    }

    // build Staff Payment into the filing
    // may override folio number
    filing = this.buildStaffPayment(filing)

    // build Transactional Folio Number into the filing
    // will override staff folio number
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
        folioNumber: this.getFolioNumber || undefined, // folio number, unless overridden below
        documentIdState: this.getDocumentIdState // document id will serve as a barcode number
      },
      business: {
        // use original properties (not specific getters)
        foundingDate: this.getOriginalBusinessInfo?.foundingDate,
        identifier: this.getOriginalBusinessInfo?.identifier,
        legalName: this.getOriginalBusinessInfo?.legalName,
        legalType: this.getOriginalBusinessInfo?.legalType
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
      filing.changeOfRegistration.nameRequest = {
        // add in the fields needed by Legal API
        ...this.getNameRequest,
        legalName: this.getNameRequestLegalName || undefined, // don't include if empty
        nrNumber: this.getNameRequestNumber
      }
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
        effectOfOrder: this.getHasPlanOfArrangement ? EffectOfOrders.PLAN_OF_ARRANGEMENT : undefined,
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

    // build Staff Payment into the filing
    // may override folio number
    filing = this.buildStaffPayment(filing)

    // build Transactional Folio Number into the filing
    // will override staff folio number
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
        folioNumber: '', // not applicable to SP/GP
        documentIdState: this.getDocumentIdState // document id will serve as a barcode number
      },
      business: {
        // use original properties (not specific getters)
        foundingDate: this.getOriginalBusinessInfo?.foundingDate,
        identifier: this.getOriginalBusinessInfo?.identifier,
        legalName: this.getOriginalBusinessInfo?.legalName,
        legalType: this.getOriginalBusinessInfo?.legalType
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
    // FUTURE: can probably delete this as Record Conversion doesn't allow name change
    if (this.hasBusinessNameChanged) {
      filing.conversion.nameRequest = {
        // add in the fields needed by Legal API
        ...this.getNameRequest,
        legalName: this.getNameRequestLegalName || undefined, // don't include if empty
        nrNumber: this.getNameRequestNumber
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

    // store Business Information for corp corrections
    if (this.isCorpCorrectionFiling) {
      this.setBusinessInformation({
        ...entitySnapshot?.businessInfo,
        ...filing.business,
        ...filing.correction.business
      })
    }

    if (this.isCoopCorrectionFiling) {
      this.setBusinessInformation({
        ...entitySnapshot?.businessInfo,
        ...filing.business,
        ...filing.correction.business,
        associationType: (
          filing.correction.cooperativeAssociationType || entitySnapshot?.businessInfo?.associationType || null
        )
      })
    }

    // store Business Information for firm corrections
    if (this.isFirmCorrectionFiling) {
      this.setBusinessInformation({
        ...entitySnapshot?.businessInfo,
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
        this.setNaics(this.getSnapshotNaics)
      }
    }

    // store Name Request data
    if (filing.correction.nameRequest) {
      this.setNameRequest(filing.correction.nameRequest)
      this.setNameRequestLegalName(filing.correction.nameRequest.legalName || null)
    } else {
      // store default data
      this.setNameRequest({
        legalType: this.getOriginalLegalType,
        nrNum: this.getOriginalNrNumber
      } as any)
      this.setNameRequestLegalName(this.getOriginalLegalName)
    }

    if (this.isCoopCorrectionFiling) {
      this.storeSpecialResolutionRulesAndMemorandum(filing.correction, entitySnapshot)
      let specialResolution: SpecialResolutionIF = {}
      if (filing.correction.resolution) {
        specialResolution = {
          resolution: filing.correction?.resolution,
          resolutionDate: filing.correction?.resolutionDate,
          signingDate: filing.correction?.signingDate,
          signatory: filing.correction?.signatory
        }
      } else {
        specialResolution = this.getLatestResolutionForBusiness
      }
      this.setSpecialResolution(cloneDeep(specialResolution))
    }

    // store Name Translations (corp corrections only)
    if (this.isCorpCorrectionFiling) {
      this.setNameTranslations(cloneDeep(
        this.mapNameTranslations(filing.correction.nameTranslations) ||
        this.mapNameTranslations(entitySnapshot?.nameTranslations) ||
        []
      ))
    }

    // store Office Addresses
    this.setOfficeAddresses(cloneDeep(
      filing.correction.offices ||
      entitySnapshot?.addresses ||
      null
    ))

    // store current Business Contact
    this.setBusinessContact({ ...entitySnapshot?.authInfo?.contact || null })

    // store People And Roles
    let orgPersons = filing.correction.parties || entitySnapshot?.orgPersons || []

    // filter in only the roles we currently support
    orgPersons.forEach(op => {
      op.roles = op.roles.filter(role => {
        if (this.isCorpCorrectionFiling) return (role.roleType === RoleTypes.DIRECTOR)
        if (this.isCoopCorrectionFiling) return (role.roleType === RoleTypes.DIRECTOR)
        if (this.isFirmCorrectionFiling) {
          return ([RoleTypes.PARTNER, RoleTypes.PROPRIETOR].includes(role.roleType))
        }
        return false // should never get here
      })
    })

    // filter out persons with no roles
    orgPersons = orgPersons.filter(op => (op.roles.length > 0))

    this.setPeopleAndRoles(cloneDeep(orgPersons))

    // store Share Classes and Resolution Dates (corp corrections only)
    if (this.isCorpCorrectionFiling) {
      this.setShareClasses(cloneDeep(
        filing.correction.shareStructure?.shareClasses ||
        entitySnapshot?.shareStructure?.shareClasses ||
        []
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
    this.setFolioNumber(entitySnapshot?.authInfo?.folioNumber || '')

    // store Effective Date
    const effectiveDate = this.apiToIso(filing.header.effectiveDate)
    this.setEffectiveDateTimeString(effectiveDate)
    this.setIsFutureEffective(filing.header.isFutureEffective)

    if (this.isCoopCorrectionFiling) {
      this.setFileNumber(filing.correction.courtOrder?.fileNumber)
      this.setHasPlanOfArrangement(filing.correction.courtOrder?.hasPlanOfArrangement)
    }

    // store Staff Payment
    this.storeStaffPayment(filing)

    // store document service state
    this.setDocumentIdState({
      valid: filing.header.documentIdState?.valid,
      consumerDocumentId: filing.header.documentIdState?.consumerDocumentId
    })
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
    this.setEntityType(
      filing.alteration.business?.legalType || entitySnapshot?.businessInfo?.legalType || null
    )

    // store Business Information
    this.setBusinessInformation({
      ...entitySnapshot?.businessInfo,
      ...filing.business,
      ...filing.alteration.business
    })

    // store Name Request data
    if (filing.alteration.nameRequest) {
      this.setNameRequest(filing.alteration.nameRequest)
      this.setNameRequestLegalName(filing.alteration.nameRequest.legalName || null)
    } else {
      // store default data
      this.setNameRequest({
        legalType: this.getOriginalLegalType,
        nrNum: this.getOriginalNrNumber
      } as any)
      this.setNameRequestLegalName(this.getOriginalLegalName)
    }

    // store Name Translations
    this.setNameTranslations(cloneDeep(
      this.mapNameTranslations(filing.alteration.nameTranslations) ||
      this.mapNameTranslations(entitySnapshot?.nameTranslations) ||
      []
    ))

    // store Provisions Removed
    if (filing.alteration.provisionsRemoved) this.setProvisionsRemoved(true)

    // store Office Addresses **from snapshot** (because we don't change office addresses in an alteration)
    this.setOfficeAddresses(cloneDeep(entitySnapshot?.addresses || null))

    // store People And Roles **from snapshot** (because we don't change people and roles in an alteration)
    this.setPeopleAndRoles(cloneDeep(entitySnapshot?.orgPersons || []))

    // store current Business Contact
    this.setBusinessContact({ ...entitySnapshot?.authInfo?.contact || null })

    // store Share Classes and Resolution Dates
    this.setShareClasses(cloneDeep(
      filing.alteration.shareStructure?.shareClasses ||
      entitySnapshot?.shareStructure?.shareClasses ||
      []
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
    this.setFolioNumber(entitySnapshot?.authInfo?.folioNumber || '')

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

    // store document service state
    this.setDocumentIdState({
      valid: filing.header.documentIdState?.valid,
      consumerDocumentId: filing.header.documentIdState?.consumerDocumentId
    })
  }

  /**
   * Parses a draft Restoration filing into the store.
   * @param filing the restoration filing
   */
  parseRestorationFiling (filing: RestorationFilingIF): void {
    // get the Entity Snapshot from store
    const entitySnapshot = this.getEntitySnapshot // may be null

    // store Entity Type
    this.setEntityType(
      filing.restoration.business?.legalType || this.getOriginalLegalType || null
    )

    // store Business Information
    this.setBusinessInformation({
      ...entitySnapshot?.businessInfo,
      ...filing.business,
      ...filing.restoration.business
    })

    // store Approval Type
    if (filing.restoration.approvalType) {
      // get approval type from draft
      this.getRestoration.approvalType = filing.restoration.approvalType
    } else if (this.getStateFilingRestoration?.approvalType) {
      // get approval type from state filing
      this.getRestoration.approvalType = this.getStateFilingRestoration.approvalType
    }

    // store notice and application dates
    if (filing.restoration.noticeDate) {
      this.getRestoration.noticeDate = filing.restoration.noticeDate
    }
    if (filing.restoration.applicationDate) {
      this.getRestoration.applicationDate = filing.restoration.applicationDate
    }

    // store Court Order object
    if (filing.restoration.courtOrder) {
      this.setRestorationCourtOrder(filing.restoration.courtOrder)
    }

    // store Restoration Type
    this.getRestoration.type = filing.restoration.type

    // store Expiry Date
    if (filing.restoration.expiry) {
      this.setRestorationExpiryDate(filing.restoration.expiry)
    }

    // store Name Request data
    if (filing.restoration.nameRequest) {
      this.setNameRequest(filing.restoration.nameRequest)
      this.setNameRequestLegalName(filing.restoration.nameRequest.legalName || null)
    } else {
      // store default data
      this.setNameRequest({
        legalType: this.getOriginalLegalType,
        nrNum: this.getOriginalNrNumber
      } as any)
      this.setNameRequestLegalName(this.getOriginalLegalName)
    }

    // store Relationships
    if (filing.restoration.relationships?.length > 0) {
      this.setRestorationRelationships(filing.restoration.relationships)
    }

    // store Name Translations
    this.setNameTranslations(cloneDeep(
      this.mapNameTranslations(filing.restoration.nameTranslations) ||
      this.mapNameTranslations(entitySnapshot?.nameTranslations) ||
      []
    ))

    // store Office Addresses
    this.setOfficeAddresses(cloneDeep(
      filing.restoration.offices ||
      entitySnapshot?.addresses ||
      null
    ))

    // store People And Roles
    this.setPeopleAndRoles(cloneDeep(
      filing.restoration.parties ||
      entitySnapshot?.orgPersons ||
      []
    ))

    // store current Business Contact
    this.setBusinessContact({ ...entitySnapshot?.authInfo?.contact })

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Folio Number
    // FUTURE: should we store restoration.folioNumber instead?
    if (entitySnapshot?.authInfo?.folioNumber) {
      this.setFolioNumber(entitySnapshot?.authInfo?.folioNumber)
    }

    // if Transactional Folio Number was saved then store it
    if (filing.header.isTransactionalFolioNumber) {
      this.setTransactionalFolioNumber(filing.header.folioNumber)
    }

    // store Document Optional Email
    if (filing.header.documentOptionalEmail) {
      this.setDocumentOptionalEmail(filing.header.documentOptionalEmail)
    }

    // store Staff Payment
    this.storeStaffPayment(filing)

    // store document service state
    this.setDocumentIdState({
      valid: filing.header.documentIdState?.valid,
      consumerDocumentId: filing.header.documentIdState?.consumerDocumentId
    })
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
    this.setEntityType(
      filing.alteration?.business?.legalType || entitySnapshot?.businessInfo?.legalType || null
    )

    // store Business Information
    this.setBusinessInformation({
      ...entitySnapshot?.businessInfo,
      ...filing.business,
      ...filing.alteration?.business,
      associationType: (
        filing.alteration?.cooperativeAssociationType || entitySnapshot?.businessInfo?.associationType || null
      )
    })

    // store Name Request data
    if (filing.changeOfName?.nameRequest) {
      this.setNameRequest(filing.changeOfName.nameRequest)
      this.setNameRequestLegalName(filing.changeOfName.nameRequest.legalName || null)
    } else {
      // store default data
      this.setNameRequest({
        legalType: this.getOriginalLegalType,
        nrNum: this.getOriginalNrNumber
      } as any)
      this.setNameRequestLegalName(this.getOriginalLegalName)
    }

    this.storeSpecialResolutionRulesAndMemorandum(filing.alteration, entitySnapshot)

    this.setSpecialResolution(cloneDeep(filing.specialResolution))

    // store Office Addresses **from snapshot** (because we don't change office addresses in an special resolution)
    this.setOfficeAddresses(cloneDeep(entitySnapshot?.addresses || null))

    // store People And Roles **from snapshot** (because we don't change people and roles in an special resolution)
    this.setPeopleAndRoles(cloneDeep(entitySnapshot?.orgPersons || []))

    // store current Business Contact
    this.setBusinessContact({ ...entitySnapshot?.authInfo?.contact || null })

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Folio Number
    // FUTURE: should we store correction.folioNumber instead?
    this.setFolioNumber(entitySnapshot?.authInfo?.folioNumber || '')

    // if Transactional Folio Number was saved then store it
    if (filing.header.isTransactionalFolioNumber) {
      this.setTransactionalFolioNumber(filing.header.folioNumber)
    }

    // store Document Optional Email
    this.setDocumentOptionalEmail(filing.header.documentOptionalEmail || '')

    // store Staff Payment
    this.storeStaffPayment(filing)

    // store document service state
    this.setDocumentIdState({
      valid: filing.header.documentIdState?.valid,
      consumerDocumentId: filing.header.documentIdState?.consumerDocumentId
    })
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
    this.setEntityType(
      filing.business?.legalType || entitySnapshot?.businessInfo?.legalType || null
    )

    // store Business Information
    this.setBusinessInformation({
      ...entitySnapshot?.businessInfo,
      ...filing.business
    })

    // store NAICS
    // NB: must come after business information
    if (filing.changeOfRegistration.business.naics) {
      this.setNaics({ ...filing.changeOfRegistration.business.naics })
    }

    // store Name Request data
    if (filing.changeOfRegistration.nameRequest) {
      this.setNameRequest(filing.changeOfRegistration.nameRequest)
      this.setNameRequestLegalName(filing.changeOfRegistration.nameRequest.legalName || null)
    } else {
      // store default data
      this.setNameRequest({
        legalType: this.getOriginalLegalType,
        nrNum: this.getOriginalNrNumber
      } as any)
      this.setNameRequestLegalName(this.getOriginalLegalName)
    }

    // store Office Addresses
    let addresses
    if (filing.changeOfRegistration.offices?.businessOffice) {
      addresses = { businessOffice: filing.changeOfRegistration.offices.businessOffice }
    }
    this.setOfficeAddresses(cloneDeep(
      addresses ||
      entitySnapshot?.addresses ||
      null
    ))

    // store People And Roles
    let orgPersons = filing.changeOfRegistration.parties || entitySnapshot?.orgPersons || []
    // exclude Completing Party
    // (it is managed separately and added to the filing in buildChangeRegFiling())
    orgPersons = orgPersons.filter(op => !(op?.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)))
    this.setPeopleAndRoles(cloneDeep(orgPersons))

    // store current Business Contact
    this.setBusinessContact({ ...entitySnapshot?.authInfo?.contact || null })

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Folio Number
    // FUTURE: should we store correction.folioNumber instead?
    this.setFolioNumber(entitySnapshot?.authInfo?.folioNumber || '')

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
    this.setCorrectionStartDate(filing.changeOfRegistration.startDate || '')

    // store Staff Payment
    this.storeStaffPayment(filing)

    // store document service state
    this.setDocumentIdState({
      valid: filing.header.documentIdState?.valid,
      consumerDocumentId: filing.header.documentIdState?.consumerDocumentId
    })
  }

  /**
   * Parses a draft firm Conversion filing into the store.
   * @param filing the conversion filing
   * @param entitySnapshot the latest entity snapshot
   */
  parseFirmConversionFiling (filing: ConversionFilingIF, entitySnapshot: EntitySnapshotIF): void {
    // store Entity Snapshot
    this.setEntitySnapshot(entitySnapshot)

    // store Entity Type
    this.setEntityType(filing.business?.legalType || entitySnapshot?.businessInfo?.legalType || null)

    // store Business Information
    this.setBusinessInformation({
      ...entitySnapshot?.businessInfo,
      ...filing.business
    })

    // store NAICS
    // NB: must come after business information
    if (filing.conversion.business.naics) {
      this.setNaics({ ...filing.conversion.business.naics })
    }

    // store Name Request data
    if (filing.conversion.nameRequest) {
      this.setNameRequest(filing.conversion.nameRequest)
      this.setNameRequestLegalName(filing.conversion.nameRequest.legalName || null)
    } else {
      // store default data
      this.setNameRequest({
        legalType: this.getOriginalLegalType,
        nrNum: this.getOriginalNrNumber
      } as any)
      this.setNameRequestLegalName(this.getOriginalLegalName)
    }

    // store Office Addresses
    let addresses = null
    if (filing.conversion.offices?.businessOffice) {
      addresses = { businessOffice: filing.conversion.offices.businessOffice }
    }
    this.setOfficeAddresses(cloneDeep(
      addresses ||
      entitySnapshot?.addresses ||
      null
    ))

    // store People And Roles
    let orgPersons = filing.conversion.parties || entitySnapshot?.orgPersons || []
    // exclude Completing Party
    // (it is managed separately and added to the filing in buildConversionFiling())
    orgPersons = orgPersons.filter(op => !(op?.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)))
    this.setPeopleAndRoles(cloneDeep(orgPersons))

    // store Business Start Date
    this.setCorrectionStartDate(filing.conversion.startDate || '')

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Staff Payment
    this.storeStaffPayment(filing)

    // store document service state
    this.setDocumentIdState({
      valid: filing.header.documentIdState?.valid,
      consumerDocumentId: filing.header.documentIdState?.consumerDocumentId
    })
  }

  /**
   * Parses an entity snapshot into the store. Used when there isn't a draft.
   * @param entitySnapshot the latest entity snapshot
   */
  parseEntitySnapshot (entitySnapshot = this.getEntitySnapshot): void {
    // store Entity Snapshot
    this.setEntitySnapshot(entitySnapshot)

    // store Folio Number
    this.setFolioNumber(entitySnapshot?.authInfo?.folioNumber || '')

    // store Entity Type
    this.setEntityType(entitySnapshot?.businessInfo?.legalType || null)

    // store Business Information
    if (entitySnapshot?.businessInfo) {
      this.setBusinessInformation({ ...entitySnapshot?.businessInfo })
    } else {
      this.setBusinessInformation({ ...EmptyBusinessInfo })
    }

    // store default Name Request data
    this.setNameRequest({
      legalType: this.getOriginalLegalType,
      nrNum: this.getOriginalNrNumber
    } as any)
    this.setNameRequestLegalName(this.getOriginalLegalName)

    // store People and Roles
    this.setPeopleAndRoles(cloneDeep(entitySnapshot?.orgPersons || []))

    // store current Business Contact
    this.setBusinessContact({ ...entitySnapshot?.authInfo?.contact || null })

    // store Office Addresses
    this.setOfficeAddresses(cloneDeep(entitySnapshot?.addresses || null))

    // handle entity-specific values
    switch (entitySnapshot?.businessInfo?.legalType) {
      case CorpTypeCd.BC_CCC:
      case CorpTypeCd.BC_COMPANY:
      case CorpTypeCd.BC_ULC_COMPANY:
      case CorpTypeCd.BEN_CONTINUE_IN:
      case CorpTypeCd.BENEFIT_COMPANY:
      case CorpTypeCd.CCC_CONTINUE_IN:
      case CorpTypeCd.CONTINUE_IN:
      case CorpTypeCd.ULC_CONTINUE_IN: {
        // store Name Translations
        // don't need cloneDeep because mapNameTranslations already returns new array
        this.setNameTranslations(this.mapNameTranslations(entitySnapshot?.nameTranslations || []))

        // clear Provisions Removed
        this.setProvisionsRemoved(null)

        // store Share Classes and clear New Resolution Dates
        this.setShareClasses(cloneDeep(entitySnapshot?.shareStructure?.shareClasses || []))
        this.setNewResolutionDates([])

        break
      }

      case CorpTypeCd.SOLE_PROP:
      case CorpTypeCd.PARTNERSHIP: {
        // FUTURE: expand here as needed
        break
      }
      case CorpTypeCd.COOP: {
        // Note: it's possible for the COOP to have a paper resolution or memorandum, documentsInfo would be empty.
        const documentsInfo = entitySnapshot?.businessDocuments?.documentsInfo
        this.setSpecialResolutionRules(
          {
            name: documentsInfo?.certifiedRules?.name,
            key: documentsInfo?.certifiedRules?.key || null,
            url: entitySnapshot?.businessDocuments?.documents?.certifiedRules,
            previouslyInResolution: documentsInfo?.certifiedRules?.includedInResolution,
            uploaded: documentsInfo?.certifiedRules?.uploaded
          })

        this.setSpecialResolutionMemorandum(
          {
            name: documentsInfo?.certifiedMemorandum?.name,
            key: documentsInfo?.certifiedMemorandum?.key,
            url: entitySnapshot?.businessDocuments?.documents?.certifiedMemorandum,
            previouslyInResolution: documentsInfo?.certifiedMemorandum?.includedInResolution,
            uploaded: documentsInfo?.certifiedMemorandum?.uploaded
          })
      }
    }
  }

  //
  // Local helper methods
  //

  /** The default (hard-coded first line) correction detail comment. */
  public get defaultCorrectionDetailComment (): string {
    const correctedFilingName = FilingTypeToName(this.getCorrectedFilingType)
    return `Correction for ${correctedFilingName} filed on ${this.correctedFilingDate}`
  }

  /** The corrected filing date as (Month Day, Year). */
  private get correctedFilingDate (): string {
    return DateUtilities.yyyyMmDdToPacificDate(this.getCorrectedFilingDate, true)
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      case StaffPaymentOptions.NONE: // should never happen when user is staff
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

  /**
   * Parses Special Resolution Rules and Memorandum data into store, also used for corrections for Special Resolution.
   * @param filingInformation the filing information to parse.
   * @param entitySnapshot the entity snapshot.
   */
  private storeSpecialResolutionRulesAndMemorandum (
    filingInformation: CoopAlterationIF | CorrectionInformationIF,
    entitySnapshot: EntitySnapshotIF
  ): void {
    // Documents Info can possibly be undefined, if the co-op was created via paper.
    const documentsInfo = entitySnapshot?.businessDocuments?.documentsInfo
    if (filingInformation?.rulesFileKey) {
      // Scenario 1 - From draft, rules are uploaded in the draft.
      this.setSpecialResolutionRules(
        {
          name: filingInformation.rulesFileName,
          key: filingInformation.rulesFileKey,
          url: null, // no url for drafts, this is intentional.
          includedInResolution: false,
          previouslyInResolution: documentsInfo?.certifiedRules?.includedInResolution,
          uploaded: filingInformation.rulesUploadedOn
        })
    } else if (filingInformation?.rulesInResolution) {
      // Scenario 2 - From draft, rules are included in the resolution.
      this.setSpecialResolutionRules(
        {
          name: documentsInfo?.certifiedRules?.name,
          key: documentsInfo?.certifiedRules?.key || null,
          url: entitySnapshot?.businessDocuments?.documents?.certifiedRules,
          includedInResolution: true,
          previouslyInResolution: documentsInfo?.certifiedRules?.includedInResolution,
          uploaded: documentsInfo?.certifiedRules?.uploaded
        })
    } else {
      // Scenario 3 + 4 - Not draft, rules exist or rules are on paper.
      this.setSpecialResolutionRules(
        {
          name: documentsInfo?.certifiedRules?.name,
          key: documentsInfo?.certifiedRules?.key || null,
          url: entitySnapshot?.businessDocuments?.documents?.certifiedRules,
          includedInResolution: false,
          previouslyInResolution: documentsInfo?.certifiedRules?.includedInResolution,
          uploaded: documentsInfo?.certifiedRules?.uploaded
        })
    }

    if (filingInformation?.memorandumFileKey) {
      // Scenario 1 - From draft, memorandum are uploaded in the draft.
      this.setSpecialResolutionMemorandum(
        {
          name: filingInformation.memorandumFileName,
          key: filingInformation.memorandumFileKey,
          url: null, // no url for drafts, this is intentional.
          includedInResolution: false,
          previouslyInResolution: documentsInfo?.certifiedMemorandum?.includedInResolution,
          uploaded: filingInformation.memorandumloadedOn
        })
    } else if (filingInformation?.memorandumInResolution) {
      // Scenario 2 - From draft - Memorandum is in the resolution.
      this.setSpecialResolutionMemorandum(
        {
          name: documentsInfo?.certifiedMemorandum?.name,
          key: documentsInfo?.certifiedMemorandum?.key || null,
          url: entitySnapshot?.businessDocuments?.documents?.certifiedMemorandum,
          includedInResolution: true,
          previouslyInResolution: documentsInfo?.certifiedMemorandum?.includedInResolution,
          uploaded: documentsInfo?.certifiedMemorandum?.uploaded
        })
    } else {
      // Scenario 2 + 3 - Not Draft - Memorandum is not in the resolution or are on paper.
      this.setSpecialResolutionMemorandum(
        {
          name: documentsInfo?.certifiedMemorandum?.name,
          key: documentsInfo?.certifiedMemorandum?.key || null,
          url: entitySnapshot?.businessDocuments?.documents?.certifiedMemorandum,
          includedInResolution: false,
          previouslyInResolution: documentsInfo?.certifiedMemorandum?.includedInResolution,
          uploaded: documentsInfo?.certifiedMemorandum?.uploaded
        })
    }
  }
}
