// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { cloneDeep } from 'lodash'
import { DateMixin } from '@/mixins'

// Interfaces
import {
  ActionBindingIF,
  AlterationFilingIF,
  BusinessSnapshotIF,
  CertifyIF,
  ChangeFirmIF,
  CorrectionFilingIF,
  ContactPointIF,
  EffectiveDateTimeIF,
  IncorporationAddressIf,
  OrgPersonIF,
  ShareClassIF,
  NameTranslationIF,
  NameRequestIF,
  ShareStructureIF,
  StaffPaymentIF, FirmSnapshotIF
} from '@/interfaces'

// Shared Interfaces
import { EmptyContactPoint } from '@bcrs-shared-components/interfaces'

// Constants
import { ActionTypes, CorpTypeCd, FilingTypes, EffectOfOrders, RoleTypes } from '@/enums'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums'

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
  @Getter getEntityType!: CorpTypeCd
  @Getter getCorrectedFilingId!: number
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getDocumentOptionalEmail: string
  @Getter hasBusinessNameChanged!: boolean
  @Getter hasBusinessTypeChanged!: boolean
  @Getter hasNameTranslationChanged!: boolean
  @Getter hasShareStructureChanged!: boolean
  @Getter hasNewResolutionDatesChanged!: boolean
  @Getter getPeopleAndRoles!: OrgPersonIF[]
  @Getter getShareClasses!: ShareClassIF[]
  @Getter getFolioNumber!: string
  @Getter getTransactionalFolioNumber!: string
  @Getter getStaffPayment!: StaffPaymentIF
  @Getter getDetailComment!: string
  @Getter getDefaultCorrectionDetailComment!: string
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getNameRequest!: NameRequestIF
  @Getter getCertifyState!: CertifyIF
  @Getter getOfficeAddresses!: IncorporationAddressIf | {}
  @Getter getBusinessContact!: ContactPointIF
  @Getter getAgreementType!: string
  @Getter getBusinessSnapshot!: BusinessSnapshotIF
  @Getter getFirmSnapshot!: any
  @Getter getNewResolutionDates!: string[]
  @Getter getSnapshotShareStructure!: ShareStructureIF
  @Getter hasNewNr!: boolean
  @Getter getNewAlteration!: any // FUTURE AlterationFilingIF
  @Getter getProvisionsRemoved!: boolean
  @Getter getFileNumber!: string
  @Getter getHasPlanOfArrangement!: boolean

  // Global actions
  @Action setBusinessContact!: ActionBindingIF
  @Action setBusinessInformation!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setNameTranslations!: ActionBindingIF
  @Action setNameRequest!: ActionBindingIF
  @Action setPeopleAndRoles!: ActionBindingIF
  @Action setCertifyState!: ActionBindingIF
  @Action setShareClasses!: ActionBindingIF
  @Action setEffectiveDateTimeString!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setTransactionalFolioNumber!: ActionBindingIF
  @Action setFilingDateTime!: ActionBindingIF
  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setStaffPayment!: ActionBindingIF
  @Action setDetailComment!: ActionBindingIF
  @Action setBusinessSnapshot!: ActionBindingIF
  @Action setFirmSnapshot!: ActionBindingIF
  @Action setDocumentOptionalEmail!: ActionBindingIF
  @Action setProvisionsRemoved!: ActionBindingIF
  @Action setOriginalResolutionDates!: ActionBindingIF
  @Action setResolutionDates!: ActionBindingIF
  @Action setFileNumber: ActionBindingIF
  @Action setHasPlanOfArrangement!: ActionBindingIF

  /**
   * Builds an Incorporation Application correction filing from store data. Used when saving a filing.
   * @param isDraft whether this is a draft
   * @returns the incorporation application filing body
   */
  buildIaCorrectionFiling (isDraft: boolean): CorrectionFilingIF {
    let parties = this.getPeopleAndRoles
    let shareClasses = this.getShareClasses
    let nameTranslations = this.getNameTranslations

    // if filing and paying, filter out removed entities and omit the 'action' properties
    if (!isDraft) {
      // Filter out parties actions
      parties = parties.filter(x => x.action !== ActionTypes.REMOVED)
        .map((x) => { const { action, ...rest } = x; return rest })

      // Filter out class actions
      shareClasses = shareClasses.filter(x => x.action !== ActionTypes.REMOVED)
        .map((x) => { const { action, ...rest } = x; return rest })

      // Filter out series actions
      for (const [index, share] of shareClasses.entries()) {
        shareClasses[index].series = share.series?.filter(x => x.action !== ActionTypes.REMOVED)
          .map((x) => { const { action, ...rest } = x; return rest })
      }

      nameTranslations = this.prepareNameTranslations()
    }

    // Build correction filing
    let filing: CorrectionFilingIF = {
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
        correctedFilingType: FilingTypes.INCORPORATION_APPLICATION,
        correctedFilingDate: this.getCurrentDate,
        comment: `${this.getDefaultCorrectionDetailComment}\n${this.getDetailComment}`
      },
      incorporationApplication: {
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
          extension: this.getBusinessContact.extension
        },
        parties,
        shareStructure: {
          shareClasses
        },
        incorporationAgreement: {
          agreementType: this.getAgreementType
        }
      }
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
   * Builds an alteration filing from store data. Used when saving a filing.
   * @param isDraft whether this is a draft
   * @returns the alteration filing body
   */
  buildAlterationFiling (isDraft: boolean): AlterationFilingIF {
    let parties = this.getPeopleAndRoles
    let shareClasses = this.getShareClasses
    let nameTranslations = this.getNameTranslations

    // if filing and paying, filter out removed entities and omit the 'action' properties
    if (!isDraft) {
      // Filter out parties actions
      parties = parties.filter(x => x.action !== ActionTypes.REMOVED)
        .map((x) => { const { action, ...rest } = x; return rest })

      // Filter out class actions
      shareClasses = shareClasses.filter(x => x.action !== ActionTypes.REMOVED)
        .map((x) => { const { action, ...rest } = x; return rest })

      // Filter out series actions
      for (const [index, share] of shareClasses.entries()) {
        shareClasses[index].series = share.series?.filter(x => x.action !== ActionTypes.REMOVED)
          .map((x) => { const { action, ...rest } = x; return rest })
      }

      nameTranslations = this.prepareNameTranslations()
    }

    // Build alteration filing
    let filing: AlterationFilingIF = {
      header: {
        name: FilingTypes.ALTERATION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: this.getFolioNumber
      },
      business: {
        foundingDate: this.getBusinessSnapshot.businessInfo.foundingDate,
        legalType: this.getBusinessSnapshot.businessInfo.legalType,
        identifier: this.getBusinessSnapshot.businessInfo.identifier,
        legalName: this.getBusinessSnapshot.businessInfo.legalName
      },
      alteration: {
        business: {
          identifier: this.getBusinessId,
          legalType: this.getEntityType
        },
        provisionsRemoved: this.getProvisionsRemoved,
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone,
          extension: this.getBusinessContact.extension
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

    // If a Transactional Folio Number was entered then override the folio number
    // in the filing and save a flag to correctly restore a draft if needed.
    const fn = this.getFolioNumber
    const tfn = this.getTransactionalFolioNumber
    if (tfn !== fn) {
      filing.header.folioNumber = tfn
      filing.header.isTransactionalFolioNumber = true
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

    return filing
  }

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

  /**
   * Parses a draft correction filing into the store.
   * @param filing the correction filing
   */
  parseCorrection (filing: CorrectionFilingIF): void {
    // Store business information
    this.setBusinessInformation(filing.business)

    // Store name request
    this.setNameRequest(filing.incorporationApplication.nameRequest)

    // Store name translations
    // NB: The first time (when we initiate a correction), the `oldName` and `action` props are not
    //     available in the api response, which creates an issue of not having these props in store.
    //     Due to missing props, change event was not triggering if the action value is changed (at
    //     the time of Delete there is no other prop change except action). To handle this scenario,
    //     this structure needs to be kept.
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

    // Store office addresses
    this.setOfficeAddresses(filing.incorporationApplication.offices)

    // Store business contact
    this.setBusinessContact({
      ...filing.incorporationApplication.contactPoint,
      confirmEmail: filing.incorporationApplication.contactPoint.email
    })

    // Store people and roles
    this.setPeopleAndRoles(filing.incorporationApplication.parties || [])

    // Store share classes
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

    // Store incorporation agreement type
    this.setIncorporationAgreementStepData({
      agreementType: filing.incorporationApplication.incorporationAgreement?.agreementType
    })

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

    // Store filing date-time
    this.setFilingDateTime(filing.header.date)

    // Store effective date
    this.setEffectiveDateTimeString(filing.header.effectiveDate)
    this.setIsFutureEffective(filing.header.isFutureEffective)

    // Restore Staff Payment data
    this.storeStaffPayment(filing)
  }

  /**
   * Parses a draft alteration filing into the store.
   * @param filing the alteration filing
   * @param businessSnapshot the latest business snapshot
   */
  parseAlteration (filing: AlterationFilingIF, businessSnapshot: BusinessSnapshotIF): void {
    // Store business snapshot
    this.setBusinessSnapshot(businessSnapshot)

    // Restore current entity type
    this.setEntityType(filing.alteration.business?.legalType || businessSnapshot.businessInfo.legalType)

    // Restore business information
    this.setBusinessInformation({
      ...filing.business,
      ...filing.alteration.business
    })

    // Restore name request
    this.setNameRequest(filing.alteration.nameRequest || { legalName: businessSnapshot.businessInfo.legalName })

    // Restore name translations
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

    // Restore provisions removed
    this.setProvisionsRemoved(filing.alteration.provisionsRemoved)

    // Store office addresses **from snapshot** (because we don't change office addresses in an alteration)
    this.setOfficeAddresses(businessSnapshot.incorporationAddress)

    // Store people and roles **from snapshot** (because we don't change people and roles in an alteration)
    this.setPeopleAndRoles(
      businessSnapshot.orgPersons?.map(director => {
        return {
          officer: {
            firstName: director.officer.firstName,
            lastName: director.officer.lastName
          },
          mailingAddress: director.deliveryAddress,
          deliveryAddress: director.mailingAddress,
          roles: [
            {
              roleType: director.role in RoleTypes ? director.role
                : Object.values(RoleTypes).find(role => {
                  if (role.toLocaleLowerCase() === director.role.toLocaleLowerCase()) {
                    return role
                  }
                }),
              appointmentDate: director.appointmentDate,
              cessationDate: null
            }
          ]
        }
      }) || []
    )
    // Restore share classes and resolution dates
    this.setShareClasses(
      filing.alteration.shareStructure?.shareClasses ||
      businessSnapshot.shareStructure?.shareClasses
    )
    this.setResolutionDates(filing.alteration.shareStructure?.resolutionDates || [])
    this.setOriginalResolutionDates(businessSnapshot.resolutions)

    // Restore business contact
    const contactPoint = filing.alteration.contactPoint
      ? filing.alteration.contactPoint
      : businessSnapshot.authInfo.contacts[0]

    this.setBusinessContact({
      ...contactPoint,
      confirmEmail: filing.alteration.contactPoint?.email || businessSnapshot.authInfo.contacts[0].email
    })

    // Restore certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // Restore Folio Number
    this.setFolioNumber(businessSnapshot.authInfo.folioNumber || '')

    // If Transactional Folio Number was saved then restore it.
    if (filing.header.isTransactionalFolioNumber) {
      this.setTransactionalFolioNumber(filing.header.folioNumber)
    }

    // Restore filing date
    this.setFilingDateTime(filing.header.date)

    // Restore document optional email
    this.setDocumentOptionalEmail(filing.header.documentOptionalEmail)

    // Restore effective date
    this.setEffectiveDateTimeString(filing.header.effectiveDate)
    this.setIsFutureEffective(filing.header.isFutureEffective)

    // Restore Court Order date
    this.setFileNumber(filing.alteration.courtOrder?.fileNumber)
    this.setHasPlanOfArrangement(filing.alteration.courtOrder?.hasPlanOfArrangement)

    // Restore Staff Payment data
    this.storeStaffPayment(filing)
  }

  /**
   * Parses a draft change filing into the store.
   * @param filing the change filing
   * @param firmSnapshot the latest business snapshot
   */
  parseChangeFirm (filing: ChangeFirmIF, firmSnapshot: FirmSnapshotIF): void {
    // Store business snapshot
    this.setFirmSnapshot(firmSnapshot)

    // Restore current entity type
    this.setEntityType(filing.changeFirm.business?.legalType || firmSnapshot.businessInfo.legalType)

    // Restore business information
    this.setBusinessInformation({
      ...filing.business,
      ...filing.changeFirm.business
    })

    // Restore name request
    this.setNameRequest(filing.changeFirm.nameRequest || { legalName: firmSnapshot.businessInfo.legalName })

    // Store office addresses **from snapshot**
    this.setOfficeAddresses(filing.changeFirm.businessAddresses || firmSnapshot.businessAddress)

    // Store people and roles **from snapshot** (because we don't change people and roles in an alteration)
    this.setPeopleAndRoles(
      firmSnapshot.orgPersons?.map(director => {
        return {
          officer: {
            firstName: director.officer.firstName,
            lastName: director.officer.lastName
          },
          mailingAddress: director.deliveryAddress,
          deliveryAddress: director.mailingAddress,
          roles: [
            {
              roleType: director.role in RoleTypes ? director.role
                : Object.values(RoleTypes).find(role => {
                  if (role.toLocaleLowerCase() === director.role.toLocaleLowerCase()) {
                    return role
                  }
                }),
              appointmentDate: director.appointmentDate,
              cessationDate: null
            }
          ]
        }
      }) || []
    )

    // Restore business contact
    const contactPoint = filing.changeFirm.contactPoint
      ? filing.changeFirm.contactPoint
      : firmSnapshot.authInfo.contacts[0]

    this.setBusinessContact({
      ...contactPoint,
      confirmEmail: filing.changeFirm.contactPoint?.email || firmSnapshot.authInfo.contacts[0].email
    })

    // Restore certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // Restore Folio Number
    this.setFolioNumber(firmSnapshot.authInfo.folioNumber || '')

    // If Transactional Folio Number was saved then restore it.
    if (filing.header.isTransactionalFolioNumber) {
      this.setTransactionalFolioNumber(filing.header.folioNumber)
    }

    // Restore filing date
    this.setFilingDateTime(filing.header.date)

    // Restore document optional email
    this.setDocumentOptionalEmail(filing.header.documentOptionalEmail)
  }

  /**
   * Parses a business snapshot into the store.
   * @param businessSnapshot the latest business snapshot
   */
  parseBusinessSnapshot (businessSnapshot = this.getBusinessSnapshot): void {
    // Store business snapshot
    this.setBusinessSnapshot(businessSnapshot)

    // Store folio number
    this.setFolioNumber(businessSnapshot.authInfo.folioNumber || '')

    // Store current entity type
    this.setEntityType(businessSnapshot.businessInfo.legalType)

    // Store business information
    this.setBusinessInformation(businessSnapshot.businessInfo)

    // Store name request
    this.setNameRequest({
      legalType: businessSnapshot.businessInfo.legalType,
      legalName: businessSnapshot.businessInfo.legalName,
      // *** TODO: Founding Date is not needed in Name Request object???
      foundingDate: businessSnapshot.businessInfo.foundingDate
    })

    // Store name translations
    this.setNameTranslations(
      businessSnapshot.nameTranslations?.map(x => {
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
    this.setOfficeAddresses(businessSnapshot.incorporationAddress)

    // Store people and roles
    this.setPeopleAndRoles(
      businessSnapshot.orgPersons?.map(director => {
        return {
          officer: {
            firstName: director.officer.firstName,
            lastName: director.officer.lastName
          },
          mailingAddress: director.deliveryAddress,
          deliveryAddress: director.mailingAddress,
          roles: [
            {
              roleType: director.role in RoleTypes ? director.role
                : Object.values(RoleTypes).find(role => {
                  if (role.toLocaleLowerCase() === director.role.toLocaleLowerCase()) {
                    return role
                  }
                }),
              appointmentDate: director.appointmentDate,
              cessationDate: null
            }
          ]
        }
      }) || []
    )

    // Store share classes and resolution dates
    this.setShareClasses(cloneDeep(businessSnapshot.shareStructure.shareClasses))
    this.setResolutionDates([])
    this.setOriginalResolutionDates(businessSnapshot.resolutions)

    // Store the first business contact
    let contactPoint = cloneDeep(EmptyContactPoint)
    const contact = businessSnapshot.authInfo.contacts[0]
    if (contact) {
      contactPoint = {
        ...contact,
        confirmEmail: contact.email
      }
    }
    this.setBusinessContact(contactPoint)
  }

  /**
   * Parses a firm snapshot into the store.
   * @param firmSnapshot the latest firm snapshot
   */
  parseFirmSnapshot (firmSnapshot = this.getFirmSnapshot): void {
    // Store business snapshot
    this.setFirmSnapshot(firmSnapshot)

    // Store folio number
    this.setFolioNumber(firmSnapshot.authInfo.folioNumber || '')

    // Store current entity type
    this.setEntityType(firmSnapshot.businessInfo.legalType)

    // Store business information
    this.setBusinessInformation(firmSnapshot.businessInfo)

    // Store name request
    this.setNameRequest({
      legalType: firmSnapshot.businessInfo.legalType,
      legalName: firmSnapshot.businessInfo.legalName
    })

    // Store office addresses
    this.setOfficeAddresses(firmSnapshot.incorporationAddress)

    // Store people and roles
    this.setPeopleAndRoles(
      firmSnapshot.orgPersons?.map(director => { // ToDo: To be Proprietor or Partner
        return {
          officer: {
            firstName: director.officer.firstName,
            lastName: director.officer.lastName
          },
          mailingAddress: director.deliveryAddress,
          deliveryAddress: director.mailingAddress,
          roles: [
            {
              roleType: director.role in RoleTypes ? director.role
                : Object.values(RoleTypes).find(role => {
                  if (role.toLocaleLowerCase() === director.role.toLocaleLowerCase()) {
                    return role
                  }
                }),
              appointmentDate: director.appointmentDate,
              cessationDate: null
            }
          ]
        }
      }) || []
    )

    // Store the first business contact
    let contactPoint = cloneDeep(EmptyContactPoint)
    const contact = firmSnapshot.authInfo.contacts[0]
    if (contact) {
      contactPoint = {
        ...contact,
        confirmEmail: contact.email
      }
    }
    this.setBusinessContact(contactPoint)
  }

  /** Build Staff Payment data into the filing.
   * @param filing The alteration or correction filing.
   */
  private buildStaffPayment (filing: AlterationFilingIF | CorrectionFilingIF): void {
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

  /** Parse Staff Payment data into store.
   * @param filing The alteration or correction filing to parse.
   */
  private storeStaffPayment (filing: AlterationFilingIF | CorrectionFilingIF): void {
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
