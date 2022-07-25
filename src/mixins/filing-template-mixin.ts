import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { cloneDeep } from 'lodash'
import { DateMixin } from '@/mixins/'
import { ActionBindingIF, AddressesIF, AlterationFilingIF, CertifyIF, CorrectionFilingIF, EffectiveDateTimeIF,
  EntitySnapshotIF, ChgRegistrationFilingIF, ConversionFilingIF, NameRequestIF, NameTranslationIF,
  OrgPersonIF, ShareClassIF } from '@/interfaces/'
import { CompletingPartyIF, ContactPointIF, NaicsIF, StaffPaymentIF } from '@bcrs-shared-components/interfaces/'
import { ActionTypes, CorrectionErrorTypes, EffectOfOrders, FilingTypes, PartyTypes, RoleTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums/'
import { SpecialResolutionFilingIF } from '@/interfaces/filing-interfaces/special-resolution-filing-interface'

/**
 * Mixin that provides the integration with the Legal API.
 */
@Component({})
export default class FilingTemplateMixin extends Mixins(DateMixin) {
  // Global getters
  @Getter getNameRequestNumber!: string
  @Getter getNameRequestLegalName!: string
  @Getter getBusinessId!: string
  @Getter getCurrentDate!: string
  @Getter getCorrectedFilingDate!: string
  @Getter getCorrectedFilingId!: number
  @Getter getCorrectedFilingType!: FilingTypes
  @Getter getCorrectionErrorType!: CorrectionErrorTypes
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getDocumentOptionalEmail: string
  @Getter hasBusinessNameChanged!: boolean
  @Getter hasBusinessTypeChanged!: boolean
  @Getter hasNatureOfBusinessChanged!: boolean
  @Getter hasNameTranslationChanged!: boolean
  @Getter hasShareStructureChanged!: boolean
  @Getter getPeopleAndRoles!: OrgPersonIF[]
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
  @Getter getNewAlteration!: any // *** FUTURE: use type AlterationFilingIF
  @Getter areProvisionsRemoved!: boolean
  @Getter getFileNumber!: string
  @Getter getHasPlanOfArrangement!: boolean
  @Getter haveOfficeAddressesChanged!: boolean
  @Getter getCompletingParty!: CompletingPartyIF
  @Getter isEntityTypeBEN!: boolean
  @Getter isEntityTypeCP!: boolean
  @Getter isEntityTypeSP!: boolean
  @Getter isEntityTypeGP!: boolean

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

  get defaultCorrectionDetailComment (): string {
    const date = this.apiToDate(this.getCorrectedFilingDate)
    const yyyyMmDd = this.dateToYyyyMmDd(date)
    return `Correction for Incorporation Application filed on ${yyyyMmDd}.`
  }

  get getContactPoint (): ContactPointIF {
    return {
      email: this.getBusinessContact.email,
      phone: this.getBusinessContact.phone || '',
      extension: +this.getBusinessContact.extension || undefined // don't include if empty
    }
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
    let parties = this.getPeopleAndRoles
    let shareClasses = this.getShareClasses
    let nameTranslations = this.getNameTranslations

    // if filing...
    if (!isDraft) {
      // Filter out removed parties and delete "actions" property
      parties = parties.filter(x => !x.actions?.includes(ActionTypes.REMOVED))
        .map((x) => { const { actions, ...rest } = x; return rest })

      // Filter out removed classes and delete "action" property
      shareClasses = shareClasses.filter(x => x.action !== ActionTypes.REMOVED)
        .map((x) => { const { action, ...rest } = x; return rest })

      // Filter out removed series and delete "action" property
      for (const [index, share] of shareClasses.entries()) {
        shareClasses[index].series = share.series?.filter(x => x.action !== ActionTypes.REMOVED)
          .map((x) => { const { action, ...rest } = x; return rest })
      }

      nameTranslations = this.prepareNameTranslations()
    }

    // Build correction filing (common data)
    const filing: CorrectionFilingIF = {
      header: {
        name: FilingTypes.CORRECTION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: this.getFolioNumber // original folio number, unless overridden by staff payment below
      },
      business: {
        identifier: this.getBusinessId,
        legalName: this.getNameRequestLegalName,
        legalType: this.getEntityType,
        nrNumber: this.getNameRequestNumber
      },
      correction: {
        correctedFilingId: this.getCorrectedFilingId,
        correctedFilingType: this.getCorrectedFilingType,
        correctedFilingDate: this.getCorrectedFilingDate,
        comment: `${this.defaultCorrectionDetailComment}\n${this.getDetailComment}`,
        contactPoint: this.getContactPoint,
        nameRequest: this.getNameRequest,
        offices: this.getOfficeAddresses,
        parties: parties,
        type: this.getCorrectionErrorType
      }
    }

    // add in Incorporation Application data
    if (this.isCorrectedIncorporationApplication) {
      filing.correction.nameTranslations = nameTranslations
      filing.correction.shareStructure = { shareClasses }

      // *** FUTURE: remove this temporary code
      // populate the incorporation application object (for the Filer to process)
      filing.incorporationApplication = {
        contactPoint: this.getContactPoint,
        nameRequest: {
          legalType: this.getEntityType,
          legalName: this.getNameRequestLegalName,
          nrNumber: this.getNameRequestNumber
        },
        nameTranslations: nameTranslations,
        offices: this.getOfficeAddresses,
        parties,
        shareStructure: { shareClasses }
      }
    }

    // add in Registration data
    if (this.isCorrectedRegistration) {
      filing.correction.business = {
        naicsCode: this.getCurrentNaics.naicsCode,
        naicsDescription: this.getCurrentNaics.naicsDescription
      }
      // filing.correction.startDate = ... // *** FUTURE: implement
    }

    // add in Change Of Registration data
    if (this.isCorrectedChangeReg) {
      filing.correction.business = {
        naicsCode: this.getCurrentNaics.naicsCode,
        naicsDescription: this.getCurrentNaics.naicsDescription
      }
      // filing.correction.startDate = ... // *** FUTURE: implement
    }

    // Include Staff Payment into the Correction filing
    this.buildStaffPayment(filing)

    return filing
  }

  /**
   * Builds an alteration filing from store data.
   * @param isDraft whether this is a draft
   * @returns the alteration filing body
   */
  buildAlterationFiling (isDraft: boolean): AlterationFilingIF {
    let shareClasses = this.getShareClasses
    let nameTranslations = this.getNameTranslations

    // if filing...
    if (!isDraft) {
      // Filter out removed classes and delete "action" property
      shareClasses = shareClasses.filter(x => x.action !== ActionTypes.REMOVED)
        .map((x) => { const { action, ...rest } = x; return rest })

      // Filter out removed series and delete "action" property
      for (const [index, share] of shareClasses.entries()) {
        shareClasses[index].series = share.series?.filter(x => x.action !== ActionTypes.REMOVED)
          .map((x) => { const { action, ...rest } = x; return rest })
      }

      nameTranslations = this.prepareNameTranslations()
    }

    // Build alteration filing
    const filing: AlterationFilingIF = {
      header: {
        name: FilingTypes.ALTERATION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: this.getFolioNumber
      },
      business: {
        foundingDate: this.getEntitySnapshot.businessInfo.foundingDate,
        identifier: this.getEntitySnapshot.businessInfo.identifier,
        legalName: this.getEntitySnapshot.businessInfo.legalName,
        legalType: this.getEntitySnapshot.businessInfo.legalType,
        nrNumber: this.getEntitySnapshot.businessInfo.nrNumber
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

    // Apply name request info to filing
    if (this.getNameRequestNumber || this.hasBusinessNameChanged || this.hasBusinessTypeChanged) {
      filing.alteration.nameRequest = { ...this.getNameRequest }
    }

    // Apply name translation changes to filing
    if (this.hasNameTranslationChanged) {
      filing.alteration.nameTranslations = nameTranslations
    }

    // Apply share structure changes to filing or apply new resolution dates
    if (this.hasShareStructureChanged) {
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
      const effectiveDate = new Date(this.getEffectiveDateTime.dateTimeString)
      const effectiveDateIso = this.dateToApi(effectiveDate)
      filing.header.effectiveDate = effectiveDateIso // in UTC
    }

    if (this.getDocumentOptionalEmail) {
      filing.header.documentOptionalEmail = this.getDocumentOptionalEmail
    }

    // Include Staff Payment into the Alteration filing
    this.buildStaffPayment(filing)

    // Sets Folio number if a transactional folio number was entered
    this.buildFolioNumber(filing)

    return filing
  }

  /**
   * Builds an special resolution filing from store data.
   * @param isDraft whether this is a draft
   * @returns the resolution filing body
   */
  buildSpecialResolutionFiling (isDraft: boolean): SpecialResolutionFilingIF {
    // if filing...
    if (!isDraft) {
      // to add in future
    }

    // Build alteration filing
    const filing: SpecialResolutionFilingIF = {
      header: {
        name: FilingTypes.SPECIAL_RESOLUTION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: this.getFolioNumber
      },
      business: {
        foundingDate: this.getEntitySnapshot.businessInfo.foundingDate,
        identifier: this.getEntitySnapshot.businessInfo.identifier,
        legalName: this.getEntitySnapshot.businessInfo.legalName,
        legalType: this.getEntitySnapshot.businessInfo.legalType,
        nrNumber: this.getEntitySnapshot.businessInfo.nrNumber
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

    // Apply name request info to filing
    if (this.getNameRequestNumber || this.hasBusinessNameChanged || this.hasBusinessTypeChanged) {
      filing.alteration.nameRequest = { ...this.getNameRequest }
    }

    // Apply Court Order ONLY when it is required and applied
    if (this.getHasPlanOfArrangement || this.getFileNumber) {
      filing.alteration.courtOrder = {
        fileNumber: this.getFileNumber,
        effectOfOrder: this.getHasPlanOfArrangement ? EffectOfOrders.PLAN_OF_ARRANGEMENT : null,
        hasPlanOfArrangement: this.getHasPlanOfArrangement
      }
    }

    if (this.getDocumentOptionalEmail) {
      filing.header.documentOptionalEmail = this.getDocumentOptionalEmail
    }

    // Include Staff Payment into the Alteration filing
    this.buildStaffPayment(filing)

    // Sets Folio number if a transactional folio number was entered
    this.buildFolioNumber(filing)

    return filing
  }

  /**
   * Builds a change of registration filing from store data.
   * @param isDraft whether this is a draft
   * @returns the change filing body
   */
  buildChangeRegFiling (isDraft: boolean): ChgRegistrationFilingIF {
    // Build change filing
    const filing: ChgRegistrationFilingIF = {
      header: {
        name: FilingTypes.CHANGE_OF_REGISTRATION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: this.getFolioNumber
      },
      business: {
        foundingDate: this.getEntitySnapshot.businessInfo.foundingDate,
        identifier: this.getEntitySnapshot.businessInfo.identifier,
        legalName: this.getEntitySnapshot.businessInfo.legalName,
        legalType: this.getEntitySnapshot.businessInfo.legalType,
        nrNumber: this.getEntitySnapshot.businessInfo.nrNumber
      },
      changeOfRegistration: {
        business: {
          natureOfBusiness: '',
          identifier: this.getBusinessId
        },
        contactPoint: this.getContactPoint
      }
    }

    // Apply name request info to filing
    if (this.hasBusinessNameChanged) {
      filing.changeOfRegistration.nameRequest = { ...this.getNameRequest }
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

    // Apply NAICS change to filing
    if (this.hasNatureOfBusinessChanged) {
      filing.changeOfRegistration.business.naics = this.getCurrentNaics
    }

    // Apply parties to filing
    {
      let parties = cloneDeep(this.getPeopleAndRoles) // make a copy

      // Add completing party
      // (assumes CP doesn't already exist in array)
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

      // if filing...
      if (!isDraft) {
        // Filter out removed parties and delete "actions" property
        parties = parties.filter(x => !x.actions?.includes(ActionTypes.REMOVED))
          .map((x) => { const { actions, ...rest } = x; return rest })
      }

      // fix schema issues
      parties = parties.map(party => {
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

      filing.changeOfRegistration.parties = parties
    }

    // Sets Folio number if a transactional folio number was entered
    this.buildFolioNumber(filing)

    return filing
  }

  /**
   * Builds a conversion filing from store data.
   * @param isDraft whether this is a draft
   * @returns the conversion filing body
   */
  buildConversionFiling (isDraft: boolean): ConversionFilingIF {
    // Build conversion filing
    const filing: ConversionFilingIF = {
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
        legalType: this.getEntitySnapshot.businessInfo.legalType,
        nrNumber: this.getEntitySnapshot.businessInfo.nrNumber
      },
      conversion: {
        business: {
          natureOfBusiness: '',
          identifier: this.getBusinessId
        },
        contactPoint: this.getContactPoint,
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
    if (this.hasNatureOfBusinessChanged) {
      filing.conversion.business.naics = {
        naicsCode: this.getCurrentNaics.naicsCode || undefined, // don't include if empty
        naicsDescription: this.getCurrentNaics.naicsDescription
      }
    }

    // Apply parties to filing
    {
      let parties = cloneDeep(this.getPeopleAndRoles) // make a copy

      // Add completing party
      // (assumes CP doesn't already exist in array)
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

      // if filing...
      if (!isDraft) {
        // Filter out removed parties and delete "actions" property
        parties = parties.filter(x => !x.actions?.includes(ActionTypes.REMOVED))
          .map((x) => { const { actions, ...rest } = x; return rest })
      }

      // fix schema issues
      parties = parties.map(party => {
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

      filing.conversion.parties = parties
    }

    // Include Staff Payment into the Conversion filing
    this.buildStaffPayment(filing)

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

    // store Correction Information
    this.setCorrectionInformation(filing.correction)

    // store Business Information
    if (this.isCorrectedIncorporationApplication) {
      this.setBusinessInformation(filing.business)
    }
    if (this.isCorrectedRegistration || this.isCorrectedChangeReg) {
      this.setBusinessInformation({
        foundingDate: entitySnapshot.businessInfo.foundingDate,
        identifier: entitySnapshot.businessInfo.identifier,
        legalName: entitySnapshot.businessInfo.legalName,
        legalType: entitySnapshot.businessInfo.legalType,
        naicsCode: entitySnapshot.businessInfo.naicsCode,
        naicsDescription: entitySnapshot.businessInfo.naicsDescription,
        nrNumber: entitySnapshot.businessInfo.nrNumber,
        ...filing.correction.business
      })
    }

    // store Name Request
    this.setNameRequest(
      filing.correction.nameRequest ||
      {
        legalType: entitySnapshot.businessInfo.legalType,
        legalName: entitySnapshot.businessInfo.legalName,
        nrNumber: entitySnapshot.businessInfo.nrNumber
      }
    )

    // store Name Translations
    if (this.isCorrectedIncorporationApplication) {
      this.setNameTranslations(
        this.mapNameTranslations(filing.correction.nameTranslations) ||
        this.mapNameTranslations(entitySnapshot.nameTranslations) ||
        []
      )
    }

    // store Office Addresses
    this.setOfficeAddresses(filing.correction.offices || entitySnapshot.addresses)

    // store current Business Contact
    this.setBusinessContact(entitySnapshot.authInfo.contact)

    // store People And Roles
    this.setPeopleAndRoles(filing.correction.parties || entitySnapshot.orgPersons)

    // store Share Classes
    if (this.isCorrectedIncorporationApplication) {
      this.setShareClasses(
        filing.correction.shareStructure?.shareClasses ||
        entitySnapshot.shareStructure.shareClasses
      )
    }

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Detail Comment
    if (filing.correction.comment) {
      // NB: remove the first line (default comment)
      const comment: string = filing.correction.comment
      const detailComment = comment.split('\n').slice(1).join('\n')
      this.setDetailComment(detailComment)
    }

    // store Folio Number
    // *** FUTURE: should we store correction.folioNumber instead?
    this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')

    // store Effective Date
    this.setEffectiveDateTimeString(filing.header.effectiveDate)
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
      ...filing.business,
      ...filing.alteration.business
    })

    // store Name Request data
    this.setNameRequest(
      filing.alteration.nameRequest ||
      {
        legalType: entitySnapshot.businessInfo.legalType,
        legalName: entitySnapshot.businessInfo.legalName,
        nrNumber: entitySnapshot.businessInfo.nrNumber
      }
    )

    // store Name Translations
    this.setNameTranslations(
      this.mapNameTranslations(filing.alteration.nameTranslations) ||
      this.mapNameTranslations(entitySnapshot.nameTranslations) ||
      []
    )

    // store Provisions Removed
    this.setProvisionsRemoved(filing.alteration.provisionsRemoved)

    // store Office Addresses **from snapshot** (because we don't change office addresses in an alteration)
    this.setOfficeAddresses(entitySnapshot.addresses)

    // store People And Roles **from snapshot** (because we don't change people and roles in an alteration)
    this.setPeopleAndRoles(entitySnapshot.orgPersons)

    // store Business Contact
    this.setBusinessContact(entitySnapshot.authInfo.contact)

    // store Share Classes and Resolution Dates
    this.setShareClasses(
      filing.alteration.shareStructure?.shareClasses ||
      entitySnapshot.shareStructure?.shareClasses
    )
    this.setNewResolutionDates(filing.alteration.shareStructure?.resolutionDates || [])

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Folio Number
    // *** FUTURE: should we store correction.folioNumber instead?
    this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')

    // if Transactional Folio Number was saved then store it
    if (filing.header.isTransactionalFolioNumber) {
      this.setTransactionalFolioNumber(filing.header.folioNumber)
    }

    // store Document Optional Email
    this.setDocumentOptionalEmail(filing.header.documentOptionalEmail)

    // store Effective Date
    this.setEffectiveDateTimeString(filing.header.effectiveDate)
    this.setIsFutureEffective(filing.header.isFutureEffective)

    // store File Number and POA
    this.setFileNumber(filing.alteration.courtOrder?.fileNumber)
    this.setHasPlanOfArrangement(filing.alteration.courtOrder?.hasPlanOfArrangement)

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

    // store Entity Type
    this.setEntityType(filing.alteration.business?.legalType || entitySnapshot.businessInfo.legalType)

    // store Business Information
    this.setBusinessInformation({
      ...filing.business,
      ...filing.alteration.business
    })

    // store Name Request data
    this.setNameRequest(
      filing.alteration.nameRequest ||
      {
        legalType: entitySnapshot.businessInfo.legalType,
        legalName: entitySnapshot.businessInfo.legalName,
        nrNumber: entitySnapshot.businessInfo.nrNumber
      }
    )
    //  add more components later
    // store Provisions Removed
    this.setProvisionsRemoved(filing.alteration.provisionsRemoved)

    // store Office Addresses **from snapshot** (because we don't change office addresses in an special resolution)
    this.setOfficeAddresses(entitySnapshot.addresses)

    // store People And Roles **from snapshot** (because we don't change people and roles in an special resolution)
    this.setPeopleAndRoles(entitySnapshot.orgPersons)

    // store Business Contact
    this.setBusinessContact(entitySnapshot.authInfo.contact)

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Folio Number
    // *** FUTURE: should we store correction.folioNumber instead?
    this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')

    // if Transactional Folio Number was saved then store it
    if (filing.header.isTransactionalFolioNumber) {
      this.setTransactionalFolioNumber(filing.header.folioNumber)
    }

    // store Document Optional Email
    this.setDocumentOptionalEmail(filing.header.documentOptionalEmail)

    // store File Number and POA
    this.setFileNumber(filing.alteration.courtOrder?.fileNumber)
    this.setHasPlanOfArrangement(filing.alteration.courtOrder?.hasPlanOfArrangement)

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
    this.setBusinessInformation({ ...entitySnapshot.businessInfo })

    // store NAICS
    if (filing.changeOfRegistration.business.naics) {
      this.setNaics(filing.changeOfRegistration.business.naics)
    }

    // store Name Request data
    this.setNameRequest(
      filing.changeOfRegistration.nameRequest ||
      {
        legalType: entitySnapshot.businessInfo.legalType,
        legalName: entitySnapshot.businessInfo.legalName,
        nrNumber: entitySnapshot.businessInfo.nrNumber
      }
    )

    // store Office Addresses
    let addresses
    if (filing.changeOfRegistration.offices?.businessOffice) {
      addresses = { businessOffice: filing.changeOfRegistration.offices.businessOffice }
    }
    this.setOfficeAddresses(addresses || entitySnapshot.addresses)

    // store People And Roles
    let orgPersons = filing.changeOfRegistration.parties || entitySnapshot.orgPersons
    // exclude Completing Party
    // (it is managed separately and added to the filing in buildChangeRegFiling())
    orgPersons = orgPersons.filter(party => !(party?.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)))
    this.setPeopleAndRoles(orgPersons)

    // store Business Contact
    this.setBusinessContact(entitySnapshot.authInfo.contact)

    // store Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // store Folio Number
    // *** FUTURE: should we store correction.folioNumber instead?
    this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')

    // if Transactional Folio Number was saved then store it
    if (filing.header.isTransactionalFolioNumber) {
      this.setTransactionalFolioNumber(filing.header.folioNumber)
    }

    // store Document Optional Email
    this.setDocumentOptionalEmail(filing.header.documentOptionalEmail)
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
    this.setEntityType(filing.business?.legalType || entitySnapshot.businessInfo.legalType)

    // store Business Information
    this.setBusinessInformation({ ...entitySnapshot.businessInfo })

    // store NAICS
    if (filing.conversion.business.naics) {
      this.setNaics(filing.conversion.business.naics)
    }

    // store Name Request data
    this.setNameRequest(
      filing.conversion.nameRequest ||
      {
        legalType: entitySnapshot.businessInfo.legalType,
        legalName: entitySnapshot.businessInfo.legalName,
        nrNumber: entitySnapshot.businessInfo.nrNumber
      }
    )

    // store Office Addresses
    let addresses
    if (filing.conversion.offices?.businessOffice) {
      addresses = { businessOffice: filing.conversion.offices.businessOffice }
    }
    this.setOfficeAddresses(addresses || entitySnapshot.addresses)

    // store People And Roles
    let orgPersons = filing.conversion.parties || entitySnapshot.orgPersons
    // exclude Completing Party
    // (it is managed separately and added to the filing in buildChangeRegFiling())
    orgPersons = orgPersons.filter(party => !(party?.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)))
    this.setPeopleAndRoles(orgPersons)

    // store Business Contact
    this.setBusinessContact(entitySnapshot.authInfo.contact)

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
    this.setBusinessInformation(entitySnapshot.businessInfo)

    // store Name Request data
    this.setNameRequest({
      legalType: entitySnapshot.businessInfo.legalType,
      legalName: entitySnapshot.businessInfo.legalName,
      nrNumber: entitySnapshot.businessInfo.nrNumber
    })

    // store People and Roles
    this.setPeopleAndRoles(entitySnapshot.orgPersons)

    // store Business Contact
    this.setBusinessContact(entitySnapshot.authInfo.contact)

    // store Office Addresses
    this.setOfficeAddresses(entitySnapshot.addresses)

    // handle entity-specific values
    switch (entitySnapshot.businessInfo.legalType) {
      case CorpTypeCd.BENEFIT_COMPANY: {
        // store Name Translations
        if (entitySnapshot.nameTranslations) {
          this.setNameTranslations(this.mapNameTranslations(entitySnapshot.nameTranslations))
        }

        // clear Provisions Removed
        this.setProvisionsRemoved(null)

        // store Share Classes and clear New Resolution Dates
        this.setShareClasses(entitySnapshot.shareStructure.shareClasses)
        this.setNewResolutionDates([])

        break
      }

      case CorpTypeCd.SOLE_PROP:
      case CorpTypeCd.PARTNERSHIP: {
        // *** FUTURE: expand here as needed
        break
      }
    }
  }

  //
  // Local helper methods
  //

  /**
   * Prepares name translations for non-draft save.
   * @returns the updated name translations array
   */
  private prepareNameTranslations () : NameTranslationIF[] {
    // Filter out and modify name translation to match schema
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
  // (at // the time of Delete there is no other prop change except action). To handle this
  // scenario, this structure needs to be kept.
  private mapNameTranslations (nameTranslations: any): NameTranslationIF[] {
    return nameTranslations?.map(x => ({
      id: x.id,
      name: x.name,
      oldName: x.oldName || null,
      action: x.action || null
    }))
  }

  /** If a Transactional Folio number was entered then override the Folio number
  * @param filing The alteration, correction, or  filing.
  */
  private buildFolioNumber (filing: AlterationFilingIF | ChgRegistrationFilingIF): void {
    const fn = this.getFolioNumber
    const tfn = this.getTransactionalFolioNumber
    if (tfn !== fn) {
      filing.header.folioNumber = tfn
      filing.header.isTransactionalFolioNumber = true
    }
  }

  /**
   * Build Staff Payment data into the filing.
   * @param filing The alteration or correction filing.
   */
  private buildStaffPayment (filing: AlterationFilingIF | CorrectionFilingIF | ConversionFilingIF): void {
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
  }

  /**
   * Parse Staff Payment data into store.
   * @param filing The alteration or correction filing to parse.
   */
  private storeStaffPayment (filing: AlterationFilingIF | CorrectionFilingIF | ConversionFilingIF): void {
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
