import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { cloneDeep } from 'lodash'
import { DateMixin } from '@/mixins/'
import { ActionBindingIF, AddressesIF, AlterationFilingIF, CertifyIF, CorrectionFilingIF, EffectiveDateTimeIF,
  EntitySnapshotIF, ChgRegistrationFilingIF, ConversionFilingIF, NameRequestIF, NameTranslationIF,
  OrgPersonIF, ShareClassIF } from '@/interfaces/'
import { CompletingPartyIF, ContactPointIF, NaicsIF, StaffPaymentIF } from '@bcrs-shared-components/interfaces/'
import { ActionTypes, EffectOfOrders, FilingTypes, PartyTypes, RoleTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums/'

/**
 * Mixin that provides the integration with the Legal API.
 */
@Component({})
export default class FilingTemplateMixin extends Mixins(DateMixin) {
  // Global getters
  @Getter isNamedBusiness!: boolean
  @Getter getNameRequestNumber!: string
  @Getter getApprovedName!: string
  @Getter getBusinessId!: string
  @Getter getCurrentDate!: string
  @Getter getCorrectedFilingId!: number
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
  @Getter getOriginalFilingDateTime!: string
  @Getter getCurrentNaics!: NaicsIF
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getNameRequest!: NameRequestIF
  @Getter getCertifyState!: CertifyIF
  @Getter getOfficeAddresses!: AddressesIF
  @Getter getBusinessContact!: ContactPointIF
  @Getter getAgreementType!: string
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter getNewResolutionDates!: string[]
  @Getter hasNewNr!: boolean
  @Getter getNewAlteration!: any // FUTURE AlterationFilingIF
  @Getter areProvisionsRemoved!: boolean
  @Getter getFileNumber!: string
  @Getter getHasPlanOfArrangement!: boolean
  @Getter haveOfficeAddressesChanged!: boolean
  @Getter getCompletingParty!: CompletingPartyIF
  @Getter isEntityTypeBEN!: boolean
  @Getter isEntityTypeCP!: boolean
  @Getter isEntityTypeSP!: boolean
  @Getter isEntityTypeGP!: boolean
  @Getter getCorrectedFilingType!: FilingTypes
  @Getter getClientErrorCorrection!: string

  // Global actions
  @Action setBusinessContact!: ActionBindingIF
  @Action setBusinessInformation!: ActionBindingIF
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
  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setStaffPayment!: ActionBindingIF
  @Action setDetailComment!: ActionBindingIF
  @Action setEntitySnapshot!: ActionBindingIF
  @Action setDocumentOptionalEmail!: ActionBindingIF
  @Action setProvisionsRemoved!: ActionBindingIF
  @Action setOriginalResolutionDates!: ActionBindingIF
  @Action setResolutionDates!: ActionBindingIF
  @Action setFileNumber!: ActionBindingIF
  @Action setHasPlanOfArrangement!: ActionBindingIF

  get defaultCorrectionDetailComment (): string {
    const date = this.apiToDate(this.getOriginalFilingDateTime)
    const yyyyMmDd = this.dateToYyyyMmDd(date)
    return `Correction for Incorporation Application filed on ${yyyyMmDd}.`
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
    const isIncorporationApplication = (this.getCorrectedFilingType === FilingTypes.INCORPORATION_APPLICATION)
    const isChangeReg = (this.getCorrectedFilingType === FilingTypes.CHANGE_OF_REGISTRATION)
    const isRegistration = (this.getCorrectedFilingType === FilingTypes.REGISTRATION)

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

    // Build correction filing
    const filing: CorrectionFilingIF = {
      header: {
        name: FilingTypes.CORRECTION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: this.getFolioNumber // original folio number, unless overridden by staff payment below
      },
      business: {
        legalType: this.getEntityType,
        identifier: this.getBusinessId,
        legalName: this.getApprovedName
      },
      correction: {
        correctedFilingId: this.getCorrectedFilingId,
        correctedFilingType: this.getCorrectedFilingType,
        correctedFilingDate: this.getCurrentDate,
        comment: `${this.defaultCorrectionDetailComment}\n${this.getDetailComment}`,
        type: this.getClientErrorCorrection
      },
      incorporationApplication: !isIncorporationApplication ? undefined : {
        nameRequest: {
          legalType: this.getEntityType,
          legalName: this.getApprovedName,
          nrNumber: this.getNameRequestNumber
        },
        nameTranslations: nameTranslations,
        offices: this.getOfficeAddresses,
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone,
          ...this.getBusinessContact.extension
            ? { extension: +this.getBusinessContact.extension }
            : {}
        },
        parties,
        shareStructure: {
          shareClasses
        },
        incorporationAgreement: {
          agreementType: this.getAgreementType
        }
      },
      // *** FUTURE: implement these:
      changeofRegistration: undefined,
      registration: undefined
    }

    // If this is a named IA then save Name Request Number and Approved Name.
    if (this.isNamedBusiness) {
      filing.incorporationApplication.nameRequest.nrNumber = this.getNameRequestNumber
      filing.incorporationApplication.nameRequest.legalName = this.getApprovedName
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
        legalType: this.getEntitySnapshot.businessInfo.legalType,
        identifier: this.getEntitySnapshot.businessInfo.identifier,
        legalName: this.getEntitySnapshot.businessInfo.legalName
      },
      alteration: {
        business: {
          identifier: this.getBusinessId,
          legalType: this.getEntityType
        },
        provisionsRemoved: this.areProvisionsRemoved,
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone,
          ...this.getBusinessContact.extension
            ? { extension: +this.getBusinessContact.extension }
            : {}
        }
      }
    }

    // Apply business name and/or type changes to filing
    if (this.hasBusinessNameChanged || this.hasBusinessTypeChanged) {
      filing.alteration.nameRequest = {
        legalType: this.getNameRequest.legalType,
        legalName: this.getNameRequest.legalName,
        nrNumber: this.getNameRequest.nrNumber
      }
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

    // Include name request info when applicable
    if (this.hasNewNr || this.hasBusinessNameChanged) filing.alteration.nameRequest = { ...this.getNameRequest }

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
        legalType: this.getEntitySnapshot.businessInfo.legalType,
        identifier: this.getEntitySnapshot.businessInfo.identifier,
        legalName: this.getEntitySnapshot.businessInfo.legalName
      },
      changeOfRegistration: {
        business: {
          natureOfBusiness: '',
          identifier: this.getBusinessId
        },
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone,
          ...this.getBusinessContact.extension
            ? { extension: +this.getBusinessContact.extension }
            : {}
        }
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
   * Builds a firm conversion filing from store data.
   * @param isDraft whether this is a draft
   * @returns the conversion filing body
   */
  buildFirmConversionFiling (isDraft: boolean): ConversionFilingIF {
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
        legalType: this.getEntitySnapshot.businessInfo.legalType,
        identifier: this.getEntitySnapshot.businessInfo.identifier,
        legalName: this.getEntitySnapshot.businessInfo.legalName
      },
      conversion: {
        business: {
          natureOfBusiness: '',
          identifier: this.getBusinessId
        },
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone || undefined, // don't include if empty
          extension: +this.getBusinessContact.extension || undefined // don't include if empty
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
   * Parses a draft IA/change/registration correction filing into the store.
   * @param filing the correction filing
   */
  parseCorrectionFiling (filing: CorrectionFilingIF): void {
    // Store business information
    this.setBusinessInformation(filing.business)

    // Store name request
    if (filing.incorporationApplication) this.setNameRequest(filing.incorporationApplication.nameRequest)
    if (filing.changeofRegistration) this.setNameRequest(filing.changeofRegistration.nameRequest)
    if (filing.registration) this.setNameRequest(filing.registration.nameRequest)

    // Store name translations
    // NB: The first time (when we initiate a correction), the `oldName` and `action` props are not
    //     available in the api response, which creates an issue of not having these props in store.
    //     Due to missing props, change event was not triggering if the action value is changed (at
    //     the time of Delete there is no other prop change except action). To handle this scenario,
    //     this structure needs to be kept.
    if (filing.incorporationApplication) { // *** FUTURE: expand for other filing types
      this.setNameTranslations(
        filing.incorporationApplication.nameTranslations?.map(x => {
          return {
            id: x.id,
            name: x.name,
            oldName: x.oldName || null,
            action: x.action || null
          }
        }) || []
      )
    }

    // Store office addresses
    if (filing.incorporationApplication) { // *** FUTURE: expand for other filing types
      this.setOfficeAddresses(filing.incorporationApplication.offices)
    }

    // Store business contact
    if (filing.incorporationApplication) { // *** FUTURE: expand for other filing types
      this.setBusinessContact({
        ...filing.incorporationApplication.contactPoint,
        confirmEmail: filing.incorporationApplication.contactPoint.email
      })
    }

    // Store people and roles
    if (filing.incorporationApplication) { // *** FUTURE: expand for other filing types
      this.setPeopleAndRoles(filing.incorporationApplication.parties || [])
    }

    // Store share classes
    if (filing.incorporationApplication) { // *** FUTURE: expand for other filing types
      if (filing.incorporationApplication.shareStructure) {
        this.setShareClasses(filing.incorporationApplication.shareStructure.shareClasses)
      } else {
        // if it exists, load data from old schema
        const incorporationApplication = filing.incorporationApplication as any
        const shareClasses = incorporationApplication.shareClasses as ShareClassIF[]
        if (shareClasses) {
          this.setShareClasses(shareClasses)
        } else {
          this.setShareClasses([])
        }
      }
    }

    // Store incorporation agreement type
    if (filing.incorporationApplication) { // *** FUTURE: expand for other filing types
      this.setIncorporationAgreementStepData({
        agreementType: filing.incorporationApplication.incorporationAgreement?.agreementType
      })
    }

    // Store certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // Store detail comment
    // NB: remove the first line (default comment)
    const comment: string = filing.correction.comment || ''
    const detailComment = comment.split('\n').slice(1).join('\n')
    this.setDetailComment(detailComment)

    // Store folio number
    this.setFolioNumber(filing.header.folioNumber)

    // Store effective date
    this.setEffectiveDateTimeString(filing.header.effectiveDate)
    this.setIsFutureEffective(filing.header.isFutureEffective)

    // Store Staff Payment data
    this.storeStaffPayment(filing)
  }

  /**
   * Parses a draft alteration filing into the store.
   * @param filing the alteration filing
   * @param entitySnapshot the latest entity snapshot
   */
  parseAlterationFiling (filing: AlterationFilingIF, entitySnapshot: EntitySnapshotIF): void {
    // Store business snapshot
    this.setEntitySnapshot(cloneDeep(entitySnapshot))

    // Store current entity type
    this.setEntityType(filing.alteration.business?.legalType || entitySnapshot.businessInfo.legalType)

    // Store business information
    this.setBusinessInformation({
      ...filing.business,
      ...filing.alteration.business
    })

    // Store name request
    this.setNameRequest(filing.alteration.nameRequest || { legalName: entitySnapshot.businessInfo.legalName })

    // Store name translations
    this.setNameTranslations(
      filing.alteration.nameTranslations?.map(x => {
        return {
          id: x.id,
          name: x.name,
          oldName: x.oldName || null,
          action: x.action || null
        }
      }) || []
    )

    // Store provisions removed
    this.setProvisionsRemoved(filing.alteration.provisionsRemoved)

    // Store office addresses **from snapshot** (because we don't change office addresses in an alteration)
    this.setOfficeAddresses(entitySnapshot.addresses)

    // Store people and roles **from snapshot** (because we don't change people and roles in an alteration)
    this.setPeopleAndRoles(entitySnapshot.orgPersons)

    // Store business contact info
    this.setBusinessContact(entitySnapshot.authInfo.contact)

    // Store share classes and resolution dates
    this.setShareClasses(
      filing.alteration.shareStructure?.shareClasses ||
      entitySnapshot.shareStructure?.shareClasses
    )
    this.setResolutionDates(filing.alteration.shareStructure?.resolutionDates || [])
    this.setOriginalResolutionDates(entitySnapshot.resolutions)

    // Store certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // Store Folio Number
    this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')

    // If Transactional Folio Number was saved then store it.
    if (filing.header.isTransactionalFolioNumber) {
      this.setTransactionalFolioNumber(filing.header.folioNumber)
    }

    // Store document optional email
    this.setDocumentOptionalEmail(filing.header.documentOptionalEmail)

    // Store effective date
    this.setEffectiveDateTimeString(filing.header.effectiveDate)
    this.setIsFutureEffective(filing.header.isFutureEffective)

    // Store Court Order date
    this.setFileNumber(filing.alteration.courtOrder?.fileNumber)
    this.setHasPlanOfArrangement(filing.alteration.courtOrder?.hasPlanOfArrangement)

    // Store Staff Payment data
    this.storeStaffPayment(filing)
  }

  /**
   * Parses a draft change of registration filing into the store.
   * @param filing the change filing
   * @param entitySnapshot the latest entity snapshot
   */
  parseChangeRegFiling (filing: ChgRegistrationFilingIF, entitySnapshot: EntitySnapshotIF): void {
    // Store business snapshot
    this.setEntitySnapshot(cloneDeep(entitySnapshot))

    // Store current entity type
    this.setEntityType(filing.business?.legalType || entitySnapshot.businessInfo.legalType)

    // Store business information
    this.setBusinessInformation({
      ...entitySnapshot.businessInfo
    })

    // Store NAICS
    if (filing.changeOfRegistration.business.naics) {
      this.setNaics(filing.changeOfRegistration.business.naics)
    }

    // Store name request
    this.setNameRequest(filing.changeOfRegistration.nameRequest || { legalName: entitySnapshot.businessInfo.legalName })

    // Store office addresses
    let addresses
    if (filing.changeOfRegistration.offices?.businessOffice) {
      addresses = { businessOffice: filing.changeOfRegistration.offices.businessOffice }
    }
    this.setOfficeAddresses(addresses || entitySnapshot.addresses)

    // Store people and roles
    let orgPersons = filing.changeOfRegistration.parties || entitySnapshot.orgPersons
    // exclude completing party
    // (it is managed separately and added to the filing in buildChangeRegFiling())
    orgPersons = orgPersons.filter(party => !(party?.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)))
    this.setPeopleAndRoles(orgPersons)

    // Store business contact info
    this.setBusinessContact(entitySnapshot.authInfo.contact)

    // Store certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // Store Folio Number
    this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')

    // If Transactional Folio Number was saved then store it.
    if (filing.header.isTransactionalFolioNumber) {
      this.setTransactionalFolioNumber(filing.header.folioNumber)
    }

    // Store document optional email
    this.setDocumentOptionalEmail(filing.header.documentOptionalEmail)
  }

  /**
   * Parses a draft firm conversion filing into the store.
   * @param filing the conversion filing
   * @param entitySnapshot the latest entity snapshot
   */
  parseFirmConversionFiling (filing: ConversionFilingIF, entitySnapshot: EntitySnapshotIF): void {
    // Store business snapshot
    this.setEntitySnapshot(cloneDeep(entitySnapshot))

    // Store current entity type
    this.setEntityType(filing.business?.legalType || entitySnapshot.businessInfo.legalType)

    // Store business information
    this.setBusinessInformation({
      ...entitySnapshot.businessInfo
    })

    // Store NAICS
    if (filing.conversion.business.naics) {
      this.setNaics(filing.conversion.business.naics)
    }

    // Store legal name (in name request object)
    this.setNameRequest({ legalName: filing.business.legalName || entitySnapshot.businessInfo.legalName })

    // Store office addresses
    let addresses
    if (filing.conversion.offices?.businessOffice) {
      addresses = { businessOffice: filing.conversion.offices.businessOffice }
    }
    this.setOfficeAddresses(addresses || entitySnapshot.addresses)

    // Store people and roles
    let orgPersons = filing.conversion.parties || entitySnapshot.orgPersons
    // exclude completing party
    // (it is managed separately and added to the filing in buildChangeRegFiling())
    orgPersons = orgPersons.filter(party => !(party?.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)))
    this.setPeopleAndRoles(orgPersons)

    // Store business contact info
    this.setBusinessContact(entitySnapshot.authInfo.contact)

    // Store certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // Store Staff Payment data
    this.storeStaffPayment(filing)
  }

  /**
   * Parses an entity snapshot into the store.
   * @param entitySnapshot the latest entity snapshot
   */
  parseEntitySnapshot (entitySnapshot = this.getEntitySnapshot): void {
    // Store business snapshot
    this.setEntitySnapshot(cloneDeep(entitySnapshot))

    // Store folio number
    this.setFolioNumber(entitySnapshot.authInfo.folioNumber || '')

    // Store current entity type
    this.setEntityType(entitySnapshot.businessInfo.legalType)

    // Store business information
    this.setBusinessInformation(entitySnapshot.businessInfo)

    // Store name request
    this.setNameRequest({
      legalType: entitySnapshot.businessInfo.legalType,
      legalName: entitySnapshot.businessInfo.legalName
    })

    // Store people and roles (aka parties)
    this.setPeopleAndRoles(entitySnapshot.orgPersons || [])

    // Store the business contact
    this.setBusinessContact(entitySnapshot.authInfo.contact)

    // Handle entity specific values
    switch (entitySnapshot.businessInfo.legalType) {
      case CorpTypeCd.BENEFIT_COMPANY: {
        // Store name translations
        this.setNameTranslations(
          entitySnapshot.nameTranslations?.map(x => {
            return {
              id: x.id,
              name: x.name,
              oldName: null,
              action: null
            }
          }) || []
        )

        // Clear provisions removed
        this.setProvisionsRemoved(null)

        // Store office addresses
        this.setOfficeAddresses(entitySnapshot.addresses)

        // Store share classes and resolution dates
        this.setShareClasses(cloneDeep(entitySnapshot.shareStructure.shareClasses))
        this.setResolutionDates([])
        this.setOriginalResolutionDates(entitySnapshot.resolutions)

        // Store incorporation agreement type
        this.setIncorporationAgreementStepData({
          agreementType: entitySnapshot.businessInfo.incorporationAgreementType
        })

        break
      }

      case CorpTypeCd.SOLE_PROP:
      case CorpTypeCd.PARTNERSHIP: {
        // Store business addresses
        this.setOfficeAddresses(entitySnapshot.addresses)
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
    return this.getNameTranslations?.filter(x => x.action !== ActionTypes.REMOVED)
      .map(x => {
        let nameTranslation = {
          name: x.name
        }
        if (x.action !== ActionTypes.ADDED) {
          nameTranslation['id'] = x.id
        }
        return nameTranslation
      })
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
